document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    const contactMail = form.dataset.contactMail;

    if (contactMail) {
      event.preventDefault();
      const button = form.querySelector("button[type='submit']");
      const original = button?.innerHTML;
      const formData = new FormData(form);
      const message = [
        `Full name: ${formData.get("name") || ""}`,
        `Work email: ${formData.get("email") || ""}`,
        `Company: ${formData.get("company") || ""}`,
        `Product interest: ${formData.get("product") || ""}`,
        "",
        "Message:",
        `${formData.get("message") || ""}`,
      ].join("\n");

      if (button) {
        button.innerHTML = "Opening email...";
        button.disabled = true;
      }

      window.location.href = `mailto:${contactMail}?subject=${encodeURIComponent("Velentra demo request")}&body=${encodeURIComponent(message)}`;

      setTimeout(() => {
        if (!button) return;
        button.innerHTML = original;
        button.disabled = false;
      }, 2000);
      return;
    }

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

const productSlider = document.querySelector("[data-product-slider]");
const productCards = productSlider
  ? [...productSlider.querySelectorAll(".product-highlight")]
  : [];
const productPrev = document.querySelector("[data-product-prev]");
const productNext = document.querySelector("[data-product-next]");
const productDots = document.querySelector("[data-product-dots]");

if (productSlider && productCards.length && productPrev && productNext && productDots) {
  let activeProduct = 0;
  let scrollFrame;

  const dots = productCards.map((card, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show product ${index + 1}`);
    dot.addEventListener("click", () => showProduct(index));
    productDots.append(dot);
    return dot;
  });

  const updateControls = (index) => {
    activeProduct = index;
    productPrev.disabled = index === 0;
    productNext.disabled = index === productCards.length - 1;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
      dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
    });
  };

  const getCenteredScrollLeft = (card) => {
    const sliderBox = productSlider.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    return (
      productSlider.scrollLeft +
      cardBox.left +
      cardBox.width / 2 -
      sliderBox.left -
      sliderBox.width / 2
    );
  };

  const showProduct = (index) => {
    const nextIndex = Math.max(0, Math.min(index, productCards.length - 1));
    const card = productCards[nextIndex];
    productSlider.scrollTo({
      left: getCenteredScrollLeft(card),
      behavior: "smooth",
    });
    updateControls(nextIndex);
  };

  productPrev.addEventListener("click", () => showProduct(activeProduct - 1));
  productNext.addEventListener("click", () => showProduct(activeProduct + 1));
  productSlider.addEventListener("scroll", () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const sliderCenter =
        productSlider.getBoundingClientRect().left + productSlider.clientWidth / 2;
      const nearestIndex = productCards.reduce((nearest, card, index) => {
        const box = card.getBoundingClientRect();
        const distance = Math.abs(box.left + box.width / 2 - sliderCenter);
        return distance < nearest.distance ? { index, distance } : nearest;
      }, { index: 0, distance: Infinity }).index;
      updateControls(nearestIndex);
    });
  }, { passive: true });
  productSlider.addEventListener("scrollend", () => showProduct(activeProduct));

  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 700px)").matches) return;
    productSlider.scrollTo({
      left: getCenteredScrollLeft(productCards[activeProduct]),
    });
  });

  updateControls(0);
  requestAnimationFrame(() => {
    if (window.matchMedia("(max-width: 700px)").matches) showProduct(0);
  });
}
