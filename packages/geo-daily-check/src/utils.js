export {
  log,
  shouldIgnore,
  pickRandom,
  pathnameToKey,
  normalizePathname,
  matchGlob,
  iterateFiles,
  HTML_IGNORE,
} from '@geo-workflow/core';

export const CHECK_DIMENSIONS = [
  'robots-txt',
  'sitemap-access',
  'sitemap-tdk',
  'sitemap-schema',
  'sitemap-priority',
  'url-access',
  'llms-txt',
  'sitemap-coverage',
  'ssr-rendering',
  'tdk-schema-semantic',
  'link-anchor-check',
];

export const DIMENSION_DESCRIPTIONS = {
  'robots-txt': 'robots.txt 不存在、全站封禁爬虫或未声明 Sitemap',
  'sitemap-access': 'sitemap 无法访问或无有效内容',
  'sitemap-tdk': '页面TDK为空或与同语言首页一致，未配置页面专属TDK',
  'sitemap-schema': '页面HTML缺少JSON-LD结构化数据script',
  'sitemap-priority': 'sitemap条目缺少priority属性',
  'url-access': 'URL无法访问',
  'llms-txt': 'llms.txt/llms-full.txt缺失或为空',
  'sitemap-coverage': '构建页面未被sitemap收录',
  'ssr-rendering': '页面疑似客户端渲染(CSR)，不利于SEO/GEO',
  'tdk-schema-semantic': 'TDK/Schema 语义不一致，内容与页面实际内容不符',
  'link-anchor-check': '导航链接使用 JS 跳转而非 <a href>，影响 SEO/GEO 可发现性',
};
