export default defineNuxtConfig({
  modules: ['nuxt-llms'],

  llms: {
    domain: 'https://www.example.com',
    title: '站点名称',
    description: '一句话描述',

    sections: [
      {
        title: 'Docs',
        description: '产品文档',
        links: [
          { title: '快速开始', description: '五分钟上手', href: 'https://www.example.com/docs/quick-start' },
          { title: 'API 参考', description: '全部接口说明', href: 'https://www.example.com/docs/api' },
        ],
      },
    ],

    notes: '备注信息（固定出现在文件末尾）',

    full: {
      title: '站点名称 — Full Documentation',
      description: '全部内容的单文件版本',
    },
  },
})
