// Manages bottom taskbar items
const Taskbar = {
  container: null,

  init() {
    this.container = document.getElementById("taskbar");
  },

  add(appId, title, winEl) {
    const btn = document.createElement("div");
    btn.className = "taskbar-item";
    btn.innerText = title;

    // Toggle window visibility when clicking the taskbar button
    btn.onclick = () => {
      if (winEl.style.display === "none") {
        winEl.style.display = "flex";
      } else {
        winEl.style.display = "none";
      }
    };

    this.container.appendChild(btn);
    return btn; // 👈 return so windows.js can track/remove
  }
};
