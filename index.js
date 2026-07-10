/* ==========================================
   DIZEH GROUP - LUXURY CUSTOM HOME BUILDER
   INTERACTIVE LOGIC (VANILLA JS)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPortfolio();
  initFormHandler();
  initScrollAnimations();
});

/* ==========================================
   NAVIGATION LOGIC
   ========================================== */
function initNavigation() {
  const header = document.querySelector('.main-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  const bgImg = document.getElementById('bgimg');

  // Change header styling on scroll & apply parallax shift
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    
    // Header scroll background styling
    if (y > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Parallax zoom effect for hero background
    if (bgImg) {
      const shift = Math.min(y * 0.12, 60);
      bgImg.style.transform = `translateY(${shift}px) scale(1.05)`;
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileOverlay) {
    let menuOpen = false;
    
    mobileToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileToggle.classList.toggle('open', menuOpen);
      mobileOverlay.classList.toggle('open', menuOpen);
      document.body.classList.toggle('no-scroll', menuOpen);
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileToggle.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }
}

/* ==========================================
   PORTFOLIO GALLERY & LIGHTBOX
   ========================================== */
const PORTFOLIO_DATA = [
  // Mississauga
  {
    title: "Minimalist Limestone Estate",
    category: "mississauga",
    categoryLabel: "A Sense of Earthiness in Mississauga",
    src: "assets/projects/A Sense of Earthiness in Mississsauga/dizeh-mississauga-earthiness-01.jpg"
  },
  {
    title: "Earthiness Lounge",
    category: "mississauga",
    categoryLabel: "A Sense of Earthiness in Mississauga",
    src: "assets/projects/A Sense of Earthiness in Mississsauga/dizeh-mississauga-earthiness-03.jpg"
  },
  {
    title: "Bespoke Millwork & Dining",
    category: "mississauga",
    categoryLabel: "A Sense of Earthiness in Mississauga",
    src: "assets/projects/A Sense of Earthiness in Mississsauga/dizeh-mississauga-earthiness-05.jpg"
  },

  // Woodbridge
  {
    title: "Woodbridge Modern Estate",
    category: "woodbridge",
    categoryLabel: "Woodbridge Property Wrapped in Delight",
    src: "assets/projects/Woodbridge Property Wrapped in Delight/dizeh-woodbridge-delight-01.jpg"
  },
  {
    title: "Light-Filled Living Hall",
    category: "woodbridge",
    categoryLabel: "Woodbridge Property Wrapped in Delight",
    src: "assets/projects/Woodbridge Property Wrapped in Delight/dizeh-woodbridge-delight-03.jpg"
  },

  // Ajax
  {
    title: "Architectural Spiral Staircase",
    category: "ajax",
    categoryLabel: "Gleaming Heavenly White in Ajax",
    src: "assets/projects/Gleaming Heavenly White in Ajax/dizeh-ajax-gleaming-white-03.jpg"
  },
  {
    title: "Heavenly White Living",
    category: "ajax",
    categoryLabel: "Gleaming Heavenly White in Ajax",
    src: "assets/projects/Gleaming Heavenly White in Ajax/dizeh-ajax-gleaming-white-01.jpg"
  },
  {
    title: "Monochrome Gourmet Kitchen",
    category: "ajax",
    categoryLabel: "Gleaming Heavenly White in Ajax",
    src: "assets/projects/Gleaming Heavenly White in Ajax/dizeh-ajax-gleaming-white-07.jpg"
  },

  // Etobicoke
  {
    title: "Etobicoke Custom Residence",
    category: "etobicoke",
    categoryLabel: "Fine Living in Etobicoke",
    src: "assets/projects/Fine Living in Etobicoke/dizeh-etobicoke-fine-living-01.jpg"
  },
  {
    title: "Bespoke Wine Cellar & Bar",
    category: "etobicoke",
    categoryLabel: "Fine Living in Etobicoke",
    src: "assets/projects/Fine Living in Etobicoke/dizeh-etobicoke-fine-living-05.jpg"
  },
  {
    title: "Luxurious Master Suite",
    category: "etobicoke",
    categoryLabel: "Fine Living in Etobicoke",
    src: "assets/projects/Fine Living in Etobicoke/dizeh-etobicoke-fine-living-10.jpg"
  },
  {
    title: "Polished Limestone En Suite",
    category: "etobicoke",
    categoryLabel: "Fine Living in Etobicoke",
    src: "assets/projects/Fine Living in Etobicoke/dizeh-etobicoke-fine-living-15.jpg"
  },

  // Brampton
  {
    title: "Springtime Open Layout",
    category: "brampton",
    categoryLabel: "Bright and Fun Springtime in Brampton",
    src: "assets/projects/Bright and Fun Springtime in Brampton/dizeh-brampton-springtime-01.jpg"
  },
  {
    title: "Bespoke Fireplace Detail",
    category: "brampton",
    categoryLabel: "Bright and Fun Springtime in Brampton",
    src: "assets/projects/Bright and Fun Springtime in Brampton/dizeh-brampton-springtime-04.jpg"
  },

  // North Toronto
  {
    title: "Tranquility Stone Elevation",
    category: "north-toronto",
    categoryLabel: "Snow White Tranquility North of Toronto",
    src: "assets/projects/Snow White Tranquility North of Toronto/dizeh-north-toronto-snow-white-01.jpg"
  },
  {
    title: "High-Volume Living Space",
    category: "north-toronto",
    categoryLabel: "Snow White Tranquility North of Toronto",
    src: "assets/projects/Snow White Tranquility North of Toronto/dizeh-north-toronto-snow-white-04.jpg"
  }
];

let activeFilteredImages = [];
let currentLightboxIndex = 0;

function initPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  if (!grid) return;

  // Build grid items
  function renderGrid(filter = 'all') {
    grid.innerHTML = '';
    activeFilteredImages = [];

    PORTFOLIO_DATA.forEach((item, index) => {
      if (filter === 'all' || item.category === filter) {
        activeFilteredImages.push(item);
        const itemIdx = activeFilteredImages.length - 1;

        const el = document.createElement('div');
        el.className = 'gallery-item';
        el.setAttribute('data-category', item.category);
        el.setAttribute('data-index', itemIdx);
        
        el.innerHTML = `
          <img src="${item.src}" alt="${item.title}" class="gallery-item-img" loading="lazy">
          <div class="gallery-item-overlay">
            <span class="gallery-project-category">${item.categoryLabel}</span>
            <h3 class="gallery-project-title">${item.title}</h3>
          </div>
        `;

        el.addEventListener('click', () => {
          openLightbox(itemIdx);
        });

        grid.appendChild(el);
      }
    });
  }

  // Filter click events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');
      renderGrid(filterValue);
    });
  });

  // Lightbox handlers
  function openLightbox(index) {
    currentLightboxIndex = index;
    const item = activeFilteredImages[index];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxCaption.textContent = `${item.title} — ${item.categoryLabel}`;
    lightbox.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  function showNext() {
    currentLightboxIndex = (currentLightboxIndex + 1) % activeFilteredImages.length;
    const item = activeFilteredImages[currentLightboxIndex];
    lightboxImg.src = item.src;
    lightboxCaption.textContent = `${item.title} — ${item.categoryLabel}`;
  }

  function showPrev() {
    currentLightboxIndex = (currentLightboxIndex - 1 + activeFilteredImages.length) % activeFilteredImages.length;
    const item = activeFilteredImages[currentLightboxIndex];
    lightboxImg.src = item.src;
    lightboxCaption.textContent = `${item.title} — ${item.categoryLabel}`;
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  // Close lightbox on click outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Initial load
  renderGrid();
}

/* ==========================================
   CONTACT FORM SUBMITTER (Web3Forms API)
   ========================================== */
function initFormHandler() {
  const form = document.getElementById('inquiry-form');
  const formResult = document.getElementById('form-result');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formResult.className = '';
    formResult.textContent = 'Sending your inquiry...';

    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status === 200) {
        formResult.className = 'success';
        formResult.textContent = 'Thank you. Your inquiry has been sent successfully. We will connect with you shortly.';
        form.reset();
      } else {
        formResult.className = 'error';
        formResult.textContent = json.message || 'Something went wrong. Please try again.';
      }
    })
    .catch(error => {
      console.error(error);
      formResult.className = 'error';
      formResult.textContent = 'Could not submit the form. Please check your internet connection and try again.';
    });
  });
}

/* ==========================================
   SCROLL REVEAL ANIMATIONS
   ========================================== */
function initScrollAnimations() {
  // Use IntersectionObserver to animate content on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Trigger animation only once
      }
    });
  }, observerOptions);

  // Targets to animate
  const targets = document.querySelectorAll(
    '.about-text-container, .about-philosophy-container, .service-card, .gta-map-card, .contact-info-container, .contact-form-container'
  );

  targets.forEach(target => {
    target.classList.add('reveal-element');
    observer.observe(target);
  });
}
