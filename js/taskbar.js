const Taskbar = {
  container: null,
  startButton: null,

  init() {
    this.container = document.getElementById("taskbar-items");
    this.startButton = document.getElementById("start-button");

    // Hook up the Start button → opens Forge About window
    if (this.startButton) {
      this.startButton.addEventListener("click", () => {
        createInfoWindow(
          "about",
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

    btn.onclick = () => {
      if (winEl.style.display === "none") {
        winEl.style.display = "flex";
      } else {
        winEl.style.display = "none";
      }
    };

    this.container.appendChild(btn);
    return btn; // MUST return for windows.js to remove
  }
};
