// Handles desktop icons
window.onload = () => {
  Storage.loadIconPositions();
  Taskbar.init();

  document.querySelectorAll(".icon").forEach(icon => {
    let offsetX, offsetY;
    let isDragging = false;

    // Dragging icons
    icon.addEventListener("mousedown", e => {
      e.preventDefault();
      isDragging = true;
      offsetX = e.clientX - icon.offsetLeft;
      offsetY = e.clientY - icon.offsetTop;

      function onMouseMove(e2) {
        if (isDragging) {
          icon.style.left = (e2.clientX - offsetX) + "px";
          icon.style.top = (e2.clientY - offsetY) + "px";
        }
      }

      function onMouseUp() {
        if (isDragging) {
          isDragging = false;
          Storage.saveIconPositions();
        }
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    // Open windows on double click
    icon.addEventListener("dblclick", () => {
      const appId = icon.dataset.app;
      if (appId === "halo") {
        createWindow(appId, "Halo", "https://halo.forgebunker.com");
      } else if (appId === "osrs") {
        createWindow(appId, "OSRS", "https://osrs.forgebunker.com");
      } else if (appId === "twitter") {
        createWindow(appId, "TWITTER", "https://x.com/realchasecurtis");
      }
    });
  });
};
