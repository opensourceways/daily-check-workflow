# Sitemap 实现方式

> 本文总结两类前端项目（VitePress / Nuxt）在**构建时生成 sitemap.xml** 的通用实现，涉及的共享基础设施为 `@opendesign-plus` 仓库中的两个包：
>
> - `@opendesign-plus/plugins/vite/generate-lastmod-changefreq` —— Vite 插件，构建期基于 git 历史生成"页面 → lastmod/changefreq"映射 JSON
> - `@opendesign-plus/nuxt-sitemap` —— Nuxt 模块，内部注册上述 Vite 插件，并在构建结束后自行扫描产物生成 sitemap XML（不依赖 `@nuxtjs/sitemap`）
>
> VitePress 项目还使用 `@opendesign-plus/geo-scripts/vitepress-sitemap-transformer` 作为 `sitemap.transformItems` 的规则合并助手；XML 本体由 VitePress 官方 sitemap 能力产出。

## 总体数据流

两条链路的共同思路：**lastmod/changefreq 的计算（Vite 插件，build 早期）与 XML 的生成（框架产物阶段）解耦**，中间通过一份 `last-modified.json` 文件传递。

```
Vite 构建 (buildEnd/closeBundle)
  └─ generate-lastmod-changefreq 插件
       模块图匹配页面入口 → 收集每页依赖文件 → 单次 git log 流式遍历取最新提交时间
       → 输出 last-modified.json：{ "<相对rootDir的页面路径>": { lastmod, changefreq } }

产物阶段
  ├─ VitePress：官方 sitemap 生成时读入 json，经 transformItems 合并 lastmod/changefreq/priority → dist/sitemap.xml
  └─ Nuxt：nuxt hook('close') 后扫描 .output/public 的 index.html 目录得到路由清单，按 `pages<route>.vue` 键查 json → 流式写出 sitemap.xml
```

## 共享插件：`@opendesign-plus/plugins/vite/generate-lastmod-changefreq`

一个 Vite `Plugin`（name: `vite-last-modified`），只在**生产构建的非 SSR 环境**运行（`NODE_ENV !== 'production'` 或 SSR 环境直接跳过）。

### 选项

| 选项 | 类型 | 说明 |
|------|------|------|
| `pageEntryPattern` | `string \| RegExp \| Array` | 页面入口文件（相对 rootDir）的 glob 或正则匹配集合。VitePress 项目传 markdown 页面 glob；Nuxt 模块默认传 `**/pages/**/*.vue` |
| `rootDir` | `string` | git 仓库根 / 应用根，相对路径以此为基准 |
| `outputFile` | `string` | 输出 JSON 的绝对路径，默认 `<rootDir>/last-modified.json`。可指到仓库级共享目录，供产物阶段读取 |
| `ignoreDeps` | `string[]` | glob 集合，从依赖图遍历中剔除（如公共组件、utils、i18n、静态资源目录），避免公共文件改动把全站 lastmod 都刷新 |
| `modifyDepMap` | `(map: Map<entry, Set<dep>>) => map \| void \| Promise` | 钩子，允许在计算时间戳前重写"入口 → 依赖集合"映射（用于动态路由页的重新归并，见下文） |

### 执行流程（`buildEnd` → `closeBundle`）

1. **匹配入口**：遍历 Vite 模块图（`getModuleIds`），取 rootDir 内且命中 `pageEntryPattern` 的模块作为页面入口。
2. **收集依赖**（Phase 1，纯同步）：对每个入口递归展开 `importedIds`，跳过 `node_modules`、rootDir 外文件与 `ignoreDeps` 命中的文件，得到 `depMap: Map<entry, Set<file>>`。
3. **可选重写**：调用 `modifyDepMap(depMap)`，返回新 Map 则替换。
4. **单次 git log 采集**（Phase 2）：把所有涉及的文件去重后，**只跑一次** `git -c core.quotepath=false log --name-status -M --relative --format=%x00%at`（以 rootDir 为 cwd，由子进程流式输出）。提交从新到旧，每个跟踪文件首次命中即为其最新提交时间；用一张重命名别名表（`R`/`C` 状态行）把改名前旧路径归属到当前文件，等效模拟 `git log --follow`；全部文件命中后提前 kill 进程。返回 `Map<相对路径, 毫秒时间戳>`。
5. **计算 lastmod/changefreq**（Phase 3）：每页 `lastmod = max(其依赖集合中各文件的最新提交时间)`；`changefreq` 按"最新提交距当前时间的差值"分档：`<7d → daily`，`<30d → weekly`，`<365d → monthly`，否则 `yearly`。
6. **落盘**（`closeBundle`）：按 key 排序后写入 `outputFile`，形如：

```json
{
  "zh/guide/index.md": { "lastmod": 1753849200000, "changefreq": "weekly" },
  "pages/blog/[...slug].vue": { "lastmod": 1753800000000, "changefreq": "daily" }
}
```

> 历史备注：旧版逐文件 `git log --follow` + 多次提交采样 + 并发参数的实现已废弃，`concurrency`、`commitCount` 选项保留但不再使用。

## VitePress 项目的实现

VitePress **自带的 sitemap 能力**负责路由清单与 XML 序列化：配置 `sitemap.hostname` 后，`vitepress build` 会收集全部 markdown 页面（受 `srcExclude` 排除、frontmatter `sitemap: false` 排除），按 locale 前缀对同名多语言页面分组自动生成 `xhtml:link` alternates，每项先产出 `{ url, lastmod }`（lastmod 默认取源文件 git 时间戳），随后调用 `sitemap.transformItems`，最终经 `sitemap` npm 包的 `SitemapStream` 写出 `.vitepress/dist/sitemap.xml`（`url/lastmod/changefreq/priority` 均在此序列化）。

项目侧只做两件事：

### 1. 注册 lastmod 插件，产出映射文件

```ts
// .vitepress/config.ts
import viteLastModifiedPlugin from '@opendesign-plus/plugins/vite/generate-lastmod-changefreq';

export default defineConfig({
  vite: {
    plugins: [
      viteLastModifiedPlugin({
        rootDir: <内容根>,                      // 通常即 app 目录
        pageEntryPattern: ['zh/**/*.md', 'en/**/*.md'],  // markdown 页面入口
        ignoreDeps: ['**/shared/**', '**/utils/**', '**/composables/**', '**/i18n/**', '**/assets/**'],
        outputFile: <仓库级共享路径>/last-modified.json,
      }),
    ],
  },
});
```

### 2. `transformItems` 中合并 json 与业务规则

```ts
import sitemapItemTransformer from '@opendesign-plus/geo-scripts/vitepress-sitemap-transformer';

sitemap: {
  hostname: SITE_URL,
  transformItems: sitemapItemTransformer(
    items => {
      const table = JSON.parse(readFileSync(lastModifiedJsonPath, 'utf-8'));
      for (const item of items) {
        // item.url 为相对 URL（是否带 .html 取决于 cleanUrls），还原成 json key：
        const base = item.url.replace(/\.html$/, '').replace(/\/+$/, '');
        Object.assign(item, table[`${base}/index.md`] || table[`${base}.md`]);
        if (!item.lastmod) item.lastmod = Date.now();          // 兜底
        if (!item.changefreq || item.changefreq === 'never') item.changefreq = 'weekly';
        item.priority ??= 0.5;
      }
      return items;
    },
    {
      '^(zh|en)/some-section/?$': { priority: 0.8 },  // ^ 开头的键按正则匹配 url
      'zh/specific-page':         { priority: 1.0 },  // 精确 URL 键优先级最高
    },
  ),
}
```

要点：

- **json key 对齐**：插件 key 是相对 rootDir 的源文件路径（如 `zh/xxx/index.md`），`transformItems` 需把 `item.url` 反向映射回该 key。
- **兜底策略**：json 缺失/读取失败时 `lastmod` 回退为构建当前时间；`changefreq` 缺失或为 `never` 时统一改 `weekly`。
- **动态路由页**：由 `*.paths.ts` 生成的页面其 git 时间戳只反映模板文件，无法反映数据变化——可在 transform 阶段按 URL 模式从数据源（如集合数据中的日期字段）直接覆盖 `lastmod`。
- **`sitemapItemTransformer` 本身**：接受变长参数序列（函数步骤 + 规则对象步骤），规则对象中以 `^` 起始的键编译为正则匹配 `item.url`，精确 URL 键最后合并（覆盖正则命中值），返回合并后的 items 数组。

## Nuxt 项目的实现

不使用 `@nuxtjs/sitemap`，改用自研 `@opendesign-plus/nuxt-sitemap` 模块（模块 configKey 为 `sitemap`），在 `nuxt.config.ts` 的 `sitemap` 键下配置。

### 模块选项

| 选项 | 说明 |
|------|------|
| `hostname` | 站点绝对 URL；缺失时模块只注册 Vite 插件、不生成 XML |
| `nuxtAppRoot` | 应用根目录（作为插件 rootDir 与 `pages` 键前缀基准） |
| `lastmodAndChangefreqOptions` | 透传给 generate-lastmod-changefreq 插件的选项（`pageEntryPattern` 除外，固定为 `**/pages/**/*.vue`；常用 `outputFile`、`ignoreDeps`、`modifyDepMap`） |
| `fallbackLastmod` | 取不到 git lastmod 的页面（典型为动态路由）回退为**生成时刻 + daily** |
| `ignore` | glob 集合，按最终 URL 路径排除 |
| `shouldIgnore` | 自定义路径过滤函数，返回 `true` 则不进 sitemap（如过滤内容中畸形外链被当相对路径爬出的脏 URL；模块另内置冒号/引号脏路径防御） |
| `languages` + `getAlternate(path, lang)` | 多语言互译映射；对每个 URL 逐语言调用，返回的 alternate 路径**必须也存在于爬取到的路由集合**才会输出 `<xhtml:link rel="alternate" hreflang>` |
| `transformItem(item)` | 序列化前逐项改写（如按路径正则给 `priority` 分档） |
| `index` | 多文件拆分：`items: [{ pathPrefix, filename, loc }]` 按路径前缀分组各写一个 XML；配置 `indexFilename` 时额外生成 sitemap 索引文件 |

### 执行流程

1. **setup 阶段**：`addVitePlugin(generateLastmodAndChangefreq({ rootDir: nuxtAppRoot, pageEntryPattern: '**/pages/**/*.vue', ...lastmodAndChangefreqOptions }))` —— 与 VitePress 链路共用同一插件，入口从 md 换成 pages 目录下的 vue 页面组件（其 import 图即页面依赖）。
2. **构建结束（`nuxt.hook('close')`）**：递归扫描 `.output/public` 下所有 `index.html` 所在目录，得到**实际预渲染出来的路由清单**（因此 sitemap 内容 = 预渲染产物，`nitro.prerender` 的 `routes`/`ignore` 直接决定收录范围）；依次应用 `ignore`、`shouldIgnore`、脏路径过滤，并按 `index.pathPrefix` 分组。
3. **合并 lastmod**：读取插件产出的 json，按路由反查键——`` `pages${path}/index.vue` `` 或 `` `pages${path}.vue` ``（与插件输出 key 的"相对 nuxtAppRoot 路径"约定对齐）；`lastmod` 毫秒时间戳转 ISO 字符串；查不到且开启 `fallbackLastmod` 则用当前时间 + `changefreq: daily`。
4. **组装 XML**：生成器函数流式写盘（`createWriteStream` + `pipeline`），根节点带 sitemap/xhtml/news/image/video 命名空间；每项 = `{ loc, ...lastmod/changefreq/priority }` 经 `transformItem` 后逐字段序列化为子标签，再追加 alternates。每个 `index.items`（或默认单文件 `sitemap.xml`）写到对应前缀目录下；配置 `indexFilename` 时最后生成 `<sitemapindex>`。

### 动态路由（content 集合驱动页）的 lastmod 处理

catch-all 页面（如 `pages/xxx/[...slug].vue`）由内容集合（`content/` 下的 md）或接口数据填充，模块图上所有实例共享同一个模板文件，git 时间戳无法细化到单页。通用解法是利用插件的 `modifyDepMap`：

```ts
lastmodAndChangefreqOptions: {
  async modifyDepMap(map) {
    // 删除模板入口
    map.delete(join(root, 'pages/news/[...slug].vue'));
    // 为每个内容文件建立"虚拟页面入口 → 自身"的映射：
    // content/news/a/b.md → key: pages/news/a/b.vue, deps: {content/news/a/b.md}
    for (const file of walkContentDir('content/news')) {
      map.set(filePath.replace('/content/', '/pages/').replace(/md$/, 'vue'), new Set([filePath]));
    }
  },
}
```

这样 json 中出现与真实路由一一对应的键，模块第 2 步的 `pages${path}.vue` 反查即可命中每个动态页自己的内容文件提交时间（前提：内容文件的相对路径与最终路由路径可互换，构建时已把内容路由预渲染出来）。

## 两条链路对比

| 维度 | VitePress | Nuxt |
|------|-----------|------|
| XML 生成者 | 官方 sitemap 能力（SitemapStream） | 自研模块手写流式序列化 |
| 路由来源 | 扫描 markdown 页面（srcExclude / frontmatter `sitemap:false` 过滤） | 扫描 `.output/public` 预渲染产物（= 实际可访问页面） |
| lastmod 计算 | 共用 generate-lastmod-changefreq 插件（入口为 md） | 同插件（入口为 pages/*.vue），由模块自动注册 |
| 与 json 的对齐 | transformItems 中 URL → `<base>/index.md` 手动反查 | 模块内置 URL → `pages<path>.vue` 反查 |
| 动态路由兜底 | transform 阶段按 URL 模式从数据源取时间戳 | `fallbackLastmod`（当前时间 + daily）或 `modifyDepMap` 归并到内容文件 |
| hreflang | 官方按 locales 自动分组 | `languages` + `getAlternate` 自定义映射 |
| changefreq | 插件分档产出，缺失回退 weekly | 插件分档产出，fallback 时为 daily |
| priority | transformItems 规则表（sitemapItemTransformer） | `transformItem` 按路径正则分档 |
| 多文件/索引 | 不支持（官方单文件） | `index.items` 按前缀拆分 + `<sitemapindex>` |
