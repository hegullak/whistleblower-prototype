/**
 * Fyller inn klubbnavn/logo fra club-config.js og bygger kontaktseksjonen.
 */
(function () {
  const LABELS = {
    no: { email: "E-post", phone: "Telefon" },
    en: { email: "Email", phone: "Phone" },
  };

  function trim(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function hasValue(value) {
    return trim(value).length > 0;
  }

  function pageLang() {
    const lang = (document.documentElement.lang || "no").toLowerCase();
    return lang.startsWith("en") ? "en" : "no";
  }

  function labels() {
    return LABELS[pageLang()] || LABELS.no;
  }

  function telHref(phone) {
    return `tel:${phone.replace(/[^\d+]/g, "")}`;
  }

  function personField(person, key) {
    if (pageLang() === "en") {
      const enValue = trim(person[`${key}En`]);
      if (enValue) return enValue;
    }
    return trim(person[key]);
  }

  function personHasContent(person) {
    return (
      hasValue(person.name) ||
      hasValue(personField(person, "title")) ||
      hasValue(personField(person, "title2")) ||
      hasValue(person.phone) ||
      hasValue(person.email)
    );
  }

  function showContactError(mount, message) {
    mount.replaceChildren();
    const note = document.createElement("p");
    note.className = "club-contact__error";
    note.textContent = message;
    mount.appendChild(note);
  }

  function appendLabeledLink(parent, label, href, text, rowClass) {
    const row = document.createElement("p");
    row.className = rowClass || "club-contact__main-line";
    const prefix = document.createElement("strong");
    prefix.textContent = `${label}: `;
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    row.appendChild(prefix);
    row.appendChild(link);
    parent.appendChild(row);
  }

  function appendCardLine(stack, className, text) {
    const line = document.createElement("div");
    line.className = `club-contact-card__line ${className}`.trim();
    line.textContent = text;
    stack.appendChild(line);
  }

  function appendCardLinkLine(stack, className, label, href, text) {
    const line = document.createElement("div");
    line.className = `club-contact-card__line ${className}`.trim();
    const prefix = document.createElement("strong");
    prefix.textContent = `${label}: `;
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    line.appendChild(prefix);
    line.appendChild(link);
    stack.appendChild(line);
  }

  function applyBranding(cfg) {
    const fullName = trim(cfg.fullName);
    const shortName = trim(cfg.shortName) || fullName;
    const tabSuffix = trim(cfg.tabTitleSuffix);

    if (fullName && tabSuffix) {
      document.title = `${fullName} - ${tabSuffix}`;
    } else if (fullName) {
      document.title = fullName;
    }

    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && cfg.logoSrc) {
      favicon.href = cfg.logoSrc;
    }

    document.querySelectorAll("[club]").forEach((el) => {
      const key = el.getAttribute("club");
      if (key === "full-name") el.textContent = fullName;
      if (key === "short-name") el.textContent = shortName;
    });

    document.querySelectorAll("[club-logo]").forEach((el) => {
      if (!cfg.logoSrc || el.tagName !== "IMG") return;
      el.src = cfg.logoSrc;
      el.alt = fullName ? `${fullName} logo` : "Club logo";
    });

    const mainEmail = trim(cfg.contact?.mainEmail);
    document.querySelectorAll("[club-mail]").forEach((el) => {
      if (!mainEmail) return;
      el.href = `mailto:${mainEmail}`;
      if (el.hasAttribute("club-mail-show")) {
        el.textContent = mainEmail;
      }
    });

    const mittVarselUrl = trim(cfg.mittVarselUrl);
    document.querySelectorAll("[club-mittvarsel]").forEach((el) => {
      if (mittVarselUrl) el.href = mittVarselUrl;
    });

    const slogan = trim(cfg["club-slogan"]);
    document.querySelectorAll("[club-slogan]").forEach((el) => {
      if (slogan) {
        el.textContent = slogan;
        el.hidden = false;
      } else {
        el.textContent = "";
        el.hidden = true;
      }
    });
  }

  function renderContact(cfg, mount) {
    const contact = cfg.contact || {};
    const mainEmail = trim(contact.mainEmail);
    const mainPhone = trim(contact.mainPhone);
    const contactPersons = Array.isArray(contact["contact-persons"]) ? contact["contact-persons"] : [];
    const t = labels();

    const fragment = document.createDocumentFragment();

    if (mainEmail || mainPhone) {
      const main = document.createElement("div");
      main.className = "club-contact__main";

      if (mainEmail) {
        appendLabeledLink(main, t.email, `mailto:${mainEmail}`, mainEmail);
      }
      if (mainPhone) {
        appendLabeledLink(main, t.phone, telHref(mainPhone), mainPhone);
      }

      fragment.appendChild(main);
    }

    const filledPeople = contactPersons.filter(personHasContent);

    if (filledPeople.length > 0) {
      const grid = document.createElement("div");
      grid.className = "club-contact__cards";

      filledPeople.forEach((person) => {
        const card = document.createElement("article");
        card.className = "club-contact-card";
        const stack = document.createElement("div");
        stack.className = "club-contact-card__stack";

        if (hasValue(person.name)) {
          appendCardLine(stack, "club-contact-card__name", trim(person.name));
        }

        const title = personField(person, "title");
        if (title) {
          appendCardLine(stack, "club-contact-card__title", title);
        }

        const title2 = personField(person, "title2");
        if (title2) {
          appendCardLine(stack, "club-contact-card__title", title2);
        }

        const phone = hasValue(person.phone) ? trim(person.phone) : "";
        const email = hasValue(person.email) ? trim(person.email) : "";
        let gapBeforeContact = true;

        if (phone) {
          const phoneClass = gapBeforeContact
            ? "club-contact-card__phone club-contact-card__line--gap-before"
            : "club-contact-card__phone";
          appendCardLinkLine(stack, phoneClass, t.phone, telHref(phone), phone);
          gapBeforeContact = false;
        }
        if (email) {
          const emailClass = gapBeforeContact
            ? "club-contact-card__email club-contact-card__line--gap-before"
            : "club-contact-card__email";
          appendCardLinkLine(stack, emailClass, t.email, `mailto:${email}`, email);
        }

        if (stack.childNodes.length > 0) {
          card.appendChild(stack);
          grid.appendChild(card);
        }
      });

      fragment.appendChild(grid);
    }

    if (!fragment.childNodes.length) {
      showContactError(
        mount,
        pageLang() === "en"
          ? "No contact details in club-config.js yet."
          : "Ingen kontaktinfo i club-config.js ennå."
      );
      return;
    }

    mount.replaceChildren(fragment);
  }

  function init() {
    const mount = document.querySelector("[club-contact]");
    const cfg = window.CLUB_CONFIG;

    if (!cfg) {
      if (mount) {
        showContactError(
          mount,
          pageLang() === "en"
            ? "club-config.js did not load. Hard-refresh the page (Ctrl+Shift+R)."
            : "club-config.js ble ikke lastet. Prøv hard refresh (Ctrl+Shift+R)."
        );
      }
      console.error("[club-init] CLUB_CONFIG mangler. Sjekk at club-config.js lastes uten feil.");
      return;
    }

    try {
      applyBranding(cfg);
      if (mount) renderContact(cfg, mount);
    } catch (err) {
      console.error("[club-init]", err);
      if (mount) {
        showContactError(
          mount,
          pageLang() === "en"
            ? "Could not render contact section. Check the browser console."
            : "Kunne ikke vise kontakt. Sjekk konsollen i nettleseren."
        );
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
