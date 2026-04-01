export function parseFrontmatter(markdown: string) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { attributes: {} as Record<string, any>, body: markdown };
  
  const frontmatter = match[1];
  const attributes: Record<string, any> = {};
  
  frontmatter.split(/\r?\n/).forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let val = line.slice(colonIndex + 1).trim();
      
      // Clean up quotes
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val.startsWith("'") && val.endsWith("'")) {
        val = val.slice(1, -1);
      }
      
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          attributes[key] = JSON.parse(val.replace(/'/g, '"'));
        } catch {
          attributes[key] = val;
        }
      } else {
        attributes[key] = val;
      }
    }
  });
  
  const body = markdown.slice(match[0].length).trim();
  return { attributes, body };
}