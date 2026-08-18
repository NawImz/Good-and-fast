# Good and Fast — outillage du site vitrine

Dépôt d'un site vitrine pour un commerce de **restauration rapide**, mené selon
[`docs/playbook-site-vitrine.md`](docs/playbook-site-vitrine.md).

> État actuel : **outillage uniquement**. Aucun site n'est encore construit —
> ni page, ni direction artistique, ni donnée client. Le playbook (§3) interdit
> d'inventer une identité : il faut d'abord les photos et les informations
> réelles du commerce (liste §11).

---

## Ce qui est installé

### Serveurs MCP — `.mcp.json`, scope projet

Ajoutés avec `claude mcp add <nom> -s project`, donc versionnés et suivis par le
dépôt (playbook §1).

| Serveur | Transport | État vérifié |
|---|---|---|
| `playwright` | stdio | ✅ testé : navigation réussie sur un serveur local |
| `chrome-devtools` | stdio | ✅ testé : navigation réussie sur un serveur local |
| `github` | HTTP | ⚠️ nécessite `claude mcp login github` (OAuth interactif) |
| `figma` | HTTP | ⚠️ nécessite `claude mcp login figma` |
| `vercel` | HTTP | ⚠️ nécessite `claude mcp login vercel` |
| `netlify` | HTTP | ⚠️ nécessite `claude mcp login netlify` |

**À la première session dans ce dépôt, les six serveurs apparaissent en
`⏸ Pending approval`.** C'est le comportement normal d'un `.mcp.json` versionné :
lancer `claude` et approuver. La config MCP est lue au démarrage — une
modification ne prend effet qu'à la session suivante.

Pour retirer un serveur dont vous n'avez pas l'usage :

```bash
claude mcp remove figma -s project
```

### Plugins — `.claude/settings.json`, scope projet

```bash
claude plugin marketplace add anthropics/claude-code --scope project
claude plugin install frontend-design@claude-code-plugins -s project
claude plugin install code-review@claude-code-plugins -s project
```

- `frontend-design` → skill `frontend-design` (direction artistique, playbook §2)
- `code-review` → skill `code-review` (avant livraison)

Le scope `project` est important : en scope `user` (le défaut) la config vit
dans `~/.claude` et disparaît avec le conteneur d'une session distante.

### Skills déjà natifs — rien à installer

`artifact-design`, `artifact-diagramming`, `dataviz`, `security-review`,
`code-review` sont fournis par Claude Code. Le playbook §2 mentionne aussi un
skill `webdesign` : **il n'existe pas** dans cette installation ni dans le
marketplace officiel. `frontend-design` (plugin) le remplace.

---

## `scripts/chrome-launcher.sh`

Les deux serveurs MCP navigateur pointent vers ce lanceur via
`--executable-path` / `--executablePath`. Il existe pour deux raisons
constatées à l'exécution, pas supposées :

1. **`chrome-devtools-mcp` cherche un Chrome stable** dans
   `/opt/google/chrome/chrome`, absent du sandbox distant qui n'embarque que le
   Chromium de Playwright.
2. **`@playwright/mcp` et le Chromium installé divergent** : la version npm
   (1.63-alpha) attend `chromium-1237`, le sandbox fournit `chromium-1194`
   (playbook §10, « Playwright en sandbox »).

À quoi s'ajoute le fait que la session tourne en `root`, ce que Chromium refuse
sans `--no-sandbox` — le lanceur ne l'ajoute **que** dans ce cas.

Ordre de recherche du binaire : `$CHROME_BIN`, puis
`$PLAYWRIGHT_BROWSERS_PATH/chromium`, `/usr/bin/google-chrome`,
`/usr/bin/chromium`, Google Chrome sur macOS.

En local, si aucun de ces chemins ne convient :

```bash
export CHROME_BIN="/chemin/vers/chrome"
```

---

## Ce qui n'a pas pu être fait ici

- **Aucun serveur HTTP n'est authentifié.** L'OAuth exige une session
  interactive ; impossible depuis un agent. À faire par un humain avec
  `claude mcp login <nom>`.
- **Les serveurs MCP ne sont pas approuvés.** Même raison.
- **Aucun accès réseau sortant vers l'extérieur depuis le navigateur** du
  sandbox (`ERR_TUNNEL_CONNECTION_FAILED` sur `example.com`). Sans importance
  pour la QA, qui se fait contre le build servi en local — c'est bien ce qui a
  été vérifié.

---

## Prochaine étape

Rien ne peut être conçu avant d'avoir les données réelles du commerce. La liste
à transmettre est au §11 du playbook : photos de devanture et d'enseigne, logo
vectoriel, mentions légales, hébergeur, avis réels avec noms et étoiles,
coordonnées GPS, horaires.

Pour la restauration rapide en particulier (playbook §4.3), à trancher avant la
première ligne de code : la matière (pain, friture, papier, inox ?), le geste,
l'émotion d'achat, et ce que le client regarde avant d'entrer — la carte, les
prix, la vitrine ?
