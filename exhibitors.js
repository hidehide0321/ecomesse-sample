(function () {
  "use strict";

  const colors = {
    1: "#E5243B", 2: "#DDA63A", 3: "#4C9F38", 4: "#C5192D",
    5: "#FF3A21", 6: "#26BDE2", 7: "#FCC30B", 8: "#A21942",
    9: "#FD6925", 10: "#DD1367", 11: "#FD9D24", 12: "#BF8B2E",
    13: "#3F7E44", 14: "#0A97D9", 15: "#56C02B", 16: "#00689D",
    17: "#19486A"
  };
  const lightGoals = new Set([2, 6, 7, 9, 11, 15]);
  const buttons = Array.from(document.querySelectorAll(".exp-card[data-category]"));
  const directory = document.getElementById("exhibitor-directory");
  const categoryLabel = document.getElementById("selected-category");
  const countLabel = document.getElementById("exhibitor-count");
  const grid = document.getElementById("exhibitor-grid");
  const closeButton = document.getElementById("exhibitor-close");
  const listToggle = document.getElementById("exhibitor-list-toggle");
  const nameList = document.getElementById("exhibitor-name-list");
  const nameListContent = document.getElementById("exhibitor-name-list-content");
  const nameListClose = document.getElementById("exhibitor-name-list-close");
  const exhibitors = Array.isArray(window.ECOMESSE_EXHIBITORS) ? window.ECOMESSE_EXHIBITORS : [];
  const exhibitorUrls = window.ECOMESSE_EXHIBITOR_URLS || {};
  const marcheExhibitors = Array.isArray(window.ECOMESSE_MARCHE_EXHIBITORS) ? window.ECOMESSE_MARCHE_EXHIBITORS : [];
  const marcheToggle = document.getElementById("marche-toggle");
  const marcheDirectory = document.getElementById("marche-directory");
  const marcheGrid = document.getElementById("marche-exhibitor-grid");
  const marcheClose = document.getElementById("marche-close");

  nameListContent.textContent = exhibitors.map(item => item.name).join(" ／ ");

  listToggle.addEventListener("click", () => {
    const willOpen = nameList.hidden;
    nameList.hidden = !willOpen;
    listToggle.setAttribute("aria-expanded", String(willOpen));
  });

  nameListClose.addEventListener("click", () => {
    nameList.hidden = true;
    listToggle.setAttribute("aria-expanded", "false");
    listToggle.focus();
  });

  function createGoal(goal, isMain) {
    const wrapper = document.createElement("span");
    wrapper.className = "exhibitor-goal";
    if (isMain) wrapper.classList.add("is-main");

    if (isMain) {
      const label = document.createElement("span");
      label.className = "exhibitor-goal-main";
      label.textContent = "メイン";
      wrapper.appendChild(label);
    }

    const icon = document.createElement("img");
    icon.className = "exhibitor-sdg-icon";
    icon.src = "images/sdg_icon_" + String(goal).padStart(2, "0") + "_ja.png";
    icon.alt = "SDGs目標" + goal;
    wrapper.appendChild(icon);
    return wrapper;
  }

  function createCard(exhibitor) {
    const card = document.createElement("article");
    card.className = "exhibitor-item";
    card.style.setProperty("--sdg-color", colors[exhibitor.main] || colors[17]);
    if (lightGoals.has(exhibitor.main)) card.classList.add("is-light");

    const name = document.createElement("h4");
    const url = exhibitorUrls[exhibitor.name];
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = exhibitor.name;
      name.appendChild(link);
    } else {
      name.textContent = exhibitor.name;
    }
    card.appendChild(name);

    const description = document.createElement("p");
    description.className = "exhibitor-description";
    description.textContent = exhibitor.description;
    card.appendChild(description);

    if (Array.isArray(exhibitor.detailLinks) && exhibitor.detailLinks.length) {
      const detailLinks = document.createElement("div");
      detailLinks.className = "exhibitor-detail-links";
      exhibitor.detailLinks.forEach(item => {
        const link = document.createElement("a");
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = item.label;
        detailLinks.appendChild(link);
      });
      card.appendChild(detailLinks);
    }

    const goals = document.createElement("div");
    goals.className = "exhibitor-goals";
    goals.setAttribute("aria-label", "関連するSDGs目標");
    goals.appendChild(createGoal(exhibitor.main, true));
    [...new Set(exhibitor.other)].filter(goal => goal !== exhibitor.main).forEach(goal => {
      goals.appendChild(createGoal(goal, false));
    });
    card.appendChild(goals);

    if (exhibitor.decokatsu) {
      const deco = document.createElement("div");
      deco.className = "exhibitor-decokatsu";
      const image = document.createElement("img");
      image.src = "images/decokatsu_logo_2026.png";
      image.alt = "デコ活";
      const text = document.createElement("span");
      text.textContent = "デコ活対象";
      deco.append(image, text);
      card.appendChild(deco);
    }

    return card;
  }

  function showCategory(category) {
    const selected = exhibitors.filter(item => item.category === category);
    buttons.forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.category === category));
    });
    categoryLabel.textContent = category;
    countLabel.textContent = selected.length + "団体の出展情報";
    grid.replaceChildren(...selected.map(createCard));
    directory.hidden = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    directory.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => showCategory(button.dataset.category));
  });

  closeButton.addEventListener("click", () => {
    directory.hidden = true;
    grid.replaceChildren();
    buttons.forEach(button => button.setAttribute("aria-pressed", "false"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelector(".exp-grid").scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center"
    });
  });

  function createMarcheCard(exhibitor) {
    const card = document.createElement("article");
    card.className = "marche-exhibitor-item";
    const heading = document.createElement("h4");
    if (exhibitor.url) {
      const link = document.createElement("a");
      link.href = exhibitor.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = exhibitor.name;
      heading.appendChild(link);
    } else {
      heading.textContent = exhibitor.name;
    }
    const description = document.createElement("p");
    description.textContent = exhibitor.description;
    card.append(heading, description);
    if (exhibitor.detailUrl) {
      const detailLink = document.createElement("a");
      detailLink.className = "marche-detail-link";
      detailLink.href = exhibitor.detailUrl;
      detailLink.target = "_blank";
      detailLink.rel = "noopener noreferrer";
      detailLink.textContent = exhibitor.detailLabel || "ホームページを見る";
      card.appendChild(detailLink);
    }
    return card;
  }

  marcheToggle.addEventListener("click", () => {
    const willOpen = marcheDirectory.hidden;
    marcheDirectory.hidden = !willOpen;
    marcheToggle.setAttribute("aria-pressed", String(willOpen));
    if (willOpen) {
      marcheGrid.replaceChildren(...marcheExhibitors.map(createMarcheCard));
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      marcheDirectory.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  });

  marcheClose.addEventListener("click", () => {
    marcheDirectory.hidden = true;
    marcheGrid.replaceChildren();
    marcheToggle.setAttribute("aria-pressed", "false");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    marcheToggle.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    marcheToggle.focus();
  });
}());
