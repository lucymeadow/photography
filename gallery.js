(() => {
  const galleryEl = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCurrent = document.getElementById("lightbox-current");
  const lightboxTotal = document.getElementById("lightbox-total");
  const aboutPage = document.getElementById("about-page");
  const contactPage = document.getElementById("contact-page");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  let manifest = {};
  let currentImages = [];
  let currentIndex = 0;
  let currentGallery = "portfolio";

  menuToggle.addEventListener("click", () => nav.classList.toggle("open"));

  fetch("files.json")
    .then((r) => r.json())
    .then((data) => {
      manifest = data;

      const hash = window.location.hash.slice(1);
      if (hash && manifest[hash]) {
        currentGallery = hash;
      }
      setActiveNav(currentGallery);
      loadGallery(currentGallery);
    });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const gallery = link.dataset.gallery;
      const page = link.dataset.page;

      nav.classList.remove("open");
      setActiveNav(gallery || page);

      if (page === "about") {
        showPage(aboutPage);
      } else if (page === "contact") {
        showPage(contactPage);
      } else if (gallery) {
        hidePage();
        currentGallery = gallery;
        window.location.hash = gallery;
        loadGallery(gallery);
      }
    });
  });

  function setActiveNav(key) {
    document.querySelectorAll(".nav-link").forEach((l) => {
      l.classList.toggle(
        "active",
        l.dataset.gallery === key || l.dataset.page === key
      );
    });
  }

  function showPage(el) {
    galleryEl.style.display = "none";
    aboutPage.classList.add("hidden");
    contactPage.classList.add("hidden");
    el.classList.remove("hidden");
  }

  function hidePage() {
    aboutPage.classList.add("hidden");
    contactPage.classList.add("hidden");
    galleryEl.style.display = "";
  }

  function loadGallery(name) {
    const images = manifest[name] || [];
    currentImages = images;
    galleryEl.innerHTML = "";

    images.forEach((src, i) => {
      const item = document.createElement("div");
      item.className = "gallery-item";

      const img = document.createElement("img");
      img.loading = "lazy";
      img.alt = formatAlt(src);
      img.src = src;
      img.addEventListener("load", () => img.classList.add("loaded"));

      item.addEventListener("click", () => openLightbox(i));

      item.appendChild(img);
      galleryEl.appendChild(item);
    });
  }

  function formatAlt(src) {
    const name = src.split("/").pop().split(".")[0];
    return name.replace(/[_+%()0-9]/g, " ").trim() || "Photograph";
  }

  // Lightbox

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    lightboxImg.src = currentImages[currentIndex];
    lightboxCurrent.textContent = currentIndex + 1;
    lightboxTotal.textContent = currentImages.length;
  }

  function prevImage() {
    currentIndex =
      (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightbox();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightbox();
  }

  document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  document.querySelector(".lightbox-prev").addEventListener("click", prevImage);
  document.querySelector(".lightbox-next").addEventListener("click", nextImage);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-img-wrap")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  });

  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx > 0 ? prevImage() : nextImage();
    }
  });
})();
