(() => {
  "use strict";
  document.body.classList.add("js");
  const menu = document.getElementById("menu-toggle");
  const nav = document.getElementById("mobile-nav");
  menu.hidden = false;
  const closeMenu = () => {
    nav.hidden = true;
    menu.setAttribute("aria-expanded", "false");
    menu.querySelector("span").textContent = "+";
  };
  menu.addEventListener("click", () => {
    const opened = nav.hidden;
    nav.hidden = !opened;
    menu.setAttribute("aria-expanded", String(opened));
    menu.querySelector("span").textContent = opened ? "−" : "+";
  });
  nav.addEventListener("click", event => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !nav.hidden) {
      closeMenu();
      menu.focus();
    }
  });
  const mobileSize = window.matchMedia("(max-width: 760px)");
  mobileSize.addEventListener("change", closeMenu);

  const skillRows = [...document.querySelectorAll(".skill-row")];
  const skillToggle = document.getElementById("skills-toggle");
  skillToggle.hidden = false;
  const syncSkills = () => {
    const allOpen = skillRows.every(row => row.open);
    skillToggle.setAttribute("aria-expanded", String(allOpen));
    skillToggle.firstChild.textContent = allOpen ? "Collapse all skills " : "Expand all skills ";
    skillToggle.querySelector("span").textContent = allOpen ? "−" : "+";
  };
  skillToggle.addEventListener("click", () => {
    const open = !skillRows.every(row => row.open);
    skillRows.forEach(row => { row.open = open; });
    syncSkills();
  });
  skillRows.forEach(row => row.addEventListener("toggle", syncSkills));

  const dialog = document.getElementById("image-dialog");
  const image = document.getElementById("dialog-image");
  const caption = document.getElementById("image-caption");
  const previous = document.getElementById("gallery-previous");
  const next = document.getElementById("gallery-next");
  const position = document.getElementById("gallery-position");
  const galleryLinks = [...document.querySelectorAll('[data-gallery]')];
  let screenshots = [];
  let index = 0;
  let opener = null;
  const showShot = () => {
    const source = screenshots[index];
    image.src = source.href;
    image.alt = source.querySelector("img").alt;
    caption.textContent = source.dataset.caption;
    position.textContent = (index + 1) + " / " + screenshots.length;
    previous.disabled = index === 0;
    next.disabled = index === screenshots.length - 1;
  };
  const openViewer = trigger => {
    opener = trigger;
    showShot();
    dialog.showModal();
    document.body.classList.add("dialog-open");
  };
  if (typeof dialog.showModal === "function") {
    galleryLinks.forEach(link => link.addEventListener("click", event => {
      event.preventDefault();
      screenshots = galleryLinks.filter(item => item.dataset.gallery === link.dataset.gallery);
      index = screenshots.indexOf(link);
      openViewer(link);
    }));
  }
  previous.addEventListener("click", () => {
    if (index > 0) { index--; showShot(); }
  });
  next.addEventListener("click", () => {
    if (index < screenshots.length - 1) { index++; showShot(); }
  });
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" && index > 0) { event.preventDefault(); index--; showShot(); }
    if (event.key === "ArrowRight" && index < screenshots.length - 1) { event.preventDefault(); index++; showShot(); }
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (opener) opener.focus();
  });
})();
