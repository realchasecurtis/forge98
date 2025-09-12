const Taskbar = {
  container: null,
  init() {
    this.container = document.getElementById("taskbar-items");
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
    return btn; // MUST return
  }
};
