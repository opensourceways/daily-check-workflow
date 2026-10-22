import { defineConfig } from 'vitepress'

const SITE = {
  url: 'https://docs.example.com',
  name: '站点名称',
  description: '站点一句话描述',
  orgName: '组织正式名称',
  orgLogo: 'https://docs.example.com/logo.png',
  defaultImage: 'https://docs.example.com/og-default.png',
  lang: 'zh-CN',
}

function organizationNode() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.orgName,
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: SITE.orgLogo },
    description: SITE.description,
    sameAs: ['https://github.com/example-org'],
  }
}

function webSiteNode() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': `${SITE.url}/#organization` },
  }
}

function pageUrl(relativePath: string) {
  return `${SITE.url}/${relativePath}`.replace(/index\.md$/, '').replace(/\.md$/, '')
}

function breadcrumbNode(pageData: any, url: string) {
  const segments = pageData.relativePath.replace(/\/?index\.md$/, '').replace(/\.md$/, '').split('/').filter(Boolean)
  if (segments.length === 0) return null
  const items: Array<{ name: string; item?: string }> = [{ name: '首页', item: `${SITE.url}/` }]
  let acc = ''
  for (const s of segments) {
    acc += `/${s}`
    items.push({ name: s, item: `${SITE.url}${acc}` })
  }
  items[items.length - 1] = { name: pageData.title }
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((it, i) => {
      const li: Record<string, unknown> = { '@type': 'ListItem', position: i + 1, name: it.name }
      if (it.item) li.item = it.item
      return li
    }),
  }
}

function articleNode(pageData: any, url: string) {
  const node: Record<string, unknown> = {
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: String(pageData.title).slice(0, 110),
    image: pageData.frontmatter.image || SITE.defaultImage,
    author: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: url,
    inLanguage: SITE.lang,
    isPartOf: { '@id': `${SITE.url}/#website` },
  }
  if (pageData.description) node.description = pageData.description
  const date = pageData.frontmatter.date
  if (date) node.datePublished = new Date(date).toISOString()
  if (pageData.lastUpdated) node.dateModified = new Date(pageData.lastUpdated).toISOString()
  return node
}

export default defineConfig({
  lastUpdated: true,
  head: [
    ['script', { type: 'application/ld+json' }, JSON.stringify(organizationNode())],
    ['script', { type: 'application/ld+json' }, JSON.stringify(webSiteNode())],
  ],
  transformPageData(pageData) {
    if (pageData.relativePath === '404.md') return
    const url = pageUrl(pageData.relativePath)
    const graph: Array<Record<string, unknown>> = [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: pageData.title,
        isPartOf: { '@id': `${SITE.url}/#website` },
        inLanguage: SITE.lang,
      },
    ]
    if (pageData.description) graph[0].description = pageData.description
    const breadcrumb = breadcrumbNode(pageData, url)
    if (breadcrumb) {
      graph.push(breadcrumb)
      graph[0].breadcrumb = { '@id': `${url}#breadcrumb` }
    }
    if (pageData.frontmatter.layout !== 'home') graph.push(articleNode(pageData, url))
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })])
  },
})
