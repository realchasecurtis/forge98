// =============================
// Desktop initialization
// =============================
window.onload = () => {
  Storage.loadIconPositions();
  Taskbar.init();

  // Apply behaviors to each icon
  document.querySelectorAll(".icon").forEach(icon => {
    if (!isMobile()) {
      // Desktop: draggable + double-click
      makeIconDraggable(icon);

      icon.addEventListener("dblclick", () => {
        const appId = icon.dataset.app;
        openApp(appId); // handled in windows.js
      });
    } else {
      // Mobile: single tap to open, no dragging
      icon.addEventListener("click", () => {
        const appId = icon.dataset.app;
        openApp(appId);
      });
    }
  });
};

// =============================
// Helpers
// =============================

// Detect if device is "mobile" (based on screen width)
function isMobile() {
  return window.innerWidth <= 768;
}

// Allow dragging only for desktop
function makeIconDraggable(icon) {
  let offsetX, offsetY, isDragging = false;

  icon.addEventListener("mousedown", e => {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - icon.off
