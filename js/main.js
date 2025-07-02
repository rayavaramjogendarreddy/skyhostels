// FAQ Modal (AI Help Bot)
document.addEventListener('DOMContentLoaded', function() {
  const faqBtn = document.createElement('button');
  faqBtn.textContent = 'Help';
  faqBtn.className = 'faq-btn';
  document.body.appendChild(faqBtn);

  const modal = document.createElement('div');
  modal.className = 'faq-modal';
  modal.innerHTML = `
    <div class="faq-content">
      <span class="close">&times;</span>
      <h2>Frequently Asked Questions</h2>
      <ul>
        <li><strong>What are the hostel timings?</strong><br>6:00 AM - 10:00 PM</li>
        <li><strong>Is food provided?</strong><br>Yes, both veg and non-veg options are available.</li>
        <li><strong>Is there WiFi?</strong><br>Yes, high-speed WiFi is available for all residents.</li>
        <li><strong>How do I apply?</strong><br>Use the Apply Now button or contact us via the form.</li>
      </ul>
    </div>
  `;
  document.body.appendChild(modal);

  faqBtn.onclick = function() {
    modal.style.display = 'block';
  };
  modal.querySelector('.close').onclick = function() {
    modal.style.display = 'none';
  };
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
});

// Datalist for form suggestions (auto-form suggestions)
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const nameInput = contactForm.querySelector('input[name="name"]');
    if (nameInput) {
      const datalist = document.createElement('datalist');
      datalist.id = 'name-suggestions';
      ['Amit', 'Priya', 'Rahul', 'Sneha', 'John'].forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
      });
      nameInput.setAttribute('list', 'name-suggestions');
      contactForm.appendChild(datalist);
    }
  }
});

// FAQ Modal styles
const style = document.createElement('style');
style.textContent = `
.faq-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 1.2em;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
}
.faq-modal {
  display: none;
  position: fixed;
  z-index: 1001;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background: rgba(0,0,0,0.4);
}
.faq-content {
  background: #fff;
  margin: 10% auto;
  padding: 2em;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  position: relative;
}
.faq-content .close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 1.5em;
  cursor: pointer;
}
`;
document.head.appendChild(style);

// Mobile nav toggle
// Ensure this runs after DOM is loaded

document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = navToggle ? navToggle.parentElement : null;
  const navLinks = document.querySelectorAll('.nav-links a');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function(e) {
      nav.classList.toggle('open');
    });
  }

  // Close nav menu when a link is clicked (on mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 900 && nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
      }
    });
  });
}); 