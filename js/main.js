/**
 * Main Application Script - G. T. Vasanthaprabhu Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticleCanvas();
  initTypewriter();
  initNavbar();
  initProjectFilters();
  initProjectModals();
  initResumeModal();
  initContactForm();
  initClipboardButtons();
});

/* ==========================================================================
   1. Multi-Theme Engine & Dropdown Switcher
   ========================================================================== */
const THEME_CONFIGS = {
  professional: {
    name: 'Quantum Aurora',
    dotColor: '#6366f1',
    particleColors: ['rgba(99, 102, 241,', 'rgba(139, 92, 246,', 'rgba(6, 182, 212,'],
    lineColor: 'rgba(99, 102, 241,'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    dotColor: '#ec4899',
    particleColors: ['rgba(236, 72, 153,', 'rgba(6, 182, 212,', 'rgba(139, 92, 246,'],
    lineColor: 'rgba(236, 72, 153,'
  },
  titanium: {
    name: 'Titanium',
    dotColor: '#ffffff',
    particleColors: ['rgba(255, 255, 255,', 'rgba(161, 161, 170,', 'rgba(203, 213, 225,'],
    lineColor: 'rgba(255, 255, 255,'
  },
  emerald: {
    name: 'Emerald',
    dotColor: '#10b981',
    particleColors: ['rgba(16, 185, 129,', 'rgba(52, 211, 153,', 'rgba(20, 184, 166,'],
    lineColor: 'rgba(16, 185, 129,'
  },
  sapphire: {
    name: 'Sapphire',
    dotColor: '#3b82f6',
    particleColors: ['rgba(59, 130, 246,', 'rgba(56, 189, 248,', 'rgba(99, 102, 241,'],
    lineColor: 'rgba(59, 130, 246,'
  },
  light: {
    name: 'Light',
    dotColor: '#2563eb',
    particleColors: ['rgba(79, 70, 229,', 'rgba(2, 132, 199,', 'rgba(5, 150, 105,'],
    lineColor: 'rgba(79, 70, 229,'
  }
};

let currentActiveTheme = 'emerald';
let updateParticleThemeColors = null;

function initTheme() {
  const themePickerBtn = document.getElementById('theme-picker-btn');
  const themeDropdownMenu = document.getElementById('theme-dropdown-menu');
  const currentNameEl = document.getElementById('theme-current-name');
  const currentDotEl = document.getElementById('theme-current-dot');
  const optionItems = document.querySelectorAll('.theme-option-item');

  const savedTheme = localStorage.getItem('vasanth_portfolio_theme') || 'emerald';
  applyTheme(savedTheme, false);

  if (themePickerBtn && themeDropdownMenu) {
    themePickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = themeDropdownMenu.classList.contains('open');
      if (isOpen) {
        closeThemeDropdown();
      } else {
        openThemeDropdown();
      }
    });

    optionItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeId = item.getAttribute('data-set-theme');
        applyTheme(themeId, true);
        closeThemeDropdown();
      });
    });

    document.addEventListener('click', (e) => {
      if (!themePickerBtn.contains(e.target) && !themeDropdownMenu.contains(e.target)) {
        closeThemeDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && themeDropdownMenu.classList.contains('open')) {
        closeThemeDropdown();
      }
    });
  }

  function openThemeDropdown() {
    themeDropdownMenu.classList.add('open');
    themePickerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeThemeDropdown() {
    themeDropdownMenu.classList.remove('open');
    themePickerBtn.setAttribute('aria-expanded', 'false');
  }

  function applyTheme(themeKey, notify = false) {
    const config = THEME_CONFIGS[themeKey] || THEME_CONFIGS.cyberpunk;
    currentActiveTheme = themeKey;

    document.documentElement.setAttribute('data-theme', themeKey);
    localStorage.setItem('vasanth_portfolio_theme', themeKey);

    if (currentNameEl) currentNameEl.textContent = config.name;
    if (currentDotEl) currentDotEl.style.background = config.dotColor;

    optionItems.forEach((item) => {
      if (item.getAttribute('data-set-theme') === themeKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (updateParticleThemeColors) {
      updateParticleThemeColors(config);
    }

    if (notify) {
      showToast(`Activated ${config.name} Theme!`);
    }
  }
}

/* ==========================================================================
   2. Interactive Constellation Canvas
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };
  let particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 80);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.speedY = (Math.random() - 0.5) * 0.7;
      this.assignColor();
    }

    assignColor() {
      const config = THEME_CONFIGS[currentActiveTheme] || THEME_CONFIGS.cyberpunk;
      this.color = config.particleColors[Math.floor(Math.random() * config.particleColors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > width) this.x = 0;
      else if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      else if (this.y < 0) this.y = height;

      // Mouse collision repulsion
      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          this.x -= forceDirectionX * force * 2;
          this.y -= forceDirectionY * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + ' 0.65)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  updateParticleThemeColors = function(config) {
    particles.forEach((p) => {
      p.color = config.particleColors[Math.floor(Math.random() * config.particleColors.length)];
    });
  };

  function connect() {
    const config = THEME_CONFIGS[currentActiveTheme] || THEME_CONFIGS.cyberpunk;
    const baseLineColor = config.lineColor;

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          let opacityValue = 1 - distance / 110;
          ctx.strokeStyle = `${baseLineColor} ${opacityValue * 0.2})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typing-text');
  if (!element) return;

  const roles = [
    'AI & Machine Learning Builder',
    'Generative AI & LLM Practitioner',
    'Full Stack Web Developer',
    'Computer Science Engineer',
    'Data Analytics Specialist'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. Navbar Scroll & Mobile Navigation
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  // Sticky Navbar blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy active state
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileBtn.querySelector('span');
      if (icon) {
        icon.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
      }
    });

    navItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileBtn.querySelector('span');
        if (icon) icon.textContent = '☰';
      });
    });
  }
}

/* ==========================================================================
   5. Project Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterCategory === 'all' || categories.includes(filterCategory)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Project Detail Modals
   ========================================================================== */
const projectData = {
  blood: {
    title: 'Real Time Smart Blood Donation Coordination System',
    category: 'Full Stack & HealthTech',
    year: '2025 - 2026',
    image: 'assets/images/blood-donation.jpg',
    badge: 'Flagship Platform',
    github: 'https://github.com/Vasanthaprabhu7',
    description:
      'A centralized emergency coordination platform connecting hospitals, blood banks, and verified eligible blood donors in real-time, drastically reducing critical response latency in emergencies.',
    problem:
      'Critical delays in procuring rare blood groups during surgical emergencies due to fragmented manual calling systems and lack of real-time inventory visibility across regional hospitals.',
    solution:
      'Engineered an automated matching architecture using geolocation proximity and blood group compatibility algorithms. Hospitals broadcast instant emergency requests, and eligible donors within radius receive immediate push alerts.',
    features: [
      'Real-time donor-hospital matching algorithm based on ABO/Rh compatibility, distance, and donation eligibility cooldown.',
      'Emergency broadcast notification pipeline delivering instant SMS and in-app alerts to suitable donors within a 15km perimeter.',
      'Live Hospital Blood Inventory tracker preventing over-requests and ensuring equitable regional blood availability.',
      'Role-based access security for certified hospital medical staff and verified voluntary donors.'
    ],
    techStack: ['Python', 'ReactJS', 'SQL', 'WebSockets', 'Geolocation API', 'CSS3/HTML5']
  },
  social: {
    title: 'Social Media Analytics Using Python',
    category: 'Data Analytics & NLP',
    year: '2026',
    image: 'assets/images/social-analytics.jpg',
    badge: 'NLP & Analytics',
    github: 'https://github.com/Vasanthaprabhu7',
    description:
      'An end-to-end data analytics pipeline that ingests, cleans, and extracts meaningful sentiment insights and engagement patterns from social media feeds.',
    problem:
      'Organizations and brands struggle to extract actionable qualitative sentiment and viral trends from thousands of unstructured social media posts and user comments.',
    solution:
      'Constructed a Python analytics framework utilizing Pandas, NLP tokenization, and sentiment polarity scoring to categorize audience responses into positive, neutral, and negative sentiment clusters with high fidelity.',
    features: [
      'Automated data ingestion and preprocessing pipeline cleaning emojis, hashtags, and unstructured text.',
      'Sentiment polarity analysis and topic clustering discovering top user pain points and viral discussion topics.',
      'Interactive visual dashboard showing 30-day engagement trends, audience demographics, and geographic distribution.',
      'Exportable reporting engine for marketing and product strategy optimization.'
    ],
    techStack: ['Python', 'Pandas', 'NumPy', 'NLP / TextBlob', 'Matplotlib', 'Data Analytics']
  },
  churn: {
    title: 'Customer Churn Prediction Platform',
    category: 'Machine Learning & Predictive AI',
    year: '2026',
    image: 'assets/images/churn-prediction.jpg',
    badge: 'Machine Learning',
    github: 'https://github.com/Vasanthaprabhu7',
    description:
      'A supervised machine learning classification platform predicting customer churn risk with high accuracy, enabling proactive customer retention strategies.',
    problem:
      'Subscription businesses face high customer acquisition costs when unpredicted customer churn erodes monthly recurring revenue without advance warning.',
    solution:
      'Built a comprehensive ML workflow: feature engineering, Exploratory Data Analysis (EDA), addressing class imbalance, and training predictive models evaluated on ROC-AUC, precision, and recall.',
    features: [
      'Exploratory Data Analysis identifying top churn drivers: customer support ticket volume, contract duration, and payment methods.',
      'Model evaluation featuring ROC-AUC curves (0.89 AUC), Confusion Matrix, and Precision/Recall trade-off optimization.',
      'Individual customer risk score calculator categorizing users into High, At-Risk, and Emerging retention tiers.',
      'Automated retention recommendation engine generating targeted promotional incentives for high-risk accounts.'
    ],
    techStack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'EDA & Feature Engineering', 'Data Visualization']
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalBody = document.getElementById('project-modal-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const detailBtns = document.querySelectorAll('.btn-project-detail');

  if (!modalBackdrop || !modalBody) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="modal-project-img" />
      <div class="modal-header-meta">
        <span class="project-category-badge">${data.category}</span>
        <span class="project-year-badge">${data.year}</span>
      </div>
      <h3 class="modal-title">${data.title}</h3>
      <p class="project-excerpt">${data.description}</p>
      
      <h4 class="modal-section-title"><span>🚨</span> The Problem</h4>
      <p class="bento-text">${data.problem}</p>
      
      <h4 class="modal-section-title"><span>💡</span> Engineering Solution</h4>
      <p class="bento-text">${data.solution}</p>
      
      <h4 class="modal-section-title"><span>⚡</span> Key Architectural Features</h4>
      <ul class="modal-bullets">
        ${data.features.map((f) => `<li>${f}</li>`).join('')}
      </ul>

      <h4 class="modal-section-title"><span>🛠️</span> Technologies Used</h4>
      <div class="project-stack-wrap" style="margin-top: 0.5rem; margin-bottom: 1.5rem;">
        ${data.techStack.map((tech) => `<span class="project-stack-tag">${tech}</span>`).join('')}
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
          View on GitHub
        </a>
      </div>
    `;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  detailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. Interactive Resume Modal & Print
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.trigger-resume-modal');
  const closeBtn = document.getElementById('resume-modal-close');
  const printBtn = document.getElementById('print-resume-btn');

  if (!resumeModal) return;

  function openResume() {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResume();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeResume);

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
      closeResume();
    }
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   8. One-Click Clipboard Copy Buttons
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Information';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied ${label} to clipboard!`);
        });
      } else {
        // Fallback for non-https/older browsers
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied ${label} to clipboard!`);
      }
    });
  });
}

/* ==========================================================================
   9. Contact Form Dispatch & Feedback
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim() || 'Portfolio Inquiry';
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    // Prepare mailto link for reliable direct sending
    const mailtoUri = `mailto:vasanthaprabhu3072004@gmail.com?subject=${encodeURIComponent(
      `[Portfolio] ${subject} from ${name}`
    )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    // Show instant success feedback
    showToast('Message composed! Launching email client...');

    setTimeout(() => {
      window.location.href = mailtoUri;
      contactForm.reset();
    }, 600);
  });
}

/* ==========================================================================
   10. Toast Notification System
   ========================================================================== */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? '✓' : 'ℹ';
  toast.innerHTML = `<span style="color: var(--accent-cyan); font-weight: bold;">${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}
