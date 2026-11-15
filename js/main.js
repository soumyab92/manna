/**
 * MANNA INFOTECH - Interactive Scripting
 * Handles mobile navigation, category filtering, FAQ accordions, modals, and toasts.
 * Pure Vanilla JavaScript - No dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  // Mobile Nav Drawer (Nexora Header System)
  const navDrawer = document.getElementById('nav');
  const scrim = document.getElementById('scrim');
  const menuBtn = document.getElementById('menu');
  const closeBtn = document.getElementById('x');

  function toggleDrawer(open) {
    if (navDrawer) navDrawer.classList.toggle('open', open);
    if (scrim) scrim.classList.toggle('on', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && closeBtn) closeBtn.focus();
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDrawer && navDrawer.classList.contains('open');
      toggleDrawer(!isOpen);
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', () => toggleDrawer(false));
  if (scrim) scrim.addEventListener('click', () => toggleDrawer(false));

  document.addEventListener('click', (e) => {
    if (navDrawer && navDrawer.classList.contains('open')) {
      if (!navDrawer.contains(e.target) && !menuBtn.contains(e.target)) {
        toggleDrawer(false);
      }
    }
  });

  if (navDrawer) {
    navDrawer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.hasAttribute('data-open-modal')) {
        toggleDrawer(false);
      }
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) toggleDrawer(false);
  });

  // Hero Auto Slider (index.html)
  const heroSlider = document.getElementById('heroSlider');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const timerBar = document.getElementById('sliderTimerBar');

  if (heroSlider && slides.length > 1) {
    let currentSlide = 0;
    let progressInterval = null;
    let progress = 0;
    const slideDuration = 5000; // 5000ms = 5 seconds
    const progressStep = 50; // update progress every 50ms

    function updateProgress() {
      progress += (progressStep / slideDuration) * 100;
      if (timerBar) {
        timerBar.style.width = Math.min(progress, 100) + '%';
      }
      if (progress >= 100) {
        nextSlide();
      }
    }

    function resetTimer() {
      progress = 0;
      if (timerBar) timerBar.style.width = '0%';
      clearInterval(progressInterval);
      progressInterval = setInterval(updateProgress, progressStep);
    }

    function pauseTimer() {
      clearInterval(progressInterval);
    }

    function resumeTimer() {
      clearInterval(progressInterval);
      progressInterval = setInterval(updateProgress, progressStep);
    }

    function goToSlide(targetIndex) {
      slides.forEach((s, idx) => {
        s.classList.remove('active');
        s.classList.remove('prev-slide');
        if (idx < targetIndex) {
          s.classList.add('prev-slide');
        }
      });

      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

      currentSlide = (targetIndex + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');

      resetTimer();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
      });
    });

    // Pause on hover
    heroSlider.addEventListener('mouseenter', pauseTimer);
    heroSlider.addEventListener('mouseleave', resumeTimer);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      pauseTimer();
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
      } else {
        resumeTimer();
      }
    }, { passive: true });

    // Initialize progress timer
    resetTimer();
  }

  // Product Category Filters (products.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedCategory = btn.getAttribute('data-filter');

        productCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (selectedCategory === 'all' || cardCategory === selectedCategory) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          
          // Close other accordion items
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });

          // Toggle current
          if (isActive) {
            item.classList.remove('active');
          } else {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // Modal Dialogs
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalOpenTriggers = document.querySelectorAll('[data-open-modal]');
  const modalCloseTriggers = document.querySelectorAll('[data-close-modal]');

  // Open modal handler
  modalOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      
      // Check if product title was passed
      const productTitle = trigger.getAttribute('data-product-title');
      if (productTitle && targetModal) {
        const itemInput = targetModal.querySelector('input[name="inquiry_item"], input[name="device_model"]');
        if (itemInput) {
          itemInput.value = productTitle;
        }
      }

      if (targetModal) {
        targetModal.classList.add('active', 'open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal handler
  modalCloseTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      modalOverlays.forEach(modal => modal.classList.remove('active', 'open'));
      document.body.style.overflow = '';
    });
  });

  // Close when clicking overlay backdrop
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active', 'open');
        document.body.style.overflow = '';
      }
    });
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(modal => modal.classList.remove('active', 'open'));
      document.body.style.overflow = '';
    }
  });

  // WhatsApp Integration & Form Submission Handler
  const WHATSAPP_PHONE = '917872000333';

  // Helper to format WhatsApp message from submitted form
  function buildWhatsAppMessage(form) {
    // 1. Identify form title / inquiry type
    let formTitle = 'Website Inquiry';
    const modalDialog = form.closest('.modal-dialog');
    const cardParent = form.closest('.contact-form-card');
    if (modalDialog) {
      const modalTitle = modalDialog.querySelector('.modal-title');
      if (modalTitle) formTitle = modalTitle.textContent.trim();
    } else if (cardParent) {
      const cardTitle = cardParent.querySelector('h2');
      if (cardTitle) formTitle = cardTitle.textContent.trim();
    }

    // 2. Page information
    const pageName = document.title.replace(/\s*[-–|—].*$/, '').trim() || 'Manna Infotech';
    const pageFile = window.location.pathname.split('/').pop() || 'index.html';

    // 3. Extract form data
    const formData = new FormData(form);
    const details = [];

    // Prioritized field map for structured presentation
    const fieldMap = [
      { key: 'inquiry_type', label: 'Service / Inquiry', icon: '📌' },
      { key: 'inquiry_item', label: 'Item / Product', icon: '🛒' },
      { key: 'device_type', label: 'Device Category', icon: '💻' },
      { key: 'device_model', label: 'Brand & Model', icon: '🏷️' },
      { key: 'name', label: 'Customer Name', icon: '👤' },
      { key: 'phone', label: 'Phone Number', icon: '📞' },
      { key: 'email', label: 'Email Address', icon: '📧' },
      { key: 'issue', label: 'Problem / Defect', icon: '🛠️' },
      { key: 'notes', label: 'Requirement / Budget', icon: '📝' },
      { key: 'message', label: 'Problem / Details', icon: '📝' }
    ];

    const handledKeys = new Set();
    fieldMap.forEach(field => {
      const val = formData.get(field.key);
      if (val && String(val).trim() !== '') {
        details.push(`${field.icon} *${field.label}:* ${String(val).trim()}`);
        handledKeys.add(field.key);
      }
    });

    // Check for any remaining custom inputs
    for (let [key, val] of formData.entries()) {
      if (!handledKeys.has(key) && val && String(val).trim() !== '') {
        const inputElem = form.querySelector(`[name="${key}"]`);
        let label = key;
        if (inputElem) {
          const parentGroup = inputElem.closest('.form-group');
          const lbl = parentGroup ? parentGroup.querySelector('.form-label, label') : null;
          if (lbl) label = lbl.textContent.replace(/\*/g, '').trim();
        }
        details.push(`🔹 *${label}:* ${String(val).trim()}`);
      }
    }

    // 4. Current Timestamp
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // 5. Construct formatted WhatsApp text
    let message = `*MANNA INFOTECH - NEW INQUIRY*\n`;
    message += `═════════════════════════\n`;
    message += `📋 *Request:* ${formTitle}\n`;
    message += `─────────────────────────\n`;
    if (details.length > 0) {
      message += details.join('\n') + `\n`;
    } else {
      message += `(No additional details entered)\n`;
    }
    message += `─────────────────────────\n`;
    message += `🌐 *Source:* ${pageName} (${pageFile})\n`;
    message += `🕒 *Received:* ${formattedDate}, ${formattedTime}\n`;
    message += `📍 *Belda, NH 5, Paschim Medinipur*\n`;
    message += `═════════════════════════`;

    return message;
  }

  // Form Submission Handler -> Send all details via WhatsApp
  const interactiveForms = document.querySelectorAll('form.js-ajax-form');
  interactiveForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check HTML5 validity
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width:18px; height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          Opening WhatsApp...
        `;
      }

      // 1. Build WhatsApp message and URL
      const waMessage = buildWhatsAppMessage(form);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waMessage)}`;

      // 2. Open WhatsApp immediately synchronously with user submit event
      try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.warn('Could not auto-open WhatsApp tab:', err);
      }

      // 3. Provide feedback, reset form, close modal after smooth transition
      setTimeout(() => {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }

        modalOverlays.forEach(modal => modal.classList.remove('active'));
        document.body.style.overflow = '';

        showWhatsAppToast(whatsappUrl);
      }, 600);
    });
  });

  // Interactive Toast Notification for WhatsApp Submission
  let toastTimer = null;
  function showWhatsAppToast(whatsappUrl) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <span class="toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </span>
      <div class="toast-content">
        <div class="toast-title">Details Prepared for WhatsApp!</div>
        <div class="toast-message">Your inquiry details are formatted for +91 78720 00333. If WhatsApp didn't open automatically:</div>
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="toast-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          Open WhatsApp Chat
        </a>
      </div>
      <button type="button" class="toast-close" aria-label="Dismiss notification">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        if (toastTimer) clearTimeout(toastTimer);
      });
    }

    setTimeout(() => toast.classList.add('show'), 50);

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 8000);
  }

  // Generic toast function for compatibility
  function showToast(message) {
    showWhatsAppToast(`https://wa.me/${WHATSAPP_PHONE}`);
  }
});
