// =============================
// App registry
// =============================
const Apps = {
  halo: { type: "iframe", title: "Halo", url: "https://halo.forgebunker.com" },
  osrs: { type: "iframe", title: "OSRS", url: "https://osrs.forgebunker.com" },
  mail: { 
    type: "info", 
    title: "Subscribe", 
    message: `
      <form id="signup-form" class="signup-form">
        <input type="email" name="email" placeholder="Enter your email." required>
        <button type="submit">JOIN</button>
      </form>
      <div id="form-message" class="message"></div>

      <script>
        const form = document.getElementById("signup-form");
        const message = document.getElementById("form-message");

        form.addEventListener("submit", function(e) {
          e.preventDefault();
          const data = new FormData(form);

          message.textContent = "Submitting...";

          fetch("https://script.google.com/macros/s/AKfycbwYKJJ9bi1lIolTYu56ZAKvm7P9YgerzIEiUaJftqLONNhNmnO8M2e4xy71SlK30AAg/exec", {
            method: "POST",
            body: data
          }).then(() => {
            message.textContent = "Success.";
            form.reset();
          }).catch(() => {
            message.textContent = "Failure. Please try again.";
          });
        });
      </script>
    `
  }
};

// =============================
// Handles desktop icons
// =============================
window.onload = () => {
  Storage.loadIconPositions();
  Taskbar.init();

  document.querySelectorAll(".icon").forEach(icon => {
    makeIconDraggable(icon);

    // Double-click to open app
    icon.addEventListener("dblclick", () => {
      const appId = icon.dataset.app;
      if (Apps[appId]) {
        openApp(appId); // ✅ use the new unified openApp()
      }
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
