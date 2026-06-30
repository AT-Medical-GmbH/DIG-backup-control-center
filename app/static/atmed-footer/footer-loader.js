/*
 * ATMED Global Footer loader.
 * Centrally maintained: ATMED-assets/shared/atmed-footer/src/footer-loader.js
 *
 * Usage on any HTML page:
 *   <div id="atmed-global-footer"
 *        data-atmed-base="https://assets.at-medical.de/footer"
 *        data-atmed-variant="public"   (public | internal)
 *        data-atmed-theme="auto"       (auto | light | dark)
 *        data-atmed-compact="false"></div>
 *   <script src="https://assets.at-medical.de/footer/footer-loader.js" defer></script>
 *
 * Security/robustness:
 *   - No eval / new Function. DOM is built from trusted same-origin/CDN assets only.
 *   - On any load failure a baked-in legal fallback footer is rendered so the
 *     page never breaks. Errors go to console only (optional admin hint for
 *     internal variant), never to normal users.
 *   - CSP-friendly: needs `connect-src` + `style-src` for the configured base.
 */
(function () {
  "use strict";

  var VERSION = "1.0.0+2026-06-30.0d95b89ea2ce";
  var DEFAULT_BASE = "https://assets.at-medical.de/footer";

  // Baked-in fallback - kept in sync with dist by the build step.
  var FALLBACK_HTML = "<footer class=\"atmed-footer\" role=\"contentinfo\" aria-label=\"AT Medical Footer\" data-atmed-footer-version=\"1.0.0+2026-06-30.0d95b89ea2ce\" data-atmed-footer-variant=\"public\">\n  <div class=\"atmed-footer__inner\">\n    <div class=\"atmed-footer__brand\">\n      <img class=\"atmed-footer__logo\" src=\"https://assets.at-medical.de/logos/atmed-logo.svg\" alt=\"AT Medical GmbH Logo\" width=\"140\" loading=\"lazy\" decoding=\"async\">\n      <p class=\"atmed-footer__claim\">Digitale Medizintechnik &amp; sichere Gesundheits-IT</p>\n    </div>\n    <nav class=\"atmed-footer__nav\" aria-label=\"Footer-Navigation\">\n            <div class=\"atmed-footer__group\" data-group=\"legal\">\n        <h2 class=\"atmed-footer__group-title\">Rechtliches</h2>\n        <ul class=\"atmed-footer__list\">\n        <li><a class=\"atmed-footer__link\" href=\"https://www.at-medical.de/impressum\">Impressum</a></li>\n        <li><a class=\"atmed-footer__link\" href=\"https://www.at-medical.de/legal/agb\">AGB</a></li>\n        <li><a class=\"atmed-footer__link\" href=\"https://www.at-medical.de/legal/datenschutz\">Datenschutz</a></li>\n        <li><a class=\"atmed-footer__link\" href=\"https://www.at-medical.de/legal/widerruf\">Widerruf</a></li>\n        <li><a class=\"atmed-footer__link\" href=\"https://www.at-medical.de/legal/barrierefreiheit\">Barrierefreiheit</a></li>\n        <li><a class=\"atmed-footer__link\" href=\"https://www.at-medical.de/legal/lieferkettenschutzgesetz\">Lieferkettenschutzgesetz</a></li>\n        </ul>\n      </div>\n      <div class=\"atmed-footer__group\" data-group=\"company\">\n        <h2 class=\"atmed-footer__group-title\">Unternehmen</h2>\n        <ul class=\"atmed-footer__list\">\n        <li><a class=\"atmed-footer__link\" href=\"https://www.at-medical.de/it-security\">IT-Sicherheit</a></li>\n        <li><a class=\"atmed-footer__link\" href=\"https://www.at-medical.de/code-of-conduct\">Code of Conduct</a></li>\n        </ul>\n      </div>\n      <div class=\"atmed-footer__group\" data-group=\"contact\">\n        <h2 class=\"atmed-footer__group-title\">Kontakt</h2>\n        <ul class=\"atmed-footer__list\">\n        <li><a class=\"atmed-footer__link\" href=\"https://www.at-medical.de/kontakt\">Kontaktformular</a></li>\n        <li><a class=\"atmed-footer__link\" href=\"mailto:Info@at-medical.de\">Info@at-medical.de</a></li>\n        </ul>\n      </div>\n    </nav>\n  </div>\n  <div class=\"atmed-footer__bar\">\n    <p class=\"atmed-footer__copyright\">\n      <span>© Copyright 2017 - 2026 | AT Medical GmbH®</span>\n      <span class=\"atmed-footer__rights\">Alle Rechte vorbehalten | All rights reserved</span>\n    </p>\n    \n  </div>\n</footer>\n";

  function mountPoints() {
    var nodes = [];
    var byId = document.getElementById("atmed-global-footer");
    if (byId) nodes.push(byId);
    var byAttr = document.querySelectorAll("[data-atmed-footer]");
    for (var i = 0; i < byAttr.length; i++) {
      if (nodes.indexOf(byAttr[i]) === -1) nodes.push(byAttr[i]);
    }
    return nodes;
  }

  function ensureStylesheet(base) {
    var href = base.replace(/\/+$/, "") + "/footer.css";
    if (document.querySelector('link[data-atmed-footer-css]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-atmed-footer-css", "1");
    link.onerror = function () {
      // Stylesheet unavailable: fallback footer carries its own minimal inline styles.
      if (typeof console !== "undefined" && console.warn) {
        console.warn("[atmed-footer] stylesheet failed to load:", href);
      }
    };
    document.head.appendChild(link);
  }

  function applyOptions(el, mount) {
    var theme = mount.getAttribute("data-atmed-theme");
    if (theme && theme !== "auto") el.setAttribute("data-atmed-theme", theme);
    if (mount.getAttribute("data-atmed-compact") === "true") {
      el.classList.add("atmed-footer--compact");
    }
  }

  function alreadyRendered() {
    return document.querySelectorAll(".atmed-footer").length > 0;
  }

  function render(mount, html, isFallback) {
    if (alreadyRendered()) {
      // Guard against duplicate footers (e.g. theme + loader both injecting).
      if (console && console.warn) {
        console.warn("[atmed-footer] an .atmed-footer is already present; skipping.");
      }
      return;
    }
    var tpl = document.createElement("template");
    tpl.innerHTML = (html || "").trim();
    var footer = tpl.content.querySelector(".atmed-footer") || tpl.content.firstElementChild;
    if (!footer) return;
    applyOptions(footer, mount);
    if (isFallback) {
      footer.setAttribute("data-atmed-footer-fallback", "1");
      if (mount.getAttribute("data-atmed-variant") === "internal" &&
          console && console.info) {
        console.info("[atmed-footer] central footer unavailable - rendered local fallback (admin notice).");
      }
    }
    mount.replaceChildren(footer);
  }

  function loadInto(mount) {
    var base = (mount.getAttribute("data-atmed-base") || DEFAULT_BASE).replace(/\/+$/, "");
    var variant = mount.getAttribute("data-atmed-variant") === "internal"
      ? "footer.internal.html"
      : "footer.html";
    ensureStylesheet(base);

    var url = base + "/" + variant;
    if (typeof fetch !== "function") {
      render(mount, FALLBACK_HTML, true);
      return;
    }
    fetch(url, { credentials: "omit", mode: "cors", cache: "default" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (html) { render(mount, html, false); })
      .catch(function (err) {
        if (console && console.warn) {
          console.warn("[atmed-footer] falling back to local footer:", url, err && err.message);
        }
        render(mount, FALLBACK_HTML, true);
      });
  }

  function init() {
    var mounts = mountPoints();
    for (var i = 0; i < mounts.length; i++) loadInto(mounts[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose version for diagnostics.
  window.ATMED_FOOTER_VERSION = VERSION;
})();
