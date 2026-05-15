/**
 * Kun UI-atferd: én accordion om gangen, scroll/synlighet og kompakt layout.
 * Brødtekst i HTML; klubbnavn/kontakt fra club-config.js (club-init.js).
 */
(function () {
  function ensureAccordionVisible(detailsEl) {
    if (!detailsEl) return;
    const detailsRect = detailsEl.getBoundingClientRect();
    const bottomGap = 12;
    const topGap = 8;
    const viewportTop = 0;
    const viewportBottom = window.innerHeight || document.documentElement.clientHeight;
    const visibleHeight = viewportBottom - viewportTop - topGap - bottomGap;
    const detailsHeight = detailsRect.height;

    if (detailsHeight <= visibleHeight) {
      let delta = 0;
      if (detailsRect.top < viewportTop + topGap) {
        delta = detailsRect.top - (viewportTop + topGap);
      } else if (detailsRect.bottom > viewportBottom - bottomGap) {
        delta = detailsRect.bottom - (viewportBottom - bottomGap);
      }
      if (Math.abs(delta) > 1) {
        window.scrollBy({ top: delta, behavior: "smooth" });
      }
    } else {
      detailsEl.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }

  function viewportClientHeight() {
    const vv = window.visualViewport;
    if (vv && typeof vv.height === "number" && vv.height > 0) return vv.height;
    return window.innerHeight || document.documentElement.clientHeight || 0;
  }

  function syncScrollbarVisibility() {
    const anyMainOpen = Boolean(document.querySelector('details[data-accordion-group="main"][open]'));
    const hasOverflow =
      (document.documentElement.scrollHeight || 0) > viewportClientHeight() + 1;
    document.documentElement.classList.toggle("accordion-scroll-visible", anyMainOpen && hasOverflow);
  }

  const FIT_MIN_WIDTH = 768;

  function clearFitClasses(root) {
    root.classList.remove("layout-compact", "layout-compact-2", "layout-scaled", "layout-mobile-tight");
    root.style.setProperty("--layout-fit-scale", "1");
  }

  function contentOverflowsViewport(root) {
    const vh = viewportClientHeight();
    return vh > 0 && (root.scrollHeight || 0) > vh + 2;
  }

  function syncClosedStateFit() {
    const root = document.documentElement;
    const viewportWidth = window.innerWidth || root.clientWidth || 0;
    const anyMainOpen = Boolean(document.querySelector('details[data-accordion-group="main"][open]'));

    if (anyMainOpen) {
      clearFitClasses(root);
      return;
    }

    clearFitClasses(root);
    if (!contentOverflowsViewport(root)) return;

    if (viewportWidth < FIT_MIN_WIDTH) {
      root.classList.add("layout-compact");
      requestAnimationFrame(() => {
        if (!contentOverflowsViewport(root)) return;
        root.classList.add("layout-compact-2");
        requestAnimationFrame(() => {
          if (!contentOverflowsViewport(root)) return;
          root.classList.add("layout-mobile-tight");
        });
      });
      return;
    }

    root.classList.add("layout-compact");
    requestAnimationFrame(() => {
      if (!contentOverflowsViewport(root)) return;
      root.classList.add("layout-compact-2");
      requestAnimationFrame(() => {
        const vh = viewportClientHeight();
        const fullHeight = root.scrollHeight || 0;
        if (vh > 0 && fullHeight > vh + 1) {
          const rawScale = (vh - 4) / fullHeight;
          const scale = Math.max(0.9, Math.min(1, rawScale));
          if (scale < 0.999) {
            root.style.setProperty("--layout-fit-scale", String(scale));
            root.classList.add("layout-scaled");
          } else {
            root.style.setProperty("--layout-fit-scale", "1");
            root.classList.remove("layout-scaled");
          }
        } else {
          root.style.setProperty("--layout-fit-scale", "1");
          root.classList.remove("layout-scaled");
        }
      });
    });
  }

  document.querySelectorAll("details[data-accordion-group]").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        const group = item.getAttribute("data-accordion-group");
        document.querySelectorAll(`details[data-accordion-group="${group}"]`).forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
      requestAnimationFrame(() => {
        syncScrollbarVisibility();
        syncClosedStateFit();
        if (item.open) ensureAccordionVisible(item);
      });
    });
  });

  window.addEventListener("resize", () => {
    syncClosedStateFit();
    syncScrollbarVisibility();
  });

  let vvFitRaf = null;
  function scheduleViewportFit() {
    if (vvFitRaf != null) cancelAnimationFrame(vvFitRaf);
    vvFitRaf = requestAnimationFrame(() => {
      vvFitRaf = null;
      syncClosedStateFit();
      syncScrollbarVisibility();
    });
  }

  const visualViewport = window.visualViewport;
  if (visualViewport) {
    visualViewport.addEventListener("resize", scheduleViewportFit);
    visualViewport.addEventListener("scroll", scheduleViewportFit);
  }

  syncClosedStateFit();
  syncScrollbarVisibility();
})();
