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
});

