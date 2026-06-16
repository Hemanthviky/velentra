document.querySelectorAll('a[href="smart-id.html"]').forEach((link) => {
  link.setAttribute("aria-current", "page");
});

const phoneCarousel = document.querySelector("[data-phone-carousel]");
const phoneTrack = phoneCarousel?.querySelector(".pdf-phone-track");
const phoneDots = [...document.querySelectorAll(".phone-carousel-dots button")];

if (phoneCarousel && phoneTrack && phoneDots.length) {
  let activePhoneScreen = 0;
  let phoneTimer;

  const showPhoneScreen = (index) => {
    activePhoneScreen = (index + phoneDots.length) % phoneDots.length;
    phoneTrack.style.transform = `translateX(-${activePhoneScreen * 100}%)`;
    phoneDots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === activePhoneScreen));
  };

  const startPhoneCarousel = () => {
    clearInterval(phoneTimer);
    phoneTimer = setInterval(() => showPhoneScreen(activePhoneScreen + 1), 3200);
  };

  phoneDots.forEach((dot, index) => dot.addEventListener("click", () => {
    showPhoneScreen(index);
    startPhoneCarousel();
  }));

  phoneCarousel.addEventListener("mouseenter", () => clearInterval(phoneTimer));
  phoneCarousel.addEventListener("mouseleave", startPhoneCarousel);
  startPhoneCarousel();
}
