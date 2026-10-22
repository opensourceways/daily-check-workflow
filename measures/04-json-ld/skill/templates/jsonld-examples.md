# JSON-LD 参考载荷（按类型）

> 可直接复制的标准载荷。占位值（域名、logo、社链、日期）发布前必须替换为真实数据。
> 所有节点可合并为单块 `@graph` 输出（推荐），也可每类一块。

## Organization（全站，每页注入）

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.example.com/#organization",
  "name": "openEuler社区",
  "url": "https://www.example.com",
  "logo": { "@type": "ImageObject", "url": "https://www.example.com/logo.png" },
  "description": "openEuler 是开源、免费的 Linux 发行版社区",
  "sameAs": ["https://github.com/openeuler"]
}
```

## WebSite（全站，每页注入）

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.example.com/#website",
  "name": "openEuler 官网",
  "url": "https://www.example.com",
  "description": "站点一句话描述",
  "inLanguage": "zh-CN",
  "publisher": { "@id": "https://www.example.com/#organization" }
}
```

## WebPage + BreadcrumbList（页面级，层级 ≥2 的页面）

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://docs.example.com/zh/docs/install#webpage",
      "url": "https://docs.example.com/zh/docs/install",
      "name": "安装指南",
      "description": "openEuler 24.03 LTS 安装流程",
      "isPartOf": { "@id": "https://docs.example.com/#website" },
      "breadcrumb": { "@id": "https://docs.example.com/zh/docs/install#breadcrumb" },
      "inLanguage": "zh-CN"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://docs.example.com/zh/docs/install#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "首页", "item": "https://docs.example.com/" },
        { "@type": "ListItem", "position": 2, "name": "文档", "item": "https://docs.example.com/zh/docs" },
        { "@type": "ListItem", "position": 3, "name": "安装指南" }
      ]
    }
  ]
}
```

## TechArticle（文档/教程页）

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": "https://docs.example.com/zh/docs/install#article",
  "headline": "安装指南",
  "description": "openEuler 24.03 LTS 物理机与虚拟机安装流程。",
  "image": ["https://docs.example.com/og-install-16x9.png", "https://docs.example.com/og-install-1x1.png"],
  "datePublished": "2026-01-15",
  "dateModified": "2026-09-30",
  "author": { "@id": "https://www.example.com/#organization" },
  "publisher": { "@id": "https://www.example.com/#organization" },
  "mainEntityOfPage": "https://docs.example.com/zh/docs/install",
  "inLanguage": "zh-CN",
  "isPartOf": { "@id": "https://docs.example.com/#website" },
  "proficiencyLevel": "Beginner",
  "dependencies": "openEuler 24.03 LTS"
}
```

## SoftwareApplication（下载/产品页，免费开源软件）

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "openEuler",
  "operatingSystem": "Linux",
  "applicationCategory": "OperatingSystem",
  "softwareVersion": "24.03 LTS",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY",
    "availability": "https://schema.org/InStock"
  },
  "releaseNotes": "https://docs.example.com/release-notes/24.03",
  "datePublished": "2026-04-01"
}
```

## FAQPage（真实可见 FAQ，≥2 对；富媒体展示已限政府/健康站点，仅存语义价值）

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "openEuler 支持哪些 CPU 架构？",
      "acceptedAnswer": { "@type": "Answer", "text": "x86_64、AArch64、RISC-V 等架构。" }
    },
    {
      "@type": "Question",
      "name": "如何升级到 24.03 LTS？",
      "acceptedAnswer": { "@type": "Answer", "text": "使用 yum update 或 openEuler 提供的升级工具，详见升级指南。" }
    }
  ]
}
```

## Event（活动/峰会页）

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "openEuler Summit 2026",
  "startDate": "2026-11-20T09:00:00+08:00",
  "endDate": "2026-11-21T18:00:00+08:00",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "上海世博中心",
    "address": { "@type": "PostalAddress", "addressLocality": "上海", "addressCountry": "CN" }
  },
  "organizer": { "@id": "https://www.example.com/#organization" },
  "image": "https://www.example.com/summit2026/banner.png",
  "description": "年度开源操作系统峰会"
}
```

## Person（作者/贡献者页）

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "张三",
  "url": "https://www.example.com/community/zhangsan",
  "sameAs": ["https://github.com/zhangsan"],
  "worksFor": { "@id": "https://www.example.com/#organization" }
}
```
