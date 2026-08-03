# Running the site on your own machine

Everything here has been run against this repository. If a command's output
differs from what is described, that difference is the thing to investigate —
don't push past it.

---

## 1. Install Node

The project needs **Node 20 or 22** (22 LTS is what it is developed against).
npm comes with it.

- **Windows / macOS:** download the LTS installer from <https://nodejs.org> and run it.
- **macOS with Homebrew:** `brew install node@22`
- **Linux (Debian/Ubuntu):** `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs`

Check it worked:

```bash
node -v     # v22.x.x  (or v20.x.x)
npm -v      # 10.x.x
```

If `node -v` prints nothing or "command not found", the install did not
finish — close the terminal, open a new one, and try again before continuing.

## 2. Install Git

- **Windows:** <https://git-scm.com/download/win> — accept the defaults. This
  also gives you **Git Bash**, which is the terminal to use for everything below.
- **macOS:** `git --version` will offer to install the developer tools if git is missing.
- **Linux:** `sudo apt install git`

## 3. Get the code

```bash
git clone https://github.com/ZizouX0/gnie.git
cd gnie
git checkout claude/skills-setup-workflow-2garzi
```

The branch matters — `main` does not have the site on it.

GitHub will ask you to sign in. If it asks for a password, that is **not** your
GitHub account password: create a personal access token at
<https://github.com/settings/tokens> and paste that instead. Easier route:
install <https://cli.github.com>, run `gh auth login` once, and clone normally
afterwards.

Confirm you are on the right branch and have the site:

```bash
git branch --show-current      # claude/skills-setup-workflow-2garzi
ls src/pages                   # index.astro, contact.astro, machines/, en/ …
```

## 4. Install the dependencies

```bash
npm install
```

Takes a minute or two and creates a `node_modules/` folder of roughly 300 MB.
It is normal for npm to print warnings about deprecated sub-dependencies;
warnings are fine, **errors** are not.

## 5. Run it

```bash
npm run dev
```

You will see something like:

```
astro  v5.x.x ready in 900 ms
┃ Local    http://localhost:4321/
```

Open <http://localhost:4321> in your browser. Pages worth checking:

| URL | What it is |
|---|---|
| `http://localhost:4321/` | French home page |
| `http://localhost:4321/en/` | English home page |
| `http://localhost:4321/machines/` | Catalogue — filters, quick view, comparison |
| `http://localhost:4321/machines/cryolipolyse-7d-360/` | A machine page |
| `http://localhost:4321/contact/` | Contact page and quote form |
| `http://localhost:4321/dev/styleguide` | The design system, all components on one page |

Edit any file under `src/` and the browser updates by itself. Stop the server
with `Ctrl+C`.

## 6. Build the production version

```bash
npm run build      # writes the finished site to dist/
npm run preview    # serves dist/ exactly as it will be online
```

`npm run build` is also the honest test of whether the site is healthy: the
content schema refuses to build if a machine file is malformed, so a green
build means the twelve machines and both languages are all intact.

---

## What you will see that is deliberate

None of the following is a bug — each is a documented decision, and each
resolves the moment the corresponding value is supplied.

- **The quote form is disabled**, under a notice pointing to the phone. It has
  no Formspree endpoint yet, and a form that silently posts nowhere is worse
  than one that says so. See §"Turning the integrations on".
- **No WhatsApp button anywhere.** Set `PUBLIC_WHATSAPP_NUMBER` and the
  floating button and every WhatsApp link appear.
- **The newsletter says "Inscription bientôt disponible".** Same reason.
- **The legal and privacy pages show `TODO:NEEDS_INPUT` markers.** These are
  the facts only the client can supply — see `docs/client/GNIE-Ce-Qui-Manque.pdf`.
- **No e-mail address on the contact page.** The one that used to be there was
  a placeholder that never existed; it was removed rather than left to bounce.

## Turning the integrations on

Create a file called `.env` in the project root:

```bash
PUBLIC_FORMSPREE_ID=xyzabcde
PUBLIC_WHATSAPP_NUMBER=21655157506
PUBLIC_BREVO_FORM_URL=https://...
PUBLIC_SITE_URL=https://gnie-aesthetics.com
```

Every one is optional and each is read in `src/config/site.ts`. Restart
`npm run dev` after changing it — environment variables are read at startup.

- **`PUBLIC_FORMSPREE_ID`** — free, and the fastest win: create a form at
  <https://formspree.io>, copy the id out of the endpoint it gives you
  (`https://formspree.io/f/xyzabcde` → `xyzabcde`). The quote form then works.
- **`PUBLIC_WHATSAPP_NUMBER`** — digits only, country code first, no `+`.
- **`PUBLIC_SITE_URL`** — affects canonical URLs, the sitemap and the social
  cards. Leave it alone until the real domain is known.

`.env` is git-ignored, so real values never reach the repository.

## If something goes wrong

| Symptom | Cause and fix |
|---|---|
| `command not found: npm` | Node is not installed, or the terminal predates the install. Open a new terminal. |
| `Port 4321 is in use` | Another copy is running. `npm run dev -- --port 4322`. |
| Build fails naming a machine file | The content schema rejected it. The message names the file, the field and the rule. |
| `sharp` fails to install | Usually an old Node. Check `node -v` is 20 or 22. |
| Pages render without any styling | `npm install` did not finish. Delete `node_modules/` and run it again. |
| Changes do not appear | Look at the terminal running `npm run dev` — an error there stops the update. |

## Where things live

```
src/pages/          one file per route; FR at the root, EN under en/
src/components/     the building blocks (cards, spec plate, forms, gallery)
src/content/machines/{fr,en}/   the twelve machines — pure content, edit freely
src/config/site.ts  company facts and the environment variables
src/i18n/ui.ts      every interface string, both languages
src/styles/global.css   colours, type scale, spacing
docs/               the specification, phase reports and client documents
```

To change what a machine says, edit its markdown file under
`src/content/machines/` — nothing else needs touching, and the schema will
tell you if a required field is missing.
