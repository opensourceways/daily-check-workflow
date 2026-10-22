export default defineNuxtConfig({
  site: {
    url: 'https://www.example.com',
    name: '站点名称',
    description: '站点一句话描述',
  },

  modules: ['nuxt-schema-org'],

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: '组织正式名称',
      logo: '/logo.png',
      url: 'https://www.example.com',
    },
  },
})
