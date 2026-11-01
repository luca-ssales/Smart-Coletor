document.documentElement.classList.add("js");
document.addEventListener("DOMContentLoaded", () => {
  UI.init();
  Simulator.init();
  Chatbot.init();
  if (typeof Contact !== "undefined") {
    Contact.init();
  }
});
