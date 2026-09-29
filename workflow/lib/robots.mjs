export function parseRobots(text) {
  const lines = text.split('\n');
  const result = {
    userAgents: [],
    disallow: [],
    allow: [],
    sitemap: [],
    contentSignal: null,
    llmPolicy: null,
    raw: lines.map((l) => l.trim()).filter(Boolean),
  };

  for (const line of result.raw) {
    const [key, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    const lowerKey = key.trim().toLowerCase();

    if (lowerKey === 'user-agent') result.userAgents.push(value);
    else if (lowerKey === 'disallow') result.disallow.push(value);
    else if (lowerKey === 'allow') result.allow.push(value);
    else if (lowerKey === 'sitemap') result.sitemap.push(value);
    else if (lowerKey === 'content-signal') result.contentSignal = value;
    else if (lowerKey === 'llm-policy') result.llmPolicy = value;
  }

  return result;
}
