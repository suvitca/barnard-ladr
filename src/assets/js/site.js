// Mobile menu
(() => {
  const btn = document.querySelector(".menu-btn");
  if (!btn) return;
  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    btn.setAttribute("aria-expanded", open);
    if (open) document.querySelector(".sidebar-close").focus(); else if (document.activeElement?.closest(".sidebar")) btn.focus();
  };
  document.querySelector(".sidebar-close").addEventListener("click", () => setOpen(false));
  btn.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
  document.addEventListener("click", (e) => {
    if (document.body.classList.contains("nav-open") && !e.target.closest(".sidebar, .menu-btn")) setOpen(false);
  });
})();

// Publication search
(() => {
  const input = document.getElementById("pub-search");
  if (!input) return;
  const count = document.querySelector(".pub-count");
  const pubs = [...document.querySelectorAll(".pub-section .pub")];
  input.addEventListener("input", () => {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    pubs.forEach((li) => {
      const text = (li.textContent + " " + li.closest(".year-group").querySelector(".year").textContent).toLowerCase();
      const match = words.every((w) => text.includes(w));
      li.hidden = !match;
      if (match) shown++;
    });
    document.querySelectorAll(".year-group, .pub-section").forEach((g) => {
      g.hidden = !g.querySelector(".pub:not([hidden])");
    });
    count.textContent = words.length ? `${shown} of ${pubs.length} match` : "";
  });
})();
