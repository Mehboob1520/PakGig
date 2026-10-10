/* PakGig - brand helper
   Replaces the plain "PakGig" text link in the page header with the logo
   (icon + wordmark + slogan). The logo is still a link to the homepage.
   Also sets the logo as the browser-tab icon. */
(function () {
    function apply() {
        // Browser tab icon
        if (!document.querySelector('link[rel="icon"]')) {
            var ic = document.createElement("link");
            ic.rel = "icon";
            ic.type = "image/svg+xml";
            ic.href = "logo.svg";
            document.head.appendChild(ic);
        }

        // Header logo: any link to the homepage whose text is just "PakGig"
        var links = document.querySelectorAll('a[href="index.html"]');
        for (var i = 0; i < links.length; i++) {
            var a = links[i];
            if (a.getAttribute("data-branded")) continue;
            var t = (a.textContent || "").replace(/\s+/g, "").toLowerCase();
            if (t !== "pakgig") continue;
            a.setAttribute("data-branded", "1");
            a.setAttribute("aria-label", "PakGig - Your Digital Workplace - go to homepage");
            a.style.display = "inline-flex";
            a.style.alignItems = "center";
            a.style.gap = "8px";
            a.style.textDecoration = "none";
            a.innerHTML =
                '<img src="logo.svg" alt="PakGig logo" style="height:38px;width:auto;display:block">' +
                '<span style="display:flex;flex-direction:column;line-height:1.1">' +
                    '<span style="font-weight:800;letter-spacing:-0.02em;color:#2f8f3a">Pak<span style="color:#0b63b8">Gig</span></span>' +
                    '<span style="font-size:9px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;margin-top:2px;white-space:nowrap">Your Digital Workplace</span>' +
                '</span>';
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", apply);
    } else {
        apply();
    }
})();
