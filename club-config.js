/**
 * Tilpass denne filen for klubben. Brukes av club-init.js (navn, logo, kontakt).
 */
window.CLUB_CONFIG = {
  /** Fullt klubbnavn, f.eks. i header og fanetittel */
  fullName: "Frøya Fotball",
  /** Kort navn i løpende tekst */
  shortName: "Frøya",
  logoSrc: "assets/froya-logo.svg",
  tabTitleSuffix: "MittVarsel",

  /** Full URL til MittVarsel-skjemaet */
  mittVarselUrl:
    "https://portal.mittvarsel.no/skjema/norges-idrettsforbund/SNPZOBQpD7CUt9Er.1532",

  /** Slagord i bunntekst. Tom streng "" skjuler teksten. */
  "club-slogan": "FLEST MULIG, LENGST MULIG, BEST MULIG.",

  contact: {
    /** Vises øverst under Kontakt når utfylt */
    mainEmail: "varsel@froya-fotball.no",
    /** Må stå i anførselstegn, f.eks. "+47 971 77 772" */
    mainPhone: "+47 971 77 772",

    /**
     * Én eller flere kontaktpersoner. Tomme felt vises ikke.
     * Kort uten noen utfylte felt hoppes over.
     */
    "contact-persons": [
      {
        name: "Henning Gullaksen",
        title: "Barneidrettsansvarlig",
        titleEn: "Children's sports coordinator",
        title2: "Administrator for MittVarsel",
        title2En: "Administrator for MittVarsel",
        phone: "+47 99 70 32 23",
        email: "henning@froya-fotball.no",
      },
      {
        name: "Gullaksen Henning",
        titleEn: "Children's sports coordinator",
        title2: "Administrator for MittVarsel",
        title2En: "Administrator for MittVarsel",
        phone: "+47 99 70 32 23",
        email: "henning@froya-fotball.no",
      }
    ],
  },
};
