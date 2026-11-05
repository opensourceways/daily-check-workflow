#!/usr/bin/env node
/**
 * 用途：传入网页url，将正文内容转md格式输出
 * 
 * 参数：
 * 
 *  -url: string                      网页url
 *  -f, --filename: string            输出文件路径（可选，不传则直接输出到 stdout）
 *  -c, --content: string             选取正文内容的选择器
 *  -r, --remove: string | string[]   转md时要剥离的元素的选择器
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import { program } from 'commander';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const DEFAULT_CONTENT_SELECTORS = [
  'article',
  'main',
  '[role="main"]',
  '#content',
  '#main',
  '.content',
  '.article-content',
  '.post-content',
  'body',
];

program
  .requiredOption('--url <url>', '网页url')
  .option('-f, --filename <filename>', '输出文件路径，不传则输出到 stdout')
  .option('-c, --content <selector>', '选取正文内容的选择器')
  .option('-r, --remove <selectors...>', '转md时要剥离的元素的选择器')
  .parse();

const options = program.opts();


const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});

turndownService.addRule('remove-imgs', {
  filter: ['img'],
  replacement: () => '',
});

turndownService.addRule('links', {
  filter: ['a'],
  replacement: (content, node) => {
    const cardTitle = node.querySelector('.o-card-title')?.textContent;
    if (cardTitle) {
      return `(${cardTitle})[${node.getAttribute('href')}] `;
    }
    return content;
  },
});

turndownService.addRule('table', {
  filter: 'table',
  replacement: (_, node) => {
    let md = '';
    const rows = Array.from(node.querySelectorAll('tr'));

    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td');
      const rowText = Array.from(cells)
        .map((cell) => cell.textContent?.trim() || '')
        .join(' | ');
      md += '| ' + rowText + ' |\n';

      if (rowIndex === 0) {
        const separator = Array.from(cells)
          .map(() => '---')
          .join(' | ');
        md += '| ' + separator + ' |\n';
      }
    });

    return md;
  },
});

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      accept: 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    throw new Error(`请求失败：${response.status} ${response.statusText} (${url})`);
  }
  return response.text();
}

function extractContent(html, contentSelector, removeSelectors) {
  const $ = cheerio.load(html);

  // 剥离 script/style 等非正文元素，避免 turndown 处理时产生噪声
  $('script, style, noscript, template').remove();

  let $content;
  if (contentSelector) {
    $content = $(contentSelector).first();
    if (!$content.length) {
      throw new Error(`未匹配到正文元素：${contentSelector}`);
    }
  } else {
    for (const selector of DEFAULT_CONTENT_SELECTORS) {
      $content = $(selector).first();
      if ($content.length) break;
    }
  }

  removeSelectors.forEach((raw) => {
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((selector) => {
        $content.find(selector).remove();
      });
  });

  return $.html($content);
}

async function main() {
  const url = new URL(options.url);
  const html = await fetchHtml(url);
  const removeSelectors = options.remove ?? [];
  const contentHtml = extractContent(html, options.content, removeSelectors);

  const markdown = turndownService.turndown(contentHtml);

  if (options.filename) {
    await fs.mkdir(path.dirname(path.resolve(options.filename)), { recursive: true });
    await fs.writeFile(options.filename, markdown + '\n', 'utf8');
    console.log(`已写入：${options.filename}`);
  } else {
    process.stdout.write(markdown + '\n');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
