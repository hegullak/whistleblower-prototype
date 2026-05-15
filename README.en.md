# whistleblower-prototype

**English** · [Norsk](README.md)

Static information page for reporting concerns via [MittVarsel](https://portal.mittvarsel.no/) — aimed at sports clubs in the Norwegian Confederation of Sports (NIF). All page copy lives in HTML; club name, logo, MittVarsel URL, slogan and contacts are controlled from a single file: `club-config.js`.
---

## Contents

- [What this site does](#what-this-site-does)
- [Project structure](#project-structure)
- [Run locally](#run-locally)
- [Customise for a new club](#customise-for-a-new-club)
- [club-config.js](#club-configjs)
- [HTML attributes (club-*)](#html-attributes-club-)
- [Editing content and languages](#editing-content-and-languages)
- [Theme and appearance](#theme-and-appearance)
- [Contact section](#contact-section)
- [Deploy](#deploy)
- [Troubleshooting](#troubleshooting)

---

## What this site does

The page explains what reporting means, what can be reported, how to use MittVarsel, and who to contact. It includes:

- Hero section with link to MittVarsel
- Information sections and accordions with common questions
- Links to external help services (Barnevernvakt, 116 111, etc.)
- Contact accordion with main email/phone and contact person cards
- Language switch between Norwegian and English (plain links, not JavaScript i18n)

`interactions.js` only handles UI: one open accordion at a time, scroll when needed, and compact layout on small screens.

---

## Project structure

| File / folder | Purpose |
|---------------|---------|
| `index.html` | Norwegian page (default front page when deployed) |
| `en.html` | English page |
| `club-config.js` | **Club data** — name, logo, URL, slogan, contacts |
| `club-init.js` | Fills in `club-*` attributes and builds contact cards |
| `interactions.js` | Accordion, scroll and responsive compact layout |
| `styles.css` | Layout, colours and typography |
| `assets/` | Logo and other local images |
| `serve.ps1` | Starts local server on port 4174 |
| `serve-dev.py` | Python server with no cache (used by `serve.ps1`) |
| `VERSION` | Version number |

---

## Run locally

### Recommended (Windows)

```powershell
cd whistleblower-strict
.\serve.ps1
```

Open:

- Norwegian: [http://127.0.0.1:[port number]/](http://127.0.0.1:[port number]/)
- English: [http://127.0.0.1:[port number]/en.html](http://127.0.0.1:[port number]/en.html)

## Customise for a new club

1. **Copy** the entire folder for the new club/project.
2. **Edit `club-config.js`** — name, logo, MittVarsel URL, slogan, contacts (see table below).
3. **Replace the logo** in `assets/` and update `logoSrc`.
4. **Edit copy** in both `index.html` and `en.html` (body text, accordions, help lines).
5. **Optional:** change theme on `<html>` — `data-theme="sport"` (red) or `data-theme="light"` (blue).
6. **Test locally** with `.\serve.ps1` and a hard refresh (Ctrl+Shift+R).

Each club/organisation has its own MittVarsel form URL from NIF/the portal setup.

---

## club-config.js

Example:

```javascript
window.CLUB_CONFIG = {
  fullName: "Frøya Fotball",
  shortName: "Frøya",
  logoSrc: "assets/froya-logo.svg",
  tabTitleSuffix: "MittVarsel",

  mittVarselUrl: "https://portal.mittvarsel.no/skjema/...",

  clubSlogan: "FLEST MULIG, LENGST MULIG, BEST MULIG.",

  contact: {
    mainEmail: "varsel@froya-fotball.no",
    mainPhone: "+47 971 77 772",

    contactPersons: [
      {
        name: "Ola Nordmann",
        title: "Barneidrettsansvarlig",
        titleEn: "Children's sports coordinator",
        title2: "Administrator for MittVarsel",
        title2En: "Administrator for MittVarsel",
        phone: "+47 99 00 00 00",
        email: "ola@example.com",
      },
    ],
  },
};
```

### Field reference

| Field | Description |
|-------|-------------|
| `fullName` | Full club name — header, tab title (`fullName - tabTitleSuffix`), logo `alt` |
| `shortName` | Short name in body text (`club="short-name"`) |
| `logoSrc` | Path to logo (e.g. `assets/my-logo.svg`) |
| `tabTitleSuffix` | Part of tab title after club name (usually `MittVarsel`) |
| `mittVarselUrl` | Full URL to the club's MittVarsel form |
| `clubSlogan` | Footer slogan. Empty string `""` hides it |
| `contact.mainEmail` | Main email under Contact (and `club-mail` links) |
| `contact.mainPhone` | Main phone under Contact. Empty = hidden. **Must be a quoted string** |
| `contact.contactPersons` | List of contact persons (cards) |

### Fields per contact person

| Field | Description |
|-------|-------------|
| `name` | Name (own line) |
| `title` | Title 1 (own line, Norwegian) |
| `title2` | Title 2 (own line, Norwegian) |
| `titleEn` | Optional English title 1 (used on `en.html`) |
| `title2En` | Optional English title 2 |
| `phone` | Phone (own line with label) |
| `email` | Email (own line with label) |

**Rules:**

- Empty fields are not shown.
- Persons with no content are skipped entirely.
- Multiple cards sit side by side when there is room; otherwise they wrap to a new row.
- Cards only take the width they need (not full page width).

---

## HTML attributes (club-*)

`club-init.js` fills values from `club-config.js` where these attributes are used:

| Attribute | Effect |
|-----------|--------|
| `club="full-name"` | Sets text to `fullName` |
| `club="short-name"` | Sets text to `shortName` |
| `club-logo` | Sets `src` and `alt` on `<img>` |
| `club-mittvarsel` | Sets link `href` to `mittVarselUrl` |
| `club-mail` | Sets `href` to `mailto:` from `contact.mainEmail` |
| `club-mail-show` | (Optional) Also shows the email address as link text |
| `clubSlogan` | Fills footer from `clubSlogan` in config |
| `club-contact` | Empty `<div>` — contact cards are built here by JavaScript |

Example:

```html
<span class="brand__name" club="full-name"></span>
<a href="#" club-mittvarsel>Go to MittVarsel</a>
<div club-contact></div>
```

Scripts must load in this order:

```html
<script src="club-config.js"></script>
<script src="club-init.js"></script>
<script src="interactions.js" defer></script>
```

---

## Editing content and languages

| What | Where |
|------|-------|
| Club name, logo, URL, contacts, slogan | `club-config.js` |
| All other text (accordions, paragraphs, lists) | `index.html` + `en.html` |
| Language switch | Header links between `index.html` and `en.html` |

**Important:** When you change Norwegian text, update English `en.html` as well (and vice versa). There is no automatic translation.

The word **MittVarsel** is a brand name and is usually not translated.

External help services (Barnevernvakt, 116 111, etc.) keep Norwegian names on both language versions.

---

## Theme and appearance

On `<html>`:

```html
<html lang="en" data-theme="sport">
```

| Value | Appearance |
|-------|------------|
| `sport` | Red accent colour (default) |
| `light` | Blue accent colour |

Styles are in `styles.css`. Accordion icons are question marks, except **Contact** which uses an envelope icon.

---

## Contact section

Under the **Contact** accordion:

1. **Main contact** — `mainEmail` and `mainPhone` side by side (only filled fields).
2. **Contact person cards** — one box per person in `contactPersons`, with:
   - Name on its own line
   - Title 1 and title 2 on separate lines (no extra gap between the two titles)
   - Phone and email on separate lines

---

## Deploy

Upload the **entire folder** to static hosting, for example:

- Netlify
- GitHub Pages
- Azure Static Web Apps
- Render
- Traditional web hosting (FTP)

`index.html` should be the front page. No server-side code required.

After deploy: verify that `club-config.js` and `club-init.js` load (browser Network tab). Users may need a hard refresh after updates.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Club name/contact not shown | Check that `club-config.js` and `club-init.js` load (status 200). Hard refresh: Ctrl+Shift+R |
| Entire contact section empty | Often a syntax error in `club-config.js` (e.g. phone without quotes). Open the console (F12) |
| Port 4174 in use | Stop the old server — see [If the port is in use](#if-the-port-is-in-use) |
| Config changes not visible | Cache — use `serve.ps1` (no-cache) or hard refresh |
| Email missing on card | Check that `email` is set in `contactPersons` and the file is saved |

---

## Licence and further development

A project for clubs that want full control over HTML copy with minimal JavaScript.
