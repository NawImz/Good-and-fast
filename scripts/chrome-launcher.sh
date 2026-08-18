#!/usr/bin/env bash
# Lanceur Chrome/Chromium pour chrome-devtools-mcp.
#
# Pourquoi ce fichier : dans le sandbox distant (Claude Code sur le web) il n'y a
# pas de Chrome stable — seulement le Chromium de Playwright — et la session
# tourne en root, ce que Chromium refuse sans --no-sandbox.
#
# CHROME_BIN permet de pointer un vrai Chrome en local (macOS / Linux desktop).
set -euo pipefail

BIN="${CHROME_BIN:-}"
if [ -z "$BIN" ]; then
  for c in \
    "${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}/chromium" \
    /usr/bin/google-chrome \
    /usr/bin/chromium \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  do
    if [ -x "$c" ]; then BIN="$c"; break; fi
  done
fi

if [ -z "$BIN" ]; then
  echo "chrome-launcher: aucun binaire Chrome/Chromium trouvé. Définir CHROME_BIN." >&2
  exit 127
fi

# --no-sandbox uniquement quand on tourne en root (conteneur), jamais autrement.
if [ "$(id -u)" -eq 0 ]; then
  exec "$BIN" --no-sandbox --disable-dev-shm-usage "$@"
fi
exec "$BIN" "$@"
