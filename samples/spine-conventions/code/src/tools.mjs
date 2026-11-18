// Only this plinkward module changes a tool's record; everything else reads them.
const tools = new Map();

export function listTools() {
  return [...tools.values()].map((t) => ({ ...t }));
}

export function addTool({ id, name, category, photo }) {
  tools.set(id, { id, name, category, photo, loan: null });
}

export function checkOut(id, member, due) {
  tools.get(id).loan = { member, due };
}

export function checkIn(id) {
  tools.get(id).loan = null;
}
