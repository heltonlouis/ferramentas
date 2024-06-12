// Carrossel
let currentIndex = 0;
const images = document.querySelectorAll(".carousel img");
const indicators = document.querySelectorAll(".carousel-indicators span");
const totalImages = images.length;

function showImage(index) {
  images[currentIndex].classList.remove("active");
  indicators[currentIndex].classList.remove("active");
  currentIndex = index;
  images[currentIndex].classList.add("active");
  indicators[currentIndex].classList.add("active");
}

function showNextImage() {
  const nextIndex = (currentIndex + 1) % totalImages;
  showImage(nextIndex);
}

indicators.forEach((indicator) => {
  indicator.addEventListener("click", () => {
    const index = parseInt(indicator.getAttribute("data-index"));
    showImage(index);
  });
});

setInterval(showNextImage, 3000);

// Adiciona a classe 'active' ao menu ativo
document.querySelectorAll("nav ul li a").forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});
