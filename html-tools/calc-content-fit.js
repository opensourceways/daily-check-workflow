#!/usr/bin/env node
/**
 * 用途：计算给定的关键词列表 / 摘要（description）与文章内容的贴合度
 *
 * 逻辑：
 *  - 关键词直接成词；摘要用 Intl.Segmenter 按指定语言分词成词数组
 *  - 文章内容从文件路径或 stdin 读取
 *  - 用 AC 自动机（modern-ahocorasick）对文章做一次性多词匹配，统计每个词的命中次数
 *  - 贴合度 = 命中的词数 / 总词数（覆盖率），同时输出每词出现次数供判断密度
 *
 * 参数：
 *
 *  -k, --keywords <keywords>      关键词列表，逗号分隔（中英文逗号均可），可重复传多个 -k
 *  -d, --description <text>       一段摘要字符串，内部用 Intl.Segmenter 分词
 *  -l, --locale <locale>          摘要分词使用的语言（默认 zh-CN，如 en、ja）
 *  -f, --filename <filename>      输出文件路径（可选；不传则直接打印到 stdout）
 *  [file]                         文章内容文件路径（可选；不传或传 - 表示从 stdin 读取）
 *
 * 示例：
 *  node calc-content-fit.js -k "SEO,元描述,爬虫" article.md
 *  node calc-content-fit.js article.md -d "介绍 Aho-Corasick 算法的多模式字符串匹配" -l zh-CN
 *  node calc-content-fit.js -k "SEO,爬虫" article.md -f report.txt
 *  type article.md | node calc-content-fit.js -k "SEO,爬虫"
 */

import fs from 'node:fs';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { program } from 'commander';
import AhoCorasick from 'modern-ahocorasick';

/** 把 -k 的值按逗号切分并累加，支持重复传多个 -k */
function collectKeywords(value, previous) {
  return previous.concat(
    value
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

program
  .argument('[file]', '文章内容文件路径，不传则读 stdin')
  .option('-k, --keywords <keywords>', '关键词列表，逗号分隔，可重复传', collectKeywords, [])
  .option('-d, --description <text>', '摘要字符串，将分词后参与计算')
  .option('-l, --locale <locale>', '摘要分词语言', 'zh-CN')
  .option('-f, --filename <filename>', '输出文件路径，不传则打印到 stdout')
  .parse();

const options = program.opts();
const [fileArg] = program.args;

/** 用 Intl.Segmenter 对摘要做分词，只保留"像词"的片段（过滤空白/标点） */
function segmentDescription(text, locale) {
  const segmenter = new Intl.Segmenter(locale, { granularity: 'word' });
  const words = [];
  for (const { segment, isWordLike } of segmenter.segment(text)) {
    if (isWordLike) words.push(segment);
  }
  return words;
}

/** 读取文章内容：显式文件路径 > stdin */
function readArticle() {
  if (fileArg && fileArg !== '-') {
    return fs.readFileSync(fileArg, 'utf8');
  }
  if (process.stdin.isTTY) {
    throw new Error('未提供文章文件路径，且 stdin 无输入');
  }
  return fs.readFileSync(0, 'utf8');
}

async function main() {
  const { keywords, description, locale, filename } = options;
  if (!keywords.length && !description) {
    throw new Error('至少需要通过 -k 传关键词列表，或通过 -d 传一段摘要');
  }

  // 汇总参与计算的词：关键词 + 摘要分词结果，忽略大小写并去重
  const rawTerms = keywords.concat(description ? segmentDescription(description, locale) : []);
  const terms = [...new Set(rawTerms.map((t) => t.toLowerCase()))];
  if (!terms.length) {
    throw new Error('待匹配的词列表为空');
  }

  const article = readArticle();
  const text = article.toLowerCase();

  // AC 自动机：一次扫描得到每个词在文章中的出现次数
  const matcher = new AhoCorasick(terms);
  const counts = matcher.countByPattern(text);

  const stats = terms.map((term, i) => ({ term, count: counts[i] }));
  const hit = stats.filter((s) => s.count > 0);
  const missed = stats.filter((s) => s.count === 0);

  // 贴合度 = 词覆盖率
  const coverage = (hit.length / terms.length) * 100;

  // 拼接报告文本，统一由 -f 落盘或 stdout 打印
  const lines = [];
  lines.push(`贴合度（词覆盖率）：${coverage.toFixed(1)}%（${hit.length}/${terms.length} 个词命中）`);
  lines.push(`文章长度：${article.length} 字符，命中词总出现次数：${hit.reduce((sum, s) => sum + s.count, 0)}`);

  if (hit.length) {
    lines.push('', '命中词：');
    hit.forEach(({ term, count }) => lines.push(`  + ${term} × ${count}`));
  }
  if (missed.length) {
    lines.push('', '未命中词：');
    missed.forEach(({ term }) => lines.push(`  - ${term}`));
  }
  const report = lines.join('\n') + '\n';

  if (filename) {
    await fsp.mkdir(path.dirname(path.resolve(filename)), { recursive: true });
    await fsp.writeFile(filename, report, 'utf8');
    console.log(`已写入：${filename}`);
  } else {
    process.stdout.write(report);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
