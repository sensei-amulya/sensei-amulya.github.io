// Portfolio Interactions & Clipboard Management
document.addEventListener('DOMContentLoaded', () => {
  const EMAIL_ADDRESS = 'amulyagupta26@gmail.com';

  // 1. Copy Email to Clipboard Functionality (Header & Footer Split Pills)
  const setupCopyButton = (buttonId, tooltipId) => {
    const btn = document.getElementById(buttonId);
    const tooltip = document.getElementById(tooltipId);

    if (btn && tooltip) {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(EMAIL_ADDRESS);
          } else {
            // Fallback for older browsers or non-https contexts
            const textArea = document.createElement('textarea');
            textArea.value = EMAIL_ADDRESS;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }

          tooltip.classList.add('show');
          setTimeout(() => {
            tooltip.classList.remove('show');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy email:', err);
        }
      });
    }
  };

  setupCopyButton('copy-email-header-btn', 'copy-tooltip-header');
  setupCopyButton('copy-email-footer-btn', 'copy-tooltip-footer');

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDropdown = document.getElementById('mobile-dropdown');

  if (mobileToggle && mobileDropdown) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileDropdown.classList.toggle('open');
    });

    // Close mobile dropdown when a navigation link is clicked
    const mobileLinks = mobileDropdown.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDropdown.classList.remove('open');
      });
    });
  }

  // 3. Scrollspy: Active Navigation Link Tracking
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-menu .nav-item');

  const onScroll = () => {
    const scrollPosition = window.pageYOffset + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 4. Update Current Year in Footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 5. Interactive Fluid Cursor Glow Tracking
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        cursorGlow.style.opacity = '1';
        isMoving = true;
      }
    });

    window.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
      isMoving = false;
    });

    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }

  // ==========================================================================
  // 6. Private Hidden Analytics Engine (Only visible to Amulya)
  // Triggered via Shift + A or Double-Clicking { AG } Logo
  // ==========================================================================
  const STORAGE_KEYS = {
    TOTAL_VIEWS: 'ag_stat_total_views',
    UNIQUE_VISITORS: 'ag_stat_unique_visitors',
    VISITOR_ID: 'ag_stat_visitor_id',
    FIRST_VISIT: 'ag_stat_first_visit',
    LAST_VISIT: 'ag_stat_last_visit',
    REFERRER: 'ag_stat_referrer'
  };

  // Session timer
  let sessionStartTime = Date.now();
  let sessionSeconds = 0;
  setInterval(() => {
    sessionSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    const durationEl = document.getElementById('metric-session-duration');
    if (durationEl) {
      if (sessionSeconds < 60) {
        durationEl.textContent = `${sessionSeconds}s`;
      } else {
        const mins = Math.floor(sessionSeconds / 60);
        const secs = sessionSeconds % 60;
        durationEl.textContent = `${mins}m ${secs}s`;
      }
    }
  }, 1000);

  // Track page view silently
  const recordVisit = () => {
    try {
      // 1. Total views
      let totalViews = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_VIEWS) || '0', 10);
      totalViews += 1;
      localStorage.setItem(STORAGE_KEYS.TOTAL_VIEWS, totalViews.toString());

      // 2. Unique visitors
      let isNew = false;
      let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
      if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
        localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
        
        let uniqueVisitors = parseInt(localStorage.getItem(STORAGE_KEYS.UNIQUE_VISITORS) || '0', 10);
        uniqueVisitors += 1;
        localStorage.setItem(STORAGE_KEYS.UNIQUE_VISITORS, uniqueVisitors.toString());

        localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, new Date().toISOString());
        isNew = true;
      }

      // 3. Timestamps & Referrer
      localStorage.setItem(STORAGE_KEYS.LAST_VISIT, new Date().toISOString());

      if (document.referrer && !document.referrer.includes(window.location.hostname)) {
        localStorage.setItem(STORAGE_KEYS.REFERRER, document.referrer);
      }
    } catch (e) {
      // LocalStorage unavailable (private mode)
    }
  };
  recordVisit();

  // Populate & Display the Secret Modal
  const secretModal = document.getElementById('secret-analytics-modal');
  const closeBtn = document.getElementById('secret-modal-close-btn');

  const openSecretModal = () => {
    if (!secretModal) return;

    // Retrieve stats
    const totalViews = localStorage.getItem(STORAGE_KEYS.TOTAL_VIEWS) || '1';
    const uniqueVisitors = localStorage.getItem(STORAGE_KEYS.UNIQUE_VISITORS) || '1';
    const rawRef = localStorage.getItem(STORAGE_KEYS.REFERRER) || document.referrer;
    let cleanRef = 'Direct / Bookmarked';
    if (rawRef) {
      try {
        const refUrl = new URL(rawRef);
        cleanRef = refUrl.hostname.replace('www.', '');
      } catch (e) {
        cleanRef = rawRef;
      }
    }

    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
    const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);

    // Format UI elements
    const totalViewsEl = document.getElementById('metric-total-views');
    const uniqueVisitorsEl = document.getElementById('metric-unique-visitors');
    const referrerEl = document.getElementById('metric-referrer');
    const screenResEl = document.getElementById('metric-screen-res');
    const browserInfoEl = document.getElementById('metric-browser-info');
    const firstVisitEl = document.getElementById('metric-first-visit');
    const latestVisitEl = document.getElementById('metric-latest-visit');

    if (totalViewsEl) totalViewsEl.textContent = totalViews;
    if (uniqueVisitorsEl) uniqueVisitorsEl.textContent = uniqueVisitors;
    if (referrerEl) {
      referrerEl.textContent = cleanRef;
      referrerEl.title = rawRef || cleanRef;
    }

    if (screenResEl) {
      screenResEl.textContent = `${window.screen.width}×${window.screen.height} (${window.innerWidth}×${window.innerHeight})`;
    }

    if (browserInfoEl) {
      const ua = navigator.userAgent;
      let browser = 'Browser';
      if (ua.includes('Chrome')) browser = 'Chrome';
      else if (ua.includes('Safari')) browser = 'Safari';
      else if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Edg')) browser = 'Edge';

      const platform = navigator.platform || 'Desktop';
      browserInfoEl.textContent = `${browser} on ${platform}`;
    }

    if (firstVisitEl) {
      firstVisitEl.textContent = firstVisit ? new Date(firstVisit).toLocaleString() : 'Just now';
    }

    if (latestVisitEl) {
      latestVisitEl.textContent = lastVisit ? new Date(lastVisit).toLocaleString() : 'Just now';
    }

    secretModal.classList.add('open');
    secretModal.setAttribute('aria-hidden', 'false');
  };

  const closeSecretModal = () => {
    if (!secretModal) return;
    secretModal.classList.remove('open');
    secretModal.setAttribute('aria-hidden', 'true');
    // Remove hash if opened via hash
    if (window.location.hash === '#stats' || window.location.hash === '#analytics' || window.location.hash === '#admin') {
      history.replaceState(null, null, ' ');
    }
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSecretModal);
  }

  if (secretModal) {
    secretModal.addEventListener('click', (e) => {
      if (e.target === secretModal) {
        closeSecretModal();
      }
    });
  }

  // Trigger 1: Shift + A or Ctrl + Shift + A
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && secretModal && secretModal.classList.contains('open')) {
      closeSecretModal();
      return;
    }

    if ((e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a'))) {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      
      e.preventDefault();
      if (secretModal.classList.contains('open')) {
        closeSecretModal();
      } else {
        openSecretModal();
      }
    }
  });

  // Trigger 2: Double-click the { AG } logo in header
  const logoBtn = document.querySelector('.nav-logo');
  if (logoBtn) {
    logoBtn.addEventListener('dblclick', (e) => {
      e.preventDefault();
      openSecretModal();
    });
  }

  // Trigger 3: URL Hash (#stats, #analytics, #admin)
  const checkHash = () => {
    if (window.location.hash === '#stats' || window.location.hash === '#analytics' || window.location.hash === '#admin') {
      openSecretModal();
    }
  };
  window.addEventListener('hashchange', checkHash);
  checkHash();
});


