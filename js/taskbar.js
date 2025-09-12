const Taskbar = {
  container: null,

  init() {
    this.container = document.getElementById("taskbar-items");

    // 🔥 Wire up Start button
    const startBtn = document.getElementById("start-button");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        createInfoWindow(
          "forge-info",
          "Forge",
          "Built from the ground up. Every piece is designed and crafted in-house using 3D printing, prop fabrication, and practical effects techniques. FORGE turns imagination into hardware, delivering sci-fi props pulled straight from another world."
        );
      });
    }
  },

  add(appId, title, winEl) {
    const btn = document.createElement("div");
    btn.className = "taskbar-item";
    btn.innerText = title;

    // Toggle window visibility
    btn.onclick = () => {
      if (winEl.style.display === "none") {
        winEl.style.display = "flex";
      } else {
        winEl.style.display = "none";
      }
    };

    this.container.appendChild(btn);
    return btn;
  }
};
