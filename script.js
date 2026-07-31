/* ==========================================================================
   GET CABS - Interactive JavaScript Engine
   Company: Get Cabs
   Phone: 9894020156
   ========================================================================== */

window.currentLocalDistanceKm = 0; // Global store for Google Maps API distance

// Global SVG Image Placeholder & Error Handler
window.getFallbackSvg = function(title) {
  const cleanTitle = title ? String(title).replace(/['"<>&]/g, '') : 'Get Cabs Coimbatore';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="50%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#d90429"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#bg)"/>
    <circle cx="300" cy="150" r="48" fill="#ffb703" opacity="0.25"/>
    <path d="M280 170 L300 120 L320 170 Z" fill="#ffb703"/>
    <circle cx="300" cy="115" r="8" fill="#ffffff"/>
    <text x="300" y="235" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">${cleanTitle}</text>
    <text x="300" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#ffb703" text-anchor="middle">🚕 Get Cabs Coimbatore • Hotline: 9894020156</text>
  </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

window.handleImgError = function(imgEl, title) {
  if (!imgEl) return;
  imgEl.onerror = null; // Prevent recursion
  imgEl.src = window.getFallbackSvg(title || imgEl.alt || 'Get Cabs Tour');
};

document.addEventListener('DOMContentLoaded', function () {

  // Automatically clear pre-filled admin phone numbers from HTML on load
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    if (input.value === '9894020156') input.value = '';
  });

  // 1. Mobile Menu Toggle & Close on Click
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainMenu = document.querySelector('.main-menu');

  if (mobileToggle && mainMenu) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      mainMenu.classList.toggle('active');
    });

    // Close menu when clicking outside or clicking any menu link
    document.addEventListener('click', function(e) {
      if (mainMenu.classList.contains('active') && !mainMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mainMenu.classList.remove('active');
      }
    });

    const menuLinks = mainMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mainMenu.classList.remove('active');
      });
    });
  }

  // 2. Booking Form Tabs Handling (Local Rides, Oneway, Outstation, Hourly Package)
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  tabLinks.forEach(link => {
    link.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');

      // Update Active Tab Link
      tabLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');

      // Update Active Panel
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `tab-${targetTab}`) {
          panel.classList.add('active');
        }
      });

      // Recalculate fare for the newly active tab
      updateAllEstimates();
    });
  });

  // 3. Get Cabs Coimbatore Fare & Rate Calculation Engine
  const HILL_STATIONS = [
    'ooty', 'coonoor', 'munnar', 'kodaikanal', 'kodai', 'valparai',
    'yercaud', 'kotagiri', 'anamalai', 'wayanad', 'palani hills',
    'nilgiris', 'masinagudi', 'pykara', 'gudalur', 'topslip', 'agali'
  ];

  const FIXED_ONEWAY_RATES = {
    'annur': 1100,
    'isha': 1100,
    'anaikatti': 1300,
    'mettupalayam': 1400,
    'palladam': 1500,
    'sirumugai': 1500,
    'avinashi': 1600,
    'pollachi': 1600,
    'vana bathrakaliamman': 1600,
    'airport to tiruppur': 1700,
    'puliyampatti': 1800,
    'palakkad': 1900,
    'tirupur': 1900,
    'tiruppur': 1900,
    'airport to palakkad': 2200,
    'sathyamangalam': 2500,
    'kangeyam': 2500,
    'udumalpet': 2500,
    'perundurai': 2900,
    'gobi': 2900,
    'dharapuram': 2950,
    'kotagiri': 2900,
    'coonoor': 2900,
    'erode': 3500,
    'ooty': 3500,
    'palani': 3900
  };

  function isHillStation(text1 = '', text2 = '') {
    const combined = (String(text1) + ' ' + String(text2)).toLowerCase();
    return HILL_STATIONS.some(kw => combined.includes(kw));
  }

  function formatPriceRange(exactPrice) {
    const exact = Math.round(exactPrice);
    return `₹${exact.toLocaleString('en-IN')}`;
  }

  function calculateLocalFare(km, pickup = '', drop = '') {
    const dist = Math.max(0, parseFloat(km) || 0);
    let fare = 75 + (dist * 28);
    const combined = (String(pickup) + ' ' + String(drop)).toLowerCase();
    const borderOutskirts = [
      'karumathampatti', 'karanampettai', 'paapampatti', 'ganeshapuram',
      'kovilpalayam', 'karamadai', 'booluvampatti', 'pooluvapatti',
      'ettimadai', 'kinathukadavu'
    ];
    if (borderOutskirts.some(loc => combined.includes(loc))) {
      fare += 100;
    }
    return Math.round(fare);
  }

  function calculateOnewayFare(km, destName = '', pickupName = '') {
    const normDrop = String(destName).toLowerCase().trim();
    const normPickup = String(pickupName).toLowerCase().trim();
    
    for (let key in FIXED_ONEWAY_RATES) {
      if (normDrop.includes(key) || normPickup.includes(key)) {
        return FIXED_ONEWAY_RATES[key];
      }
    }

    const dist = Math.max(0, parseFloat(km) || 0);
    if (dist <= 100) {
      return dist * 2 * 17;
    } else {
      return (dist * 2 * 14) + 400;
    }
  }

  function calculateOutstationFare(roundTripKm, isHills) {
    const dist = Math.max(0, parseFloat(roundTripKm) || 0);
    if (dist <= 200) {
      return dist * 17;
    } else {
      return (dist * 14) + 400;
    }
  }

  function calculateHourlyFare(hours) {
    const hrs = parseInt(hours, 10) || 1;
    if (hrs >= 12) return 3500;
    if (hrs >= 10) return 3000;
    return hrs * 350;
  }

  function updateAllEstimates() {
    // 1. Local Ride Engine with API Fallback
    const localDistInput = document.getElementById('local-distance');
    let localDist = localDistInput ? parseFloat(localDistInput.value) : window.currentLocalDistanceKm;
    if (!localDist || isNaN(localDist) || localDist <= 0) localDist = 12; // Base fallback of 12 KM if API unverified
    
    const localPickup = document.getElementById('local-pickup')?.value || '';
    const localDrop = document.getElementById('local-drop')?.value || '';
    const localFareEl = document.getElementById('local-fare-display');
    if (localFareEl) {
      if (localPickup && localDrop) {
        const localPrice = calculateLocalFare(localDist, localPickup, localDrop);
        localFareEl.textContent = formatPriceRange(localPrice) + (window.currentLocalDistanceKm > 0 ? '' : '*');
      } else {
        localFareEl.textContent = '-';
      }
    }

    const onewayDistInputVal = document.getElementById('oneway-distance')?.value;
    const onewayPickup = document.getElementById('oneway-pickup')?.value || 'Coimbatore';
    const onewayDrop = document.getElementById('oneway-dest-select')?.value || 'Ooty Bus Stand';
    const onewayFareEl = document.getElementById('oneway-fare-display');
    if (onewayFareEl) {
      let onewayDist = onewayDistInputVal ? parseFloat(onewayDistInputVal) : 0;
      if (!onewayDist) {
        const selectedOpt = onewayDestSelect?.options?.[onewayDestSelect.selectedIndex];
        onewayDist = parseFloat(selectedOpt?.getAttribute('data-km') || 85);
      }
      const onewayPrice = calculateOnewayFare(onewayDist, onewayDrop, onewayPickup);
      onewayFareEl.textContent = formatPriceRange(onewayPrice);
    }

    const outstationPickup = document.getElementById('outstation-pickup')?.value || 'Coimbatore';
    const outstationDrop = document.getElementById('outstation-drop')?.value || 'Ooty';
    const manualHillsSelect = document.getElementById('outstation-is-hills');
    
    let isOutstationHills = isHillStation(outstationPickup, outstationDrop);
    if (manualHillsSelect && isOutstationHills) {
      manualHillsSelect.value = 'yes';
    } else if (manualHillsSelect && manualHillsSelect.value === 'yes') {
      isOutstationHills = true;
    }

    let outstationDist = parseFloat(document.getElementById('outstation-distance')?.value);
    if (isNaN(outstationDist) || outstationDist < 50) {
      outstationDist = isOutstationHills ? 300 : 250;
    }

    const outstationFareEl = document.getElementById('outstation-fare-display');
    if (outstationFareEl) {
      const outstationPrice = calculateOutstationFare(outstationDist, isOutstationHills);
      outstationFareEl.textContent = formatPriceRange(outstationPrice);
    }

    const selectedHours = document.getElementById('hourly-pkg-select')?.value || 10;
    const hourlyFareEl = document.getElementById('hourly-fare-display');
    if (hourlyFareEl) {
      const hourlyPrice = calculateHourlyFare(selectedHours);
      hourlyFareEl.textContent = formatPriceRange(hourlyPrice);
    }
  }

  const onewayDestSelect = document.getElementById('oneway-dest-select');
  const onewayDistInput = document.getElementById('oneway-distance');
  if (onewayDestSelect && onewayDistInput) {
    onewayDestSelect.addEventListener('change', function () {
      const selectedOpt = this.options[this.selectedIndex];
      const km = selectedOpt.getAttribute('data-km');
      if (km) {
        onewayDistInput.value = km;
      }
      updateAllEstimates();
    });
  }

  const calcInputs = [
    'local-cab-type',
    'oneway-pickup', 'oneway-distance', 'oneway-dest-select', 'oneway-cab-type',
    'outstation-pickup', 'outstation-drop', 'outstation-distance', 'outstation-is-hills', 'outstation-cab-type',
    'hourly-pkg-select', 'hourly-cab-type'
  ];

  calcInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateAllEstimates);
      el.addEventListener('change', updateAllEstimates);
      el.addEventListener('keyup', updateAllEstimates);
    }
  });

  updateAllEstimates();

  // 4. Booking Submission & Modal Popup
  const forms = [
    { id: 'form-local', type: 'Local Ride' },
    { id: 'form-oneway', type: 'Oneway Ride' },
    { id: 'form-outstation', type: 'Outstation Travel' },
    { id: 'form-hourly', type: 'Hourly Package Rental' }
  ];

  const modalOverlay = document.getElementById('booking-modal');
  const modalDetails = document.getElementById('modal-details-body');
  const modalCloseBtn = document.getElementById('modal-close');

  forms.forEach(item => {
    const formEl = document.getElementById(item.id);
    if (formEl) {
      formEl.addEventListener('submit', function (e) {
        e.preventDefault();

        let pickup = formEl.querySelector('[data-field="pickup"]')?.value || 'Coimbatore Gandhipuram';
        let drop = formEl.querySelector('[data-field="drop"]')?.value || 'Coimbatore Airport CJB';
        let date = formEl.querySelector('[data-field="date"]')?.value || 'Today';
        let time = formEl.querySelector('[data-field="time"]')?.value || 'Immediate';
        let phone = formEl.querySelector('[data-field="phone"]')?.value || '9894020156';
        
        let fareDisplaySpan = formEl.querySelector('.price-tag') || formEl.querySelector('[id$="-fare-display"]');
        let fare = fareDisplaySpan ? fareDisplaySpan.textContent : '₹450';
        if (fare === '-' || fare.includes('Calculating')) {
            fare = 'Standard Metered Fare based on final drop';
        }

        if (modalDetails) {
          modalDetails.innerHTML = `
            <div style="text-align:left; background:#f9fafb; padding:18px; border-radius:10px; margin:16px 0; border:1px solid #e5e7eb; font-size:0.95rem;">
              <p style="margin-bottom:6px;"><strong>Booking Type:</strong> <span style="color:#d90429; font-weight:700;">${item.type}</span></p>
              <p style="margin-bottom:6px;"><strong>Pickup Location:</strong> ${pickup}</p>
              <p style="margin-bottom:6px;"><strong>Drop Location / Destination:</strong> ${drop}</p>
              <p style="margin-bottom:6px;"><strong>Date & Time:</strong> ${date} at ${time}</p>
              <p style="margin-bottom:6px;"><strong>Customer Phone:</strong> ${phone}</p>
              <p style="margin-top:10px; font-size:1.15rem; color:#d90429;"><strong>Estimated Fare:</strong> ${fare}</p>
            </div>
            <p style="font-size:0.875rem; color:#059669; background:#ecfdf5; padding:12px; border-radius:8px; font-weight:600;">
              ✓ Get Cabs booking confirmation SMS & driver details will be sent to ${phone}. Or call us directly at <strong>9894020156</strong>.
            </p>
          `;
        }

        if (modalOverlay) {
          modalOverlay.classList.add('active');
        }
      });
    }
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  // 5. FAQ Accordion Handling
  const faqHeads = document.querySelectorAll('.faq-head');
  faqHeads.forEach(btn => {
    btn.addEventListener('click', function () {
      const parentCard = this.parentElement;
      const isActive = parentCard.classList.contains('active');

      document.querySelectorAll('.faq-card').forEach(card => card.classList.remove('active'));

      if (!isActive) {
        parentCard.classList.add('active');
      }
    });
  });

  // 6. Smooth Scroll Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        if (mainMenu) mainMenu.classList.remove('active');
      }
    });
  });

  // 7. Scroll Reveal Animations Observer
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 8. Dynamic Ambient Highway Motion Engine
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
      if (!heroCanvas.parentElement) return;
      width = heroCanvas.width = heroCanvas.parentElement.clientWidth || window.innerWidth;
      height = heroCanvas.height = heroCanvas.parentElement.clientHeight || 500;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const streaks = [];
    const numStreaks = 45;
    for (let i = 0; i < numStreaks; i++) {
      streaks.push({
        x: Math.random() * 2 - 1,
        y: Math.random(),
        z: Math.random() * 0.9 + 0.1,
        speed: Math.random() * 0.015 + 0.008,
        color: Math.random() > 0.4 ? 'rgba(217, 4, 41, ' : (Math.random() > 0.5 ? 'rgba(255, 183, 3, ' : 'rgba(255, 255, 255, '),
        length: Math.random() * 80 + 40
      });
    }

    function renderHighway() {
      if (!ctx || width === 0) return;
      ctx.clearRect(0, 0, width, height);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0b1329');
      skyGrad.addColorStop(0.5, '#111827');
      skyGrad.addColorStop(1, '#080d1a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.35;

      ctx.beginPath();
      ctx.moveTo(cx - width * 0.1, cy);
      ctx.lineTo(cx + width * 0.1, cy);
      ctx.lineTo(width * 1.2, height);
      ctx.lineTo(-width * 0.2, height);
      ctx.closePath();
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      streaks.forEach(s => {
        s.y += s.speed;
        if (s.y > 1) {
          s.y = 0;
          s.x = Math.random() * 2 - 1;
        }

        const px = cx + (s.x * (s.y * width * 0.6));
        const py = cy + (s.y * (height - cy));
        const pLength = s.length * s.y;
        const opacity = Math.min(s.y * 1.5, 0.9);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + (s.x * pLength * 0.2), py + pLength);
        ctx.strokeStyle = `${s.color}${opacity})`;
        ctx.lineWidth = Math.max(1, s.y * 5);
        ctx.stroke();
      });

      requestAnimationFrame(renderHighway);
    }
    renderHighway();
  }

  // 9. Background Video Autoplay & Fallback Handling
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;

    function attemptPlay() {
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          heroVideo.style.opacity = '1';
        }).catch(() => {
          heroVideo.style.opacity = '0.4';
        });
      }
    }

    heroVideo.addEventListener('loadeddata', attemptPlay);
    heroVideo.addEventListener('canplay', attemptPlay);
    attemptPlay();

    document.addEventListener('click', function playOnInteraction() {
      if (heroVideo.paused) {
        heroVideo.play().then(() => {
          heroVideo.style.opacity = '1';
        }).catch(() => {});
      }
    }, { once: true });
  }

  // 10. Dedicated Sub-Page Router & Dynamic Page Renderer
  const pageOverlay = document.getElementById('dedicated-page-overlay');
  const pageTitleEl = document.getElementById('dedicated-page-title');
  const pageContentEl = document.getElementById('dedicated-page-content');
  const pageCloseBtn = document.getElementById('dedicated-page-close');

  const BLOG_DATA = {
    'ooty-guide': {
      title: 'Top 10 Places to Visit in Ooty from Coimbatore (2026 Cab Guide)',
      category: 'Ooty Hill Guide',
      date: 'July 2026',
      readTime: '5 min read',
      img: './public/assets/images/blog-ooty.png',
      content: `...`
    },
    'airport-guide': {
      title: 'Coimbatore Airport Taxi Booking: Fast 24/7 Pickups & Fixed Fares',
      category: 'Airport Taxi',
      date: 'July 2026',
      readTime: '4 min read',
      img: './public/assets/images/blog-airport-taxi.png',
      content: `...`
    },
    'oneway-vs-round': {
      title: 'Oneway Cabs vs Round Trip Travel: Save Up to 40% On Intercity Travel',
      category: 'Fare Hacks',
      date: 'July 2026',
      readTime: '6 min read',
      img: './public/assets/images/blog-oneway-hacks.png',
      content: `...`
    },
    'hill-drives': {
      title: 'Best Hill Station Drives from Coimbatore: Valparai, Kodaikanal & Munnar',
      category: 'Outstation Tours',
      date: 'July 2026',
      readTime: '5 min read',
      img: './public/assets/images/blog-hill-drives.png',
      content: `...`
    },
    'red-taxi-comparison': {
      title: 'Red Taxi vs Get Cabs: Why Local Travelers Prefer Get Cabs in 2026',
      category: 'Red Taxi Comparison',
      date: 'July 2026',
      readTime: '4 min read',
      img: './public/assets/images/blog-red-taxi-compare.png',
      content: `...`
    }
  };

  const PAGE_TEMPLATES = {
    'privacy-policy': { title: 'Privacy Policy', content: `...` },
    'terms-conditions': { title: 'Terms & Conditions', content: `...` },
    'cancellation-policy': { title: 'Cancellation & Refund Policy', content: `...` },
    'faq': { title: 'Frequently Asked Questions (FAQ)', content: `...` },
    'contact-us': { title: 'Contact Get Cabs Coimbatore', content: `...` },
    'tariff': { title: 'Get Cabs Official Tariff Card', content: `...` },
    'popular-routes': { title: 'Popular Routes from Coimbatore (Fixed Fares)', content: `...` },
    'oneway-routes': { title: 'Discounted Oneway Routes', content: `...` },
    'blogs': { title: 'Get Cabs Travel Blogs & Articles', content: `...` },
    'tour-packages': { title: 'Popular Tour Packages & Outstation Trips', content: `...` }
  };

  const TOUR_PACKAGES_DATA = {
    'ooty-coonoor-kotagiri': { title: 'Ooty, Coonoor & Kotagiri Nilgiris Package', content: `...` },
    'munnar-hills': { title: 'Munnar Tea Hills & Waterfalls Package', content: `...` },
    'kodaikanal-hills': { title: 'Kodaikanal Lake & Mountain Peak Package', content: `...` },
    'yercaud-hills': { title: 'Yercaud Shevaroy Hills Gateway Package', content: `...` },
    'isha-vellingiri': { title: 'Isha Yoga Center & Vellingiri Sacred Package', content: `...` },
    'kerala-coastal': { title: 'Kerala Coastal Special', content: `...` },
    'pilgrimage-heritage': { title: 'Guruvayur, Madurai & Trichy Grand Pilgrimage Package', content: `...` },
    'kanyakumari-sunrise': { title: 'Kanyakumari Sunrise & Southern Coast Package', content: `...` },
    'wildlife-safari': { title: 'Mudumalai, Masinagudi, Wayanad & Calicut Safari Package', content: `...` }
  };

  function openDedicatedPage(pageKey, blogKey = null, packageKey = null) {
    if (!pageOverlay || !pageTitleEl || !pageContentEl) return;
    if (packageKey && TOUR_PACKAGES_DATA[packageKey]) {
      pageTitleEl.textContent = 'Tour Package Details';
      pageContentEl.innerHTML = TOUR_PACKAGES_DATA[packageKey].content;
    } else if (blogKey && BLOG_DATA[blogKey]) {
      pageTitleEl.textContent = 'Travel Article';
      pageContentEl.innerHTML = BLOG_DATA[blogKey].content;
    } else if (PAGE_TEMPLATES[pageKey]) {
      pageTitleEl.textContent = PAGE_TEMPLATES[pageKey].title;
      pageContentEl.innerHTML = PAGE_TEMPLATES[pageKey].content;
    }
    pageOverlay.classList.add('active');
    pageOverlay.scrollTop = 0;
    if (mainMenu) mainMenu.classList.remove('active');
  }

  function closeDedicatedPage() {
    if (pageOverlay) pageOverlay.classList.remove('active');
  }

  if (pageCloseBtn) {
    pageCloseBtn.addEventListener('click', closeDedicatedPage);
  }

  document.body.addEventListener('click', function(e) {
    const pageTarget = e.target.closest('[data-open-page]');
    const blogTarget = e.target.closest('[data-open-blog]');
    const packageTarget = e.target.closest('[data-open-package]');

    if (packageTarget) {
      e.preventDefault();
      openDedicatedPage('tour-packages', null, packageTarget.getAttribute('data-open-package'));
    } else if (pageTarget) {
      e.preventDefault();
      openDedicatedPage(pageTarget.getAttribute('data-open-page'));
    } else if (blogTarget) {
      e.preventDefault();
      openDedicatedPage('blogs', blogTarget.getAttribute('data-open-blog'));
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && pageOverlay && pageOverlay.classList.contains('active')) {
      closeDedicatedPage();
    }
  });

  // 11. App Bottom Dock Navigation & AI Chat UI
  const dockBookBtn = document.getElementById('dock-book-btn');
  const dockAiBtn = document.getElementById('dock-ai-btn');
  const aiChatWindow = document.getElementById('ai-chat-window');
  const aiChatClose = document.getElementById('ai-chat-close');
  const chatMessagesEl = document.getElementById('chat-messages');
  const chatInputEl = document.getElementById('chat-user-input');
  const chatSendBtn = document.getElementById('chat-send-btn');

  if (dockBookBtn) {
    dockBookBtn.addEventListener('click', function() {
      const bookingSection = document.getElementById('booking-form-section') || document.querySelector('.booking-card');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = '#booking-form-section';
      }
    });
  }

  function toggleAiChat() {
    if (!aiChatWindow) return;
    aiChatWindow.classList.toggle('active');
    if (aiChatWindow.classList.contains('active') && chatInputEl) {
      chatInputEl.focus();
    }
  }

  if (dockAiBtn) dockAiBtn.addEventListener('click', toggleAiChat);
  if (aiChatClose) aiChatClose.addEventListener('click', toggleAiChat);

  // 13. Spin & Win Discount Wheel Logic
  const discountModal = document.getElementById('discount-modal');
  const discountModalClose = document.getElementById('discount-modal-close');
  const spinWheelBtn = document.getElementById('spin-wheel-btn');
  const wheelGraphic = document.getElementById('wheel-graphic');
  const wheelResultMsg = document.getElementById('wheel-result-msg');

  if (discountModalClose) {
    discountModalClose.addEventListener('click', function() {
      discountModal.classList.remove('active');
    });
  }

  let hasSpun = false;
  if (spinWheelBtn) {
    spinWheelBtn.addEventListener('click', function() {
      if (hasSpun) return;
      const randomDegrees = 1440 + Math.floor(Math.random() * 360);
      if (wheelGraphic) {
        wheelGraphic.style.transform = `rotate(${randomDegrees}deg)`;
      }
      spinWheelBtn.disabled = true;
      spinWheelBtn.textContent = 'Spinning... 🎰';

      setTimeout(() => {
        hasSpun = true;
        spinWheelBtn.disabled = false;
        spinWheelBtn.textContent = '🎉 Coupon Code: GET100 Applied!';
        if (wheelResultMsg) {
          wheelResultMsg.innerHTML = '🎉 CONGRATS! You unlocked <strong style="color:var(--brand-red);">Coupon: GET100</strong> (Flat ₹100 Off on Oneway Ride!). Call 9894020156 or book now.';
        }
      }, 4000);
    });
  }

}); // <--- End of DOMContentLoaded block

// 14. Google Maps Places Autocomplete & Distance Matrix Engine (Globally Exposed)
window.initPlacesAutocomplete = function() {
  const localPickup = document.getElementById('local-pickup');
  const localDrop = document.getElementById('local-drop');
  const localFareEl = document.getElementById('local-fare-display');

  const autocompleteOptions = {
    componentRestrictions: { country: "in" },
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false
  };

  // Setup Autocomplete for Local Pickup & Drop
  if (localPickup) new google.maps.places.Autocomplete(localPickup, autocompleteOptions);
  if (localDrop) new google.maps.places.Autocomplete(localDrop, autocompleteOptions);

  // Other inputs autocomplete setup
  const otherInputs = [
    document.getElementById('oneway-pickup'),
    document.getElementById('outstation-pickup'),
    document.getElementById('outstation-drop'),
    document.querySelector('#form-hourly input[data-field="pickup"]')
  ];

  otherInputs.forEach(inputEl => {
    if (inputEl) {
      const ac = new google.maps.places.Autocomplete(inputEl, autocompleteOptions);
      ac.addListener('place_changed', function() {
        if (typeof updateAllEstimates === 'function') updateAllEstimates();
      });
    }
  });

  // Automatic Distance Matrix calculation when both Local Pickup and Drop are filled via Google Maps
  function calculateGoogleDistance() {
    if (!localPickup || !localDrop || !localFareEl) return;
    const origin = localPickup.value.trim();
    const destination = localDrop.value.trim();

    if (origin.length < 3 || destination.length < 3) {
      localFareEl.textContent = '-';
      return;
    }

    localFareEl.textContent = 'Calculating...'; // Provide instant UI feedback

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
    }, (response, status) => {
      if (status === "OK" && response.rows[0].elements[0].status === "OK") {
        const distanceMeters = response.rows[0].elements[0].distance.value;
        window.currentLocalDistanceKm = distanceMeters / 1000;
      } else {
        // Fallback safety if Google Maps API limits are hit or key is missing
        window.currentLocalDistanceKm = 0; 
      }
      
      // Trigger price calculation update
      if (typeof updateAllEstimates === 'function') updateAllEstimates();
    });
  }

  if (localPickup) {
    localPickup.addEventListener('change', calculateGoogleDistance);
    localPickup.addEventListener('blur', calculateGoogleDistance);
  }
  if (localDrop) {
    localDrop.addEventListener('change', calculateGoogleDistance);
    localDrop.addEventListener('blur', calculateGoogleDistance);
  }
};
