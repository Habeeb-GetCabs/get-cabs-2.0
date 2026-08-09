/* ==========================================================================
   GET CABS - Coimbatore Cab Booking & AI Assistant Engine (Pure JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. DATA DEFINITIONS: Outstation Routes & Packages
  const OUTSTATION_PACKAGES = [
    {
      id: 'ooty-oneway',
      title: 'Coimbatore to Ooty Cab',
      type: 'Oneway Drop / Round Trip',
      distance: '85 KM (3 Hours)',
      sedanPrice: '₹2,680',
      suvPrice: '₹3,450',
      desc: 'Scenic drive through Mettupalayam and 36 Hairpin Bends. Expert hill station drivers guaranteed.',
      badge: 'POPULAR HILL TRIP',
      isHill: true
    },
    {
      id: 'pollachi-drop',
      title: 'Coimbatore to Pollachi Cab',
      type: 'Oneway Drop Taxi',
      distance: '45 KM (1 Hour)',
      sedanPrice: '₹1,260',
      suvPrice: '₹1,800',
      desc: 'Quick smooth ride to Pollachi town, Anamalai Tiger Reserve gate, and Topslip.',
      badge: 'ONEWAY DROP',
      isHill: false
    },
    {
      id: 'tirupur-drop',
      title: 'Coimbatore to Tirupur Cab',
      type: 'Oneway Drop Taxi',
      distance: '55 KM (1.2 Hours)',
      sedanPrice: '₹1,540',
      suvPrice: '₹2,200',
      desc: 'Fast industrial route drop for textile buyers and business commuters via Avinashi Road.',
      badge: 'EXPRESS ROUTE',
      isHill: false
    },
    {
      id: 'erode-drop',
      title: 'Coimbatore to Erode Cab',
      type: 'Oneway Drop Taxi',
      distance: '100 KM (2 Hours)',
      sedanPrice: '₹2,800',
      suvPrice: '₹3,800',
      desc: 'Direct highway trip from Coimbatore to Erode Junction Railway Station & Textile Market.',
      badge: 'FIXED FLAT RATE',
      isHill: false
    },
    {
      id: 'munnar-tour',
      title: 'Coimbatore to Munnar Cab',
      type: '2 Day / 3 Day Tour',
      distance: '160 KM (4.5 Hours)',
      sedanPrice: '₹4,800',
      suvPrice: '₹6,400',
      desc: 'Breathtaking trip through Udumalpet, Chinnar Wildlife Sanctuary, and Munnar Tea Gardens.',
      badge: 'BESTSELLER',
      isHill: true
    },
    {
      id: 'kodaikanal-tour',
      title: 'Coimbatore to Kodaikanal Cab',
      type: '2 Day Hill Package',
      distance: '175 KM (4.5 Hours)',
      sedanPrice: '₹5,100',
      suvPrice: '₹6,800',
      desc: 'Comfortable hill journey to Princess of Hill Stations via Palani Ghat Road.',
      badge: 'SCENIC ROUTE',
      isHill: true
    }
  ];

  // 2. DATA DEFINITIONS: Tour Packages
  const TOUR_PACKAGES_DATA = [
    {
      id: 'ooty-2day',
      category: 'ooty',
      title: 'Ooty & Coonoor 2-Day Complete Hill Tour',
      duration: '2 Days / 1 Night',
      distance: '85 KM to Ooty (3 Hours Drive)',
      img: './assets/images/dest-ooty.png',
      places: ['Botanical Gardens', 'Ooty Lake Boating', 'Doddabetta Peak', 'Coonoor Sim’s Park', 'Dolphin’s Nose', 'Tea Factory Tour'],
      sedanRate: '₹6,800',
      suvRate: '₹9,200',
      details: `
        <div class="tour-detail-modal-body">
          <h3>Ooty & Coonoor 2-Day Sightseeing Tour Itinerary</h3>
          <p>Experience the cool Nilgiri hills with our expert hill drivers. We pick you up directly from your doorstep, hotel, or Coimbatore Airport/Station.</p>
          <div class="tour-specs-grid">
            <div class="tour-spec-item"><span>Duration</span><span>2 Days / 1 Night</span></div>
            <div class="tour-spec-item"><span>Total Distance</span><span>85 KM (One Way)</span></div>
            <div class="tour-spec-item"><span>Vehicle Options</span><span>Dzire Sedan / Innova SUV</span></div>
            <div class="tour-spec-item"><span>Driver Batta</span><span>Included</span></div>
          </div>
          <h4>Key Attractions Covered:</h4>
          <ul>
            <li>Day 1: Mettupalayam Ghat Road, Doddabetta Peak view point, Botanical Garden, Ooty Lake sunset boating, overnight hotel stay.</li>
            <li>Day 2: Coonoor Sim’s Park, Lamb’s Rock, Dolphin’s Nose, Tea Factory demonstration, return drop to Coimbatore.</li>
          </ul>
        </div>
      `
    },
    {
      id: 'munnar-3day',
      category: 'munnar',
      title: 'Munnar Tea Hills 3-Day Kerala Paradise Tour',
      duration: '3 Days / 2 Nights',
      distance: '160 KM (4.5 Hours Drive)',
      img: './assets/images/blog-munnar-kodai.png',
      places: ['Mattupetty Dam', 'Eravikulam National Park', 'Tea Museum', 'Anamudi Peak View', 'Chinnar Wildlife Sanctuary'],
      sedanRate: '₹9,600',
      suvRate: '₹13,200',
      details: `
        <div class="tour-detail-modal-body">
          <h3>Munnar 3-Day Sightseeing Itinerary</h3>
          <p>Travel through lush green forests and tea plantations from Kovai to Munnar.</p>
          <div class="tour-specs-grid">
            <div class="tour-spec-item"><span>Duration</span><span>3 Days / 2 Nights</span></div>
            <div class="tour-spec-item"><span>Total Distance</span><span>160 KM (One Way)</span></div>
            <div class="tour-spec-item"><span>State Entry Permit</span><span>Kerala Toll Paid at Border</span></div>
          </div>
          <h4>Key Attractions Covered:</h4>
          <ul>
            <li>Day 1: Udumalpet route, Chinnar Wildlife Sanctuary, Lakkam Waterfalls, Munnar town check-in.</li>
            <li>Day 2: Eravikulam National Park (Nilgiri Tahr), Tea Museum, Mattupetty Dam boating, Echo Point.</li>
            <li>Day 3: Kundala Lake, Blossom Park, spice plantation tour, shopping, evening return drop to Coimbatore.</li>
          </ul>
        </div>
      `
    },
    {
      id: 'kodaikanal-2day',
      category: 'kodai',
      title: 'Kodaikanal Mist & Lake 2-Day Escape',
      duration: '2 Days / 1 Night',
      distance: '175 KM (4.5 Hours Drive)',
      img: './assets/images/dest-kodaikanal.png',
      places: ['Kodai Lake', 'Coaker’s Walk', 'Bryant Park', 'Pillar Rocks', 'Pine Forest', 'Silver Cascade Falls'],
      sedanRate: '₹7,400',
      suvRate: '₹9,800',
      details: `
        <div class="tour-detail-modal-body">
          <h3>Kodaikanal 2-Day Sightseeing Package</h3>
          <p>Enjoy the misty weather and tranquil pine forests of Kodaikanal.</p>
          <div class="tour-specs-grid">
            <div class="tour-spec-item"><span>Duration</span><span>2 Days / 1 Night</span></div>
            <div class="tour-spec-item"><span>Total Distance</span><span>175 KM (One Way)</span></div>
            <div class="tour-spec-item"><span>Hill Driving</span><span>Palani Ghat Section</span></div>
          </div>
          <h4>Key Attractions Covered:</h4>
          <ul>
            <li>Day 1: Palani view, Silver Cascade Waterfalls, hotel check-in, Kodai Lake evening boating, Coaker’s Walk sunset.</li>
            <li>Day 2: Pillar Rocks, Green Valley View, Pine Forest photography, Bryant Park, return drop to Kovai.</li>
          </ul>
        </div>
      `
    },
    {
      id: 'adiyogi-1day',
      category: 'spiritual',
      title: 'Adiyogi Shiva & Marudhamalai 1-Day Divine Trip',
      duration: '1 Full Day (10 Hours)',
      distance: '30 KM from City (45 Mins)',
      img: './assets/images/dest-adiyogi.png',
      places: ['Isha Adiyogi 112ft Statue', 'Dhyanalinga Meditation Hall', 'Marudhamalai Murugan Temple', 'Eachanari Vinayagar'],
      sedanRate: '₹2,200',
      suvRate: '₹3,100',
      details: `
        <div class="tour-detail-modal-body">
          <h3>Coimbatore Spiritual Tour Package</h3>
          <p>Visit the world-famous 112ft Adiyogi Shiva Statue at Velliangiri foothills along with ancient Kovai temples.</p>
          <div class="tour-specs-grid">
            <div class="tour-spec-item"><span>Duration</span><span>1 Day (Package)</span></div>
            <div class="tour-spec-item"><span>Distance</span><span>30 KM from City</span></div>
            <div class="tour-spec-item"><span>Laser Show</span><span>Includes 7:00 PM Light Show Waiting</span></div>
          </div>
        </div>
      `
    }
  ];

  // 3. DATA DEFINITIONS: Travel Blogs
  const BLOGS_DATA = {
    'coimbatore-to-ooty-cab-guide': {
      title: 'Coimbatore to Ooty Cab Guide: Route, 36 Hairpin Bends & Fare Breakdown (2026)',
      category: 'Hill Station Travel',
      date: 'August 2026',
      readTime: '5 min read',
      img: './assets/images/dest-ooty.png',
      content: `
        <div class="blog-full-article">
          <div class="blog-hero-header">
            <span class="blog-tag-badge">Hill Station Travel</span>
            <h1>Coimbatore to Ooty Cab Guide: Route, 36 Hairpin Bends & Fare Breakdown (2026)</h1>
            <div class="blog-meta-info">
              <span>📅 August 2026</span> • <span>⏱️ 5 min read</span> • <span>✍️ Get Cabs Editorial Team</span>
            </div>
          </div>

          <img src="./assets/images/dest-ooty.png" alt="Coimbatore to Ooty Cab Trip" class="blog-featured-img" />

          <h2>Planning a Road Trip from Coimbatore to Ooty?</h2>
          <p>The journey from Coimbatore to Ooty (Udhagamandalam) is one of South India's most scenic hill climbs. Covering approximately 85 kilometers, the drive takes about 3 hours via Mettupalayam, Coonoor, and the famous 36 Hairpin Bends of the Kallatty/Kotagiri routes.</p>

          <h3>Which Route Should You Take?</h3>
          <p><strong>Route 1: Via Mettupalayam - Coonoor - Ooty (Main NH 181)</strong><br>
          This is the smoothest and most popular route. Excellent road conditions, gentle inclines, and scenic tea estate views through Coonoor make it perfect for families.</p>

          <p><strong>Route 2: Via Mettupalayam - Kotagiri - Ooty</strong><br>
          Slightly longer by 15 KM, but features less traffic during peak weekend rush hours and passes through breathtaking Catherine Waterfalls views.</p>

          <h3>Cab Tariff & Billing Breakdown (2026)</h3>
          <div class="price-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Vehicle Type</th>
                  <th>Oneway Drop Tariff</th>
                  <th>Round Trip (Per Day)</th>
                  <th>Driver Allowance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sedan (Dzire/Etios)</td>
                  <td>₹2,680 (Flat Rate)</td>
                  <td>₹14 / KM (Min 250 KM)</td>
                  <td>₹400 / Day</td>
                </tr>
                <tr>
                  <td>SUV (Innova/Ertiga)</td>
                  <td>₹3,450 (Flat Rate)</td>
                  <td>₹18 / KM (Min 250 KM)</td>
                  <td>₹400 / Day</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Essential Tips for Traveling to Ooty in 2026:</h3>
          <ul>
            <li><strong>e-Pass Requirement:</strong> Ensure your driver has a valid Tamil Nadu e-Pass for Nilgiris district entry. Get Cabs drivers come pre-verified with all legal hill entry permits.</li>
            <li><strong>Best Time to Drive:</strong> Early morning between 5:30 AM and 7:00 AM allows you to avoid heavy tourist buses on Mettupalayam Ghat Road.</li>
            <li><strong>Warm Clothing:</strong> Even in summer, Ooty evenings drop to 12°C - 15°C. Carry a light jacket!</li>
          </ul>

          <div class="blog-cta-banner">
            <h3>Need a Reliable Cab to Ooty?</h3>
            <p>Book your hatchback, sedan, or Innova SUV with Get Cabs in 1 click. Professional hill station drivers guaranteed.</p>
            <a href="tel:9894020156" class="btn btn-yellow">📞 Call 9894020156 to Reserve Cab</a>
          </div>
        </div>
      `
    },
    'coimbatore-airport-cab-hacks': {
      title: 'Coimbatore Airport (CJB) Cab Hacks: Save Time & Money on Airport Drops',
      category: 'Airport Travel',
      date: 'August 2026',
      readTime: '4 min read',
      img: './assets/images/blog-munnar-kodai.png',
      content: `
        <div class="blog-full-article">
          <div class="blog-hero-header">
            <span class="blog-tag-badge">Airport Travel</span>
            <h1>Coimbatore Airport (CJB) Cab Hacks: Save Time & Money on Airport Drops</h1>
            <div class="blog-meta-info">
              <span>📅 August 2026</span> • <span>⏱️ 4 min read</span> • <span>✍️ Get Cabs Editorial Team</span>
            </div>
          </div>

          <img src="./assets/images/blog-munnar-kodai.png" alt="Coimbatore Airport Cabs" class="blog-featured-img" />

          <h2>Navigating Coimbatore International Airport (CJB)</h2>
          <p>Coimbatore International Airport located at Peelamedu is the primary gateway to Western Tamil Nadu and Nilgiri hill resorts. Whether catching a 5:00 AM flight to Chennai/Mumbai or arriving late at night, booking a reliable airport cab is crucial.</p>

          <h3>3 Major Airport Taxi Mistakes to Avoid:</h3>
          <p><strong>1. Waiting for App Surge Multipliers:</strong> Apps like Uber or Ola frequently apply 1.5x to 2.2x surge pricing during early morning flight slots (4:00 AM - 6:30 AM). Get Cabs offers 100% fixed-rate drops from ₹250.</p>
          <p><strong>2. Unplanned Arrivals Pickup:</strong> Finding cabs outside CJB arrival gate during rain can lead to long waiting lines. Pre-book your Get Cabs driver to have them waiting with your name card at terminal exit.</p>

          <div class="blog-cta-banner">
            <h3>Catching a Flight Soon?</h3>
            <p>Pre-book your Coimbatore Airport pickup or drop with zero cancellation fees.</p>
            <a href="tel:9894020156" class="btn btn-yellow">📞 Call 9894020156 Airport Hotline</a>
          </div>
        </div>
      `
    }
  };

  // 4. FARE CALCULATOR ENGINE
  function calculateLocalFare() {
    const kmInput = document.getElementById('local-distance');
    const cabTypeSelect = document.getElementById('local-cab-type');
    const priceDisplay = document.getElementById('local-estimated-price');

    if (!kmInput || !priceDisplay) return;

    let km = parseFloat(kmInput.value) || 0;
    if (km <= 0) {
      priceDisplay.textContent = '₹110';
      return;
    }

    let baseFare = 110; // First 4 KM
    let perKmRate = 28;
    
    if (cabTypeSelect && cabTypeSelect.value === 'SUV') {
      baseFare = 160;
      perKmRate = 35;
    }

    let extraKm = Math.max(0, km - 4);
    let totalFare = baseFare + (extraKm * perKmRate);

    priceDisplay.textContent = '₹' + Math.round(totalFare).toLocaleString('en-IN');
  }

  function calculateOnewayFare() {
    const destSelect = document.getElementById('oneway-dest-select');
    const kmInput = document.getElementById('oneway-distance');
    const cabSelect = document.getElementById('oneway-cab-type');
    const priceDisplay = document.getElementById('oneway-estimated-price');
    const ruleLabel = document.getElementById('oneway-rule-label');

    if (!kmInput || !priceDisplay) return;

    let km = parseFloat(kmInput.value) || 85;
    let cab = cabSelect ? cabSelect.value : 'Sedan';
    let isHill = (destSelect && (destSelect.value === 'Ooty' || destSelect.value === 'Munnar' || destSelect.value === 'Kodaikanal'));

    let ratePerKm = (cab === 'SUV') ? 36 : 28;
    let driverBatta = isHill ? 500 : 300;

    let totalFare = (km * ratePerKm) + driverBatta;

    if (ruleLabel) {
      ruleLabel.textContent = `₹${ratePerKm}/KM + ₹${driverBatta} Batta`;
    }

    priceDisplay.textContent = '₹' + Math.round(totalFare).toLocaleString('en-IN');
  }

  function calculateOutstationFare() {
    const daysInput = document.getElementById('outstation-days');
    const kmInput = document.getElementById('outstation-distance');
    const cabSelect = document.getElementById('outstation-cab-type');
    const hillSelect = document.getElementById('outstation-is-hills');
    const priceDisplay = document.getElementById('outstation-estimated-price');
    const rateLabel = document.getElementById('outstation-rate-label');
    const battaLabel = document.getElementById('outstation-batta-label');

    if (!kmInput || !priceDisplay) return;

    let days = parseInt(daysInput.value) || 1;
    let km = parseFloat(kmInput.value) || 250;
    let cab = cabSelect ? cabSelect.value : 'Sedan';
    let isHill = hillSelect && hillSelect.value === 'yes';

    // Minimum 250 KM per day rule
    let minKmRequired = days * 250;
    let billableKm = Math.max(km, minKmRequired);

    let perKmRate = 14;
    let driverBattaPerDay = 400;

    if (cab === 'SUV') {
      perKmRate = 18;
      driverBattaPerDay = 500;
    } else if (cab === 'Tempo') {
      perKmRate = 24;
      driverBattaPerDay = 600;
    }

    if (isHill) {
      driverBattaPerDay += 100;
    }

    let totalKmFare = billableKm * perKmRate;
    let totalBatta = days * driverBattaPerDay;
    let grandTotal = totalKmFare + totalBatta;

    if (rateLabel) rateLabel.textContent = `₹${perKmRate} / KM (Min ${minKmRequired} KM for ${days} Days)`;
    if (battaLabel) battaLabel.textContent = `₹${driverBattaPerDay} / Day`;

    priceDisplay.textContent = '₹' + Math.round(grandTotal).toLocaleString('en-IN');
  }

  // Auto-sync distance when user selects a preset destination in Oneway
  const destSelect = document.getElementById('oneway-dest-select');
  const onewayDistInput = document.getElementById('oneway-distance');
  if (destSelect && onewayDistInput) {
    destSelect.addEventListener('change', () => {
      const selectedOpt = destSelect.options[destSelect.selectedIndex];
      const presetKm = selectedOpt.getAttribute('data-km');
      if (presetKm) {
        onewayDistInput.value = presetKm;
        calculateOnewayFare();
      }
    });
  }

  // Bind live calculation listeners
  const inputsToBind = [
    'local-distance', 'local-cab-type',
    'oneway-pickup', 'oneway-distance', 'oneway-dest-select', 'oneway-cab-type',
    'outstation-pickup', 'outstation-drop', 'outstation-distance', 'outstation-is-hills', 'outstation-cab-type',
    'outstation-days'
  ];

  inputsToBind.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        calculateLocalFare();
        calculateOnewayFare();
        calculateOutstationFare();
      });
      el.addEventListener('change', () => {
        calculateLocalFare();
        calculateOnewayFare();
        calculateOutstationFare();
      });
    }
  });

  // Run initial calculations on load
  calculateLocalFare();
  calculateOnewayFare();
  calculateOutstationFare();

  // 5. BOOKING FORM TAB SWITCHING
  const tabs = document.querySelectorAll('.booking-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');
      document.getElementById('form-local').style.display = (targetTab === 'local') ? 'block' : 'none';
      document.getElementById('form-oneway').style.display = (targetTab === 'oneway') ? 'block' : 'none';
      document.getElementById('form-outstation').style.display = (targetTab === 'outstation') ? 'block' : 'none';
    });
  });

  // 6. FORM SUBMISSION DISPATCH (Calls / WhatsApp Integration)
  window.handleFormSubmit = function(event, formType) {
    event.preventDefault();

    let name = '', phone = '', pickup = '', drop = '', dist = '', cab = '', price = '';

    if (formType === 'local') {
      name = document.getElementById('local-name')?.value;
      phone = document.getElementById('local-phone')?.value;
      pickup = document.getElementById('local-pickup')?.value;
      drop = document.getElementById('local-drop')?.value;
      dist = document.getElementById('local-distance')?.value;
      cab = document.getElementById('local-cab-type')?.value;
      price = document.getElementById('local-estimated-price')?.textContent;
    } else if (formType === 'oneway') {
      name = document.getElementById('oneway-name')?.value;
      phone = document.getElementById('oneway-phone')?.value;
      pickup = document.getElementById('oneway-pickup')?.value;
      drop = document.getElementById('oneway-dest-select')?.value;
      dist = document.getElementById('oneway-distance')?.value;
      cab = document.getElementById('oneway-cab-type')?.value;
      price = document.getElementById('oneway-estimated-price')?.textContent;
    } else if (formType === 'outstation') {
      name = document.getElementById('outstation-name')?.value;
      phone = document.getElementById('outstation-phone')?.value;
      pickup = document.getElementById('outstation-pickup')?.value;
      drop = document.getElementById('outstation-drop')?.value;
      dist = document.getElementById('outstation-distance')?.value;
      cab = document.getElementById('outstation-cab-type')?.value;
      price = document.getElementById('outstation-estimated-price')?.textContent;
    }

    const message = `🚕 *GET CABS COIMBATORE BOOKING REQUEST*%0A%0A` +
      `👤 *Name:* ${name}%0A` +
      `📱 *Phone:* ${phone}%0A` +
      `📍 *Pickup:* ${pickup}%0A` +
      `🏁 *Drop:* ${drop}%0A` +
      `📏 *Distance:* ${dist} KM%0A` +
      `🚘 *Cab Type:* ${cab}%0A` +
      `💰 *Estimated Tariff:* ${price}%0A%0A` +
      `Please dispatch cab or confirm availability!`;

    const waUrl = `https://wa.me/919894020156?text=${message}`;

    // Prompt user choice or open WhatsApp
    if (confirm(`Thank you ${name}! Would you like to send this booking directly via WhatsApp to 9894020156 for immediate confirmation?`)) {
      window.open(waUrl, '_blank');
    } else {
      window.location.href = 'tel:9894020156';
    }
  };

  // 7. DYNAMIC RENDERERS: Render Outstation Packages
  const pkgContainer = document.getElementById('packages-container');
  if (pkgContainer) {
    pkgContainer.innerHTML = OUTSTATION_PACKAGES.map(p => `
      <div class="package-card reveal">
        <div class="package-badge">${p.badge}</div>
        <h3 class="package-title">${p.title}</h3>
        <div class="package-tagline">📍 ${p.distance}</div>
        <p class="package-desc">${p.desc}</p>
        <div class="package-pricing-grid">
          <div class="price-col">
            <span class="price-label">Dzire Sedan</span>
            <span class="price-val">${p.sedanPrice}</span>
          </div>
          <div class="price-col">
            <span class="price-label">Innova SUV</span>
            <span class="price-val">${p.suvPrice}</span>
          </div>
        </div>
        <a href="tel:9894020156" class="btn btn-outline-sm" style="width:100%; text-align:center; justify-content:center;">
          📞 Book ${p.title}
        </a>
      </div>
    `).join('');
  }

  // 8. ROUTING & PAGE NAVIGATION ENGINE
  const pageViews = document.querySelectorAll('.page-view');
  const navLinks = document.querySelectorAll('[data-open-page]');

  function navigateToPage(pageName) {
    pageViews.forEach(view => {
      view.style.display = 'none';
      view.classList.remove('active');
    });

    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
      targetPage.style.display = 'block';
      targetPage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav items
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll(`[data-open-page="${pageName}"]`).forEach(item => item.classList.add('active'));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-open-page');
      if (page) navigateToPage(page);
    });
  });

  // Handle Home Blogs Grid Render
  const homeBlogsGrid = document.getElementById('home-blogs-grid');
  if (homeBlogsGrid) {
    const blogKeys = Object.keys(BLOGS_DATA);
    homeBlogsGrid.innerHTML = blogKeys.map(key => {
      const b = BLOGS_DATA[key];
      return `
        <article class="blog-card reveal" data-open-blog="${key}">
          <div class="blog-img-box">
            <img src="${b.img}" alt="${b.title}" />
            <span class="blog-tag-badge">${b.category}</span>
          </div>
          <div class="blog-content-box">
            <div class="blog-meta-info">
              <span>📅 ${b.date}</span> • <span>⏱️ ${b.readTime}</span>
            </div>
            <h3 class="blog-card-title">${b.title}</h3>
            <div class="blog-read-btn">
              <span>Read Full Article</span> <span>→</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Handle Blog Reading Click
  document.addEventListener('click', (e) => {
    const blogCard = e.target.closest('[data-open-blog]');
    if (blogCard) {
      const blogKey = blogCard.getAttribute('data-open-blog');
      const blogData = BLOGS_DATA[blogKey];
      if (blogData) {
        const container = document.getElementById('single-blog-content');
        if (container) {
          container.innerHTML = blogData.content;
          navigateToPage('blog-single');
        }
      }
    }
  });

  // Render Tour Packages Page Cards
  const tourContainer = document.getElementById('tour-packages-container');
  if (tourContainer) {
    function renderTours(filterCategory = 'all') {
      const filtered = filterCategory === 'all' 
        ? TOUR_PACKAGES_DATA 
        : TOUR_PACKAGES_DATA.filter(t => t.category === filterCategory);

      tourContainer.innerHTML = filtered.map(t => `
        <div class="tour-card">
          <div class="tour-img-wrap">
            <img src="${t.img}" alt="${t.title}" />
            <span class="tour-duration-badge">${t.duration}</span>
          </div>
          <div class="tour-card-body">
            <h3>${t.title}</h3>
            <p class="tour-distance">📍 ${t.distance}</p>
            <div class="tour-places-list">
              ${t.places.map(p => `<span class="place-tag">✓ ${p}</span>`).join('')}
            </div>
            <div class="tour-card-pricing">
              <div><span>Sedan:</span> <strong>${t.sedanRate}</strong></div>
              <div><span>Innova SUV:</span> <strong>${t.suvRate}</strong></div>
            </div>
            <a href="tel:9894020156" class="btn btn-red-sm" style="width:100%; text-align:center; justify-content:center; margin-top:12px;">
              📞 Book Tour Package
            </a>
          </div>
        </div>
      `).join('');
    }

    renderTours('all');

    // Filter Buttons
    document.querySelectorAll('.tour-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tour-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');
        renderTours(cat);
      });
    });
  }

  // Render Tariff Details Page
  const tariffWrap = document.getElementById('tariff-details-wrap');
  if (tariffWrap) {
    tariffWrap.innerHTML = `
      <div class="tariff-card-box">
        <h3>1. Local City Call Taxi Tariffs</h3>
        <table class="tariff-table">
          <thead>
            <tr>
              <th>Cab Category</th>
              <th>Base Fare (First 4 KM)</th>
              <th>Additional Rate / KM</th>
              <th>Night Surge</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hatchback / Indica</td>
              <td>₹110</td>
              <td>₹28 / KM</td>
              <td>₹0 (Zero Surge)</td>
            </tr>
            <tr>
              <td>Dzire / Etios Sedan</td>
              <td>₹110</td>
              <td>₹28 / KM</td>
              <td>₹0 (Zero Surge)</td>
            </tr>
            <tr>
              <td>Innova SUV (7 Seater)</td>
              <td>₹160</td>
              <td>₹35 / KM</td>
              <td>₹0 (Zero Surge)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tariff-card-box" style="margin-top:28px;">
        <h3>2. Outstation Round Trip Tariffs</h3>
        <table class="tariff-table">
          <thead>
            <tr>
              <th>Vehicle Class</th>
              <th>Rate Per KM</th>
              <th>Min Coverage / Day</th>
              <th>Driver Daily Batta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Executive Sedan</td>
              <td>₹14 / KM</td>
              <td>250 KM</td>
              <td>₹400 / Day</td>
            </tr>
            <tr>
              <td>Innova SUV (7 Seater)</td>
              <td>₹18 / KM</td>
              <td>250 KM</td>
              <td>₹500 / Day</td>
            </tr>
            <tr>
              <td>Tempo Traveller (12 Seater)</td>
              <td>₹24 / KM</td>
              <td>300 KM</td>
              <td>₹600 / Day</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  // 9. FAQ ACCORDION ENGINE
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const head = card.querySelector('.faq-head');
    if (head) {
      head.addEventListener('click', () => {
        const isActive = card.classList.contains('active');
        faqCards.forEach(c => c.classList.remove('active'));
        if (!isActive) card.classList.add('active');
      });
    }
  });

  // 10. MOBILE NAVBAR TOGGLE
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksMenu = document.getElementById('nav-links');
  if (mobileToggle && navLinksMenu) {
    mobileToggle.addEventListener('click', () => {
      navLinksMenu.classList.toggle('active');
      mobileToggle.classList.toggle('open');
    });
  }

  // 11. GEMINI AI CHATBOT INTEGRATION ENGINE
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages');

  if (chatToggleBtn && chatWindow) {
    chatToggleBtn.addEventListener('click', () => {
      chatWindow.style.display = (chatWindow.style.display === 'none' || !chatWindow.style.display) ? 'flex' : 'none';
    });
  }

  if (chatCloseBtn && chatWindow) {
    chatCloseBtn.addEventListener('click', () => {
      chatWindow.style.display = 'none';
    });
  }

  window.sendAiQuery = function(queryText) {
    if (chatWindow && (chatWindow.style.display === 'none' || !chatWindow.style.display)) {
      chatWindow.style.display = 'flex';
    }
    appendUserMessage(queryText);
    fetchGeminiAiResponse(queryText);
  };

  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', () => {
      const q = chatInput.value.trim();
      if (q) {
        appendUserMessage(q);
        chatInput.value = '';
        fetchGeminiAiResponse(q);
      }
    });

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = chatInput.value.trim();
        if (q) {
          appendUserMessage(q);
          chatInput.value = '';
          fetchGeminiAiResponse(q);
        }
      }
    });
  }

  function appendUserMessage(text) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg user';
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function fetchGeminiAiResponse(queryText) {
    if (!chatMessages) return;

    // Loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-msg bot loading';
    loadingDiv.innerHTML = `<span>🤖 Searching live grounding sources...</span>`;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Send query to Express /api/gemini-grounding endpoint
    fetch('/api/gemini-grounding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: queryText })
    })
    .then(res => res.json())
    .then(data => {
      loadingDiv.remove();
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg bot';

      let botHtml = data.reply || "I am glad to assist! Call 9894020156 for instant booking.";

      // Append Google Search Grounding Sources if present
      if (data.groundingSources && data.groundingSources.length > 0) {
        botHtml += `<br><br><div class="grounding-sources-box" style="margin-top:8px; font-size:0.8rem; border-top:1px solid #cbd5e1; padding-top:6px;">`;
        botHtml += `🔍 <strong style="color:var(--brand-yellow, #f59e0b);">Sources from Google Search:</strong><br>`;
        data.groundingSources.forEach(src => {
          botHtml += `• <a href="${src.url}" target="_blank" rel="noopener" style="color:#d90429; text-decoration:underline;">${src.title}</a><br>`;
        });
        botHtml += `</div>`;
      }

      botDiv.innerHTML = botHtml;
      chatMessages.appendChild(botDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch(() => {
      loadingDiv.remove();
      const errDiv = document.createElement('div');
      errDiv.className = 'chat-msg bot';
      errDiv.innerHTML = `For instant assistance, call our 24/7 hotline at <a href="tel:9894020156" style="color:#d90429; font-weight:bold;">9894020156</a>.`;
      chatMessages.appendChild(errDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  // 12. SCROLL REVEAL ANIMATIONS
  function checkReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight - 60) {
        el.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', checkReveal);
  checkReveal();

  // 13. Image Fallback Handling
  window.handleImgError = function(imgEl, fallbackText) {
    if (!imgEl) return;
    imgEl.onerror = null; // Prevent infinite loop
    imgEl.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';
  };

  // 14. OpenStreetMap / Nominatim Address Autocomplete Engine (100% Free, No API Key Required)
  function initAddressAutocomplete() {
    const selector = '#local-pickup, #local-drop, #oneway-pickup, #outstation-pickup, #outstation-drop, [data-field="pickup"], [data-field="drop"]';
    const inputs = document.querySelectorAll(selector);

    const LOCAL_SUGGESTIONS = [
      "Gandhipuram, Coimbatore",
      "RS Puram, Coimbatore",
      "Peelamedu, Coimbatore",
      "Saravanampatti, Coimbatore",
      "Coimbatore International Airport (CJB)",
      "Coimbatore Junction Railway Station",
      "Ukkadam Bus Stand, Coimbatore",
      "Singanallur, Coimbatore",
      "Eachanari, Coimbatore",
      "Brookefields Mall, RS Puram",
      "Prozone Mall, Saravanampatti",
      "Isha Yoga Center, Velliangiri Foothills",
      "Marudhamalai Temple, Coimbatore",
      "Mettupalayam, Coimbatore",
      "Ooty (Udhagamandalam)",
      "Pollachi, Tamil Nadu",
      "Tirupur Town, Tamil Nadu",
      "Erode, Tamil Nadu",
      "Palani, Tamil Nadu",
      "Valparai, Tamil Nadu",
      "Munnar, Kerala",
      "Kodaikanal, Tamil Nadu"
    ];

    inputs.forEach(input => {
      if (!input || input.dataset.autocompleteBound) return;
      input.dataset.autocompleteBound = "true";

      const wrapper = document.createElement('div');
      wrapper.className = 'autocomplete-wrapper';
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';

      if (input.parentNode) {
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
      }

      const listContainer = document.createElement('div');
      listContainer.className = 'autocomplete-dropdown';
      listContainer.style.cssText = 'position:absolute; top:100%; left:0; right:0; background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.15); z-index:1000; max-height:220px; overflow-y:auto; display:none; margin-top:4px;';
      wrapper.appendChild(listContainer);

      let debounceTimer;

      input.addEventListener('input', function() {
        const query = this.value.trim();
        clearTimeout(debounceTimer);

        if (query.length < 2) {
          listContainer.style.display = 'none';
          listContainer.innerHTML = '';
          return;
        }

        const matchedLocal = LOCAL_SUGGESTIONS.filter(item =>
          item.toLowerCase().includes(query.toLowerCase())
        );

        renderSuggestions(matchedLocal);

        debounceTimer = setTimeout(() => {
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Tamil Nadu')}&addressdetails=1&limit=5&countrycodes=in`)
            .then(res => res.json())
            .then(data => {
              if (data && data.length > 0) {
                const apiNames = data.map(item => {
                  const parts = item.display_name.split(',');
                  return parts.slice(0, 3).join(',').trim();
                });
                const combined = Array.from(new Set([...matchedLocal, ...apiNames]));
                renderSuggestions(combined);
              }
            })
            .catch(() => {});
        }, 300);
      });

      function renderSuggestions(items) {
        if (!items || items.length === 0) {
          listContainer.style.display = 'none';
          listContainer.innerHTML = '';
          return;
        }

        listContainer.innerHTML = items.slice(0, 6).map(item => `
          <div class="autocomplete-item" style="padding:10px 14px; cursor:pointer; font-size:0.88rem; color:#1e293b; border-bottom:1px solid #f1f5f9;">
            📍 <strong>${item}</strong>
          </div>
        `).join('');

        listContainer.style.display = 'block';

        const itemEls = listContainer.querySelectorAll('.autocomplete-item');
        itemEls.forEach((el, idx) => {
          el.addEventListener('click', function(e) {
            e.stopPropagation();
            input.value = items[idx];
            listContainer.style.display = 'none';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          });
        });
      }

      document.addEventListener('click', function(e) {
        if (!wrapper.contains(e.target)) {
          listContainer.style.display = 'none';
        }
      });
    });
  }

  // Initialize Autocomplete
  initAddressAutocomplete();

});
