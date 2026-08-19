// Contrastes WCAG — playbook §5 : calculer, jamais estimer.
// Usage : node scripts/contrast.mjs            -> vérifie les paires du thème
//         node scripts/contrast.mjs #AABBCC #112233
const L = (h) => {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a, b) => {
  const x = L(a), y = L(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
export const hex = (r, g, b) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();

if (process.argv[2] && process.argv[3]) {
  console.log(ratio(process.argv[2].toUpperCase(), process.argv[3].toUpperCase()).toFixed(2) + ":1");
}
