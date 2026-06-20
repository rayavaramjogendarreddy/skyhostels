// Premium UI Logic
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });
  }

  // Close menu on link click
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.textContent = '☰';
      }
    });
  });

  // Scroll Reveal Animation
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('section, .features li, main:not(.homepage-content)').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });

  // 1️⃣ GALLERY FILTER LOGIC
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  
  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        // Update active class
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        galleryCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 2️⃣ AUTO-SLIDING TESTIMONIALS LOGIC
  const track = document.getElementById('testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;
  let slideInterval;

  function updateSlider(index) {
    if (!track || cards.length === 0) return;
    
    if (index >= cards.length) index = 0;
    if (index < 0) index = cards.length - 1;
    currentIndex = index;

    // Check if we are on mobile/tablet view
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      // Desktop: reset transition to original
      track.style.transform = 'translateX(0px)';
      dots.forEach(d => d.classList.remove('active'));
      if (dots[0]) dots[0].classList.add('active');
      return;
    }

    // Using calc to translate safely considering gap
    track.style.transform = `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 2}rem))`;

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(() => {
      if (window.innerWidth <= 768) {
        updateSlider(currentIndex + 1);
      }
    }, 4000);
  }

  function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (dots.length > 0) {
    dots.forEach(dot => {
      dot.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-index'));
        updateSlider(idx);
        startAutoSlide();
      });
    });

    window.addEventListener('resize', () => {
      updateSlider(currentIndex);
    });

    // Initialize
    updateSlider(0);
    startAutoSlide();
  }

  // 3️⃣ FAQ ACCORDION LOGIC
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  if (accordionHeaders.length > 0) {
    accordionHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const item = this.parentElement;
        const content = this.nextElementSibling;
        const isActive = item.classList.contains('active');
        
        // Close others
        document.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.accordion-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });
        
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = null;
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // FAQ Modal (AI Help Bot) - Simplified
  const faqBtn = document.createElement('button');
  faqBtn.textContent = '?';
  faqBtn.className = 'faq-btn';
  faqBtn.style.display = 'none'; // Hiding AI/Help stuff as requested
  document.body.appendChild(faqBtn);
});
 