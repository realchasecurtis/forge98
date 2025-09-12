// Handles desktop icons
window.onload = () => {
  Storage.loadIconPositions();
  Taskbar.init();

  document.querySelectorAll(".icon").forEach(icon => {
    let offsetX, offsetY, isDragging = false;

    // Dragging icons
    icon.onmousedown = e => {
      isDragging = true;
      offsetX = e.clientX - icon.offsetLeft;
      offsetY = e.clientY - icon.offsetTop;
      document.onmousemove = e2 => {
        if (isDragging) {
          icon.style.left = (e2.clientX - offsetX) + "px";
          icon.style.top = (e2.clientY - offsetY) + "px";
        }
      };
      document.onmouseup = () => {
        isDragging = false;
        document.onmousemove = null;
        Storage.saveIconPositions();
      };
    };

    // Open windows on double click
    icon.ondblclick = () => {
      const appId = icon.dataset.app;
      if (appId === "halo") {
        createWindow(appId, "Halo", "https://halo.forgebunker.com");
      } else if (appId === "osrs") {
        createWindow(appId, "OSRS", "https://osrs.forgebunker.com");
      }
    };
  });
};
