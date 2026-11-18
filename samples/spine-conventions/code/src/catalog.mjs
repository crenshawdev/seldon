import { listTools } from './tools.mjs';

// Volunteers type tool names in, so they're escaped before they reach a page.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// The catalog page members browse from home: every tool, and whether it's on the shelf.
export function renderCatalog() {
  const rows = listTools().map((t) => {
    const where = t.loan ? `due back ${esc(t.loan.due)}` : 'on the shelf';
    return `<li>${esc(t.name)} (${esc(t.category)}) - ${where}</li>`;
  });
  return `<!doctype html><title>Toolshed catalog</title><ul>${rows.join('')}</ul>`;
}
