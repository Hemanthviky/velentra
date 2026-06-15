document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    if (!button) return;

    const original = button.innerHTML;
    button.innerHTML = "Request received";
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = original;
      button.disabled = false;
      form.reset();
    }, 2500);
  });
});
