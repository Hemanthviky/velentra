const progress = document.getElementById("scroll-progress");
const header = document.querySelector(".site-header.home-header");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let ticking = false;

function update() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

  if (progress) progress.style.width = pct + "%";
  if (header) header.classList.toggle("is-scrolled", scrollY > 40);

  if (!reduceMotion) {
    parallaxItems.forEach((item) => {
      const speed = parseFloat(item.dataset.parallax) || 0.1;
      item.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  },
  { passive: true }
);

update();
