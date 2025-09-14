// =============================
// Desktop initialization
// =============================
window.onload = () => {
  Storage.loadIconPositions();
  Taskbar.init();

  // Make all desktop icons draggable + interactive
  document.querySelectorAll(".icon").forEach(icon => {
    makeIconDraggable(icon);

    // Double-click to open app
    icon.addEventListener("dblclick", () => {
      const appId = icon.dataset.app;
      openApp(appId); // ✅ all apps handled in windows.js
    });
  });
};

// =============================
// Helpers
// =============================
function makeIconDraggable(icon) {
  let offsetX, offsetY, isDragging = false;

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
}
