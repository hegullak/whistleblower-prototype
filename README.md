# whistleblower-prototype

**Norsk** · [English](README.en.md)

Statisk informasjonsside for varsling via [MittVarsel](https://portal.mittvarsel.no/) — tilpasset idrettslag i Norges Idrettsforbund (NIF). Alt innhold ligger i HTML; klubbnavn, logo, MittVarsel-URL, slagord og kontakter styres fra én fil: `club-config.js`.

---

## Innhold

- [Hva siden gjør](#hva-siden-gjør)
- [Prosjektstruktur](#prosjektstruktur)
- [Kjøre lokalt](#kjøre-lokalt)
- [Tilpasse for ny klubb](#tilpasse-for-ny-klubb)
- [club-config.js](#club-configjs)
- [HTML-attributter (club-*)](#html-attributter-club-)
- [Redigere innhold og språk](#redigere-innhold-og-språk)
- [Tema og utseende](#tema-og-utseende)
- [Kontaktseksjonen](#kontaktseksjonen)
- [Deploy](#deploy)
- [Feilsøking](#feilsøking)

---

## Hva siden gjør

Siden forklarer hva varsling er, hva som kan varsles, hvordan man bruker MittVarsel, og hvem man kan kontakte. Den inneholder:

- Hero med lenke til MittVarsel
- Informasjonsseksjoner og accordion med vanlige spørsmål
- Lenker til eksterne hjelpetjenester (Barnevernvakt, 116 111, osv.)
- Kontaktaccordion med hoved-e-post/telefon og kontaktpersonkort
- Språkbytte mellom norsk og engelsk (vanlige lenker, ikke JavaScript-i18n)

`interactions.js` håndterer kun UI: én accordion åpen om gangen, scroll ved behov og kompakt layout på små skjermer.

---

## Prosjektstruktur

| Fil / mappe | Formål |
|-------------|--------|
| `index.html` | Norsk side (forside ved deploy) |
| `en.html` | Engelsk side |
| `club-config.js` | **Klubbdata** — navn, logo, URL, slagord, kontakter |
| `club-init.js` | Fyller inn `club-*`-attributter og bygger kontaktkort |
| `interactions.js` | Accordion, scroll og responsiv kompakt layout |
| `styles.css` | Layout, farger og typografi |
| `assets/` | Logo og andre lokale bilder |
| `serve.ps1` | Starter lokal server på port 4174 |
| `serve-dev.py` | Python-server uten cache (brukes av `serve.ps1`) |
| `VERSION` | Versjonsnummer |

---

## Kjøre lokalt

### Anbefalt (Windows)

```powershell
cd whistleblower
.\serve.ps1
```

Åpne (standard port **4174** fra `serve.ps1`):

- Norsk: [http://127.0.0.1:4174/](http://127.0.0.1:4174/)
- Engelsk: [http://127.0.0.1:4174/en.html](http://127.0.0.1:4174/en.html)

---

## Tilpasse for ny klubb

1. **Kopier** hele mappen til nytt prosjekt/klubb.
2. **Rediger `club-config.js`** — navn, logo, MittVarsel-URL, slagord, kontakter (se tabell under).
3. **Bytt logo** i `assets/` og oppdater `logoSrc`.
4. **Rediger tekst** i både `index.html` og `en.html` (brødtekst, accordion, hjelpelinjer).
5. **Valgfritt:** endre tema på `<html>` — `data-theme="sport"` (rød) eller `data-theme="light"` (blå).
6. **Test lokalt** med `.\serve.ps1` og hard refresh (Ctrl+Shift+R).

MittVarsel-URL er unik per klubb/organisasjon — hent den fra NIF/klubbens oppsett i portalen.

---

## club-config.js

Eksempel:

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
        email: "ola@eksempel.no",
      },
    ],
  },
};
```

### Feltoversikt

| Felt | Beskrivelse |
|------|-------------|
| `fullName` | Fullt klubbnavn — header, fanetittel (`fullName - tabTitleSuffix`), logo `alt` |
| `shortName` | Kort navn i brødtekst (`club="short-name"`) |
| `logoSrc` | Sti til logo (f.eks. `assets/min-logo.svg`) |
| `tabTitleSuffix` | Del av fanetittel etter klubbnavn (vanligvis `MittVarsel`) |
| `mittVarselUrl` | Full URL til klubbens MittVarsel-skjema |
| `clubSlogan` | Tekst i bunntekst. Tom streng `""` skjuler slagordet |
| `contact.mainEmail` | Hoved-e-post under Kontakt (og `club-mail`-lenker) |
| `contact.mainPhone` | Hovedtelefon under Kontakt. Tom = skjules. **Må være tekst i anførselstegn** |
| `contact.contactPersons` | Liste med kontaktpersoner (kort) |

### Felter per kontaktperson

| Felt | Beskrivelse |
|------|-------------|
| `name` | Navn (egen linje) |
| `title` | Tittel 1 (egen linje, norsk) |
| `title2` | Tittel 2 (egen linje, norsk) |
| `titleEn` | Valgfri engelsk tittel 1 (brukes på `en.html`) |
| `title2En` | Valgfri engelsk tittel 2 |
| `phone` | Telefon (egen linje med etikett) |
| `email` | E-post (egen linje med etikett) |

**Regler:**

- Tomme felt vises ikke.
- Personer uten noe innhold hoppes over helt.
- Flere kort stilles side om side når det er plass; ellers brytes de til ny rad.
- Kort tar bare nødvendig bredde (ikke full sidebredde).

---

## HTML-attributter (club-*)

`club-init.js` fyller inn verdier fra `club-config.js` der disse attributtene brukes:

| Attributt | Effekt |
|-----------|--------|
| `club="full-name"` | Setter tekst til `fullName` |
| `club="short-name"` | Setter tekst til `shortName` |
| `club-logo` | Setter `src` og `alt` på `<img>` |
| `club-mittvarsel` | Setter `href` på lenker til `mittVarselUrl` |
| `club-mail` | Setter `href` til `mailto:` fra `contact.mainEmail` |
| `club-mail-show` | (Valgfritt) Viser også e-postadressen som lenketekst |
| `clubSlogan` | Fyller bunntekst fra `clubSlogan` i config |
| `club-contact` | Tom `<div>` — kontaktkort bygges her av JavaScript |

Eksempel:

```html
<span class="brand__name" club="full-name"></span>
<a href="#" club-mittvarsel>Gå til MittVarsel</a>
<div club-contact></div>
```

Scripts må lastes i denne rekkefølgen:

```html
<script src="club-config.js"></script>
<script src="club-init.js"></script>
<script src="interactions.js" defer></script>
```

---

## Redigere innhold og språk

| Hva | Hvor |
|-----|------|
| Klubbnavn, logo, URL, kontakter, slagord | `club-config.js` |
| All annen tekst (accordion, avsnitt, lister) | `index.html` + `en.html` |
| Språkbytte | Lenker i header mellom `index.html` og `en.html` |

**Viktig:** Ved endring av norsk tekst, oppdater også engelsk `en.html` (og omvendt). Det finnes ingen automatisk oversettelse.

Ordet **MittVarsel** er merkevare og oversettes normalt ikke.

Eksterne hjelpetjenester (Barnevernvakt, 116 111, osv.) har norske navn i begge språkversjoner.

---

## Tema og utseende

På `<html>`:

```html
<html lang="no" data-theme="sport">
```

| Verdi | Utseende |
|-------|----------|
| `sport` | Rød aksentfarge (standard) |
| `light` | Blå aksentfarge |

Stiler ligger i `styles.css`. Accordion-ikoner er spørsmålstegn, unntatt **Kontakt** som bruker konvolutt-ikon.

---

## Kontaktseksjonen

Under accordion **Kontakt** vises:

1. **Hovedkontakt** — `mainEmail` og `mainPhone` side om side (kun felt som er utfylt).
2. **Kontaktpersonkort** — én boks per person i `contactPersons`, med:
   - Navn på egen linje
   - Tittel 1 og tittel 2 på hver sin linje (uten ekstra luft mellom titlene)
   - Telefon og e-post på egne linjer

---

## Deploy

Last opp **hele mappen** til statisk hosting, for eksempel:

- Netlify
- GitHub Pages
- Azure Static Web Apps
- Render
- Vanlig webhotell (FTP)

`index.html` skal være forsiden. Ingen server-side kode kreves.

Etter deploy: verifiser at `club-config.js` og `club-init.js` lastes (nettverk-fane i nettleseren). Ved oppdateringer kan brukere trenge hard refresh.

---

## Feilsøking

| Problem | Løsning |
|---------|---------|
| Klubbnavn/kontakt vises ikke | Sjekk at `club-config.js` og `club-init.js` lastes (status 200). Hard refresh: Ctrl+Shift+R |
| Hele kontaktseksjonen tom | Ofte syntaksfeil i `club-config.js` (f.eks. telefon uten `"anførselstegn"`). Åpne konsollen (F12) |
| Port 4174 opptatt | Stopp prosessen som lytter på porten (se feilmelding fra `serve.ps1`). Kjør bare én `serve.ps1` om gangen. |
| Endringer i config vises ikke | Cache — bruk `serve.ps1` (no-cache) eller hard refresh |
| E-post på kort mangler | Sjekk at `email` er utfylt i `contactPersons` og at filen er lagret |

---

## Lisens og videre utvikling

Prosjektet for klubber som ønsker full kontroll over HTML-tekst med minimal JavaScript.
