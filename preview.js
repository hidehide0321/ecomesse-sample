(function () {
  "use strict";

  const dialog = document.getElementById("preview-dialog");
  const title = document.getElementById("preview-title");
  const frame = document.getElementById("preview-frame");
  const image = document.getElementById("preview-image");
  const closeButton = document.getElementById("preview-close");
  let trigger = null;

  document.querySelectorAll("[data-preview]").forEach(link => {
    link.addEventListener("click", event => {
      if (!dialog.showModal) return;
      event.preventDefault();
      trigger = link;
      title.textContent = link.dataset.previewTitle || link.textContent.trim();
      const isPdf = link.dataset.preview === "pdf";
      frame.hidden = !isPdf;
      image.hidden = isPdf;
      if (isPdf) {
        frame.src = link.href;
      } else {
        image.src = link.href;
        image.alt = title.textContent;
      }
      dialog.showModal();
    });
  });

  function closePreview() {
    dialog.close();
  }

  closeButton.addEventListener("click", closePreview);
  dialog.addEventListener("click", event => {
    if (event.target === dialog) closePreview();
  });
  dialog.addEventListener("close", () => {
    frame.src = "about:blank";
    image.removeAttribute("src");
    if (trigger) trigger.focus({ preventScroll: true });
  });
}());
