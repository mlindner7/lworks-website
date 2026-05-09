// =============================================
// LWORKS CONFIG
// =============================================
const CONFIG = {
  emailjs: {
    publicKey: 'ojcDVPCld5mc6jCXf',
    serviceId: 'service_6ethcqb',
    templateId: 'template_xzp8oj7'
  },
  calendly: {
    base: 'https://calendly.com/mlindner7-lworksservices/',
    routes: {
      exterior: 'exterior-cleaning-services',
      lawn: 'lawn-care-services',
      auto: 'auto-service-appointment',
      additional: 'additional-services',
      multi: 'multi-service-appointment'
    }
  },
  facebook: 'https://www.facebook.com/profile.php?id=61588819520954'
};

// =============================================
// SERVICE CATALOG — granular items with pricing
// =============================================
const SERVICES = {
  exterior: {
    label: 'Exterior Cleaning',
    icon: 'window',
    color: '#29a9e0',
    items: [
      { id: 'win', name: 'Window Cleaning', desc: 'Exterior glass, frames & sills', low: { sm:80, md:120, lg:180, xl:280 }, high: { sm:140, md:200, lg:300, xl:420 } },
      { id: 'scr', name: 'Screen Cleaning', desc: 'All screens removed, washed, reinstalled', low: { sm:40, md:60, lg:90, xl:130 }, high: { sm:70, md:100, lg:150, xl:200 } },
      { id: 'gut', name: 'Gutter Cleaning', desc: 'Clear debris, flush downspouts', low: { sm:80, md:120, lg:180, xl:260 }, high: { sm:140, md:200, lg:300, xl:400 } },
      { id: 'prs', name: 'Pressure Washing', desc: 'Driveway, siding, deck, patio', low: { sm:80, md:140, lg:220, xl:340 }, high: { sm:150, md:250, lg:380, xl:580 } }
    ]
  },
  lawn: {
    label: 'Lawn Care',
    icon: '🌿',
    items: [
      { id: 'mow', name: 'Mowing (Trim & Blow)', desc: 'Full mow, edge trim, blowout', low: { sm:40, md:60, lg:90, xl:140 }, high: { sm:70, md:110, lg:160, xl:240 } },
      { id: 'prn', name: 'Pruning & Tree Trimming', desc: 'Shrubs, hedges, small trees', low: { sm:60, md:100, lg:160, xl:240 }, high: { sm:120, md:200, lg:320, xl:480 } },
      { id: 'cln', name: 'Property Cleanup', desc: 'Leaf removal, debris hauling', low: { sm:60, md:100, lg:160, xl:260 }, high: { sm:120, md:200, lg:320, xl:480 } },
      { id: 'wat', name: 'Plant Watering', desc: 'Garden beds, containers, planters', low: { sm:30, md:50, lg:70, xl:100 }, high: { sm:60, md:90, lg:130, xl:180 } }
    ]
  },
  auto: {
    label: 'Auto Services',
    icon: '🔧',
    items: [
      { id: 'oil', name: 'Oil Change', desc: 'Done in your driveway · parts cost billed separately — not included in estimate', low: { sm:60, md:60, lg:60, xl:60 }, high: { sm:110, md:110, lg:110, xl:110 } },
      { id: 'brk', name: 'Disc Brake Service', desc: 'Done in your driveway · parts cost billed separately — not included in estimate', low: { sm:120, md:120, lg:120, xl:120 }, high: { sm:280, md:280, lg:280, xl:280 } },
      { id: 'det', name: 'Light Interior Detailing', desc: 'Vacuum, wipe-down, interior windows & mats', low: { sm:80, md:100, lg:100, xl:100 }, high: { sm:180, md:200, lg:200, xl:200 } }
    ]
  },
  additional: {
    label: 'Additional Services',
    icon: '⚡',
    items: [
      { id: 'carp', name: 'Carpet Cleaning', desc: 'Interior rooms, quoted by sq ft', low: { sm:60, md:100, lg:160, xl:260 }, high: { sm:130, md:220, lg:360, xl:560 } },
      { id: 'haul', name: 'Local Hauling', desc: 'Junk removal, furniture, debris', low: { sm:75, md:100, lg:140, xl:200 }, high: { sm:150, md:220, lg:320, xl:500 } },
      { id: 'seas', name: 'Seasonal / Winter Services', desc: 'Snow removal, seasonal prep & cleanup', low: { sm:60, md:80, lg:120, xl:180 }, high: { sm:130, md:180, lg:280, xl:420 } },
      { id: 'other', name: 'Other / Custom Request', desc: 'Describe what you need — we\'ll include it in your estimate', low: { sm:50, md:50, lg:50, xl:50 }, high: { sm:50, md:50, lg:50, xl:50 }, custom: true }
    ]
  }
};

// =============================================
// STATE
// =============================================
let selectedItems = {}; // { itemId: { catKey, item } }
let propSize = 'md';
let propType = 'single';
let userData = {};

// =============================================
// NAV
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  if (hamburger && links) {
    hamburger.addEventListener('click', () => links.classList.toggle('open'));
    document.querySelectorAll('#navLinks a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // Build estimate tool
  buildCategoryBlocks();
});

// =============================================
// ESTIMATE TOOL — STEP NAVIGATION
// =============================================
function goStep(n) {
  document.querySelectorAll('.sp').forEach((p, i) => p.classList.toggle('active', i + 1 === n));
  ['si1','si2','si3','si4'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('done','active','inactive');
    if (i + 1 < n) el.classList.add('done');
    else if (i + 1 === n) el.classList.add('active');
    else el.classList.add('inactive');
  });
  ['ln1','ln2','ln3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.style.background = i + 1 < n ? '#2db54b' : '#e8ecf4';
  });
  window.scrollTo({ top: document.getElementById('estimate').offsetTop - 80, behavior: 'smooth' });
}

// =============================================
// STEP 1 — Collect user info
// =============================================
function nextStep1() {
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const address = document.getElementById('faddress').value.trim();

  if (!fname || !lname || !email || !address) {
    alert('Please fill in your name, email, and service address to continue.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  userData = {
    firstName: fname,
    lastName: lname,
    email: email,
    phone: document.getElementById('fphone').value.trim(),
    address: address,
    contactPref: document.getElementById('fcontactpref') ? document.getElementById('fcontactpref').value : 'No preference'
  };
  goStep(2);
}

// =============================================
// STEP 2 — Build category blocks dynamically
// =============================================
function buildCategoryBlocks() {
  const container = document.getElementById('catContainer');
  if (!container) return;

  Object.entries(SERVICES).forEach(([catKey, cat]) => {
    const block = document.createElement('div');
    block.className = 'cat-block';
    block.id = `cat-${catKey}`;

    const iconHTML = cat.icon === 'window'
      ? `<svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="28" height="28" rx="3" stroke="#29a9e0" stroke-width="2.5"/>
          <line x1="16" y1="2" x2="16" y2="30" stroke="#29a9e0" stroke-width="2"/>
          <line x1="2" y1="16" x2="30" y2="16" stroke="#29a9e0" stroke-width="2"/>
          <path d="M9,9 L10.5,5.5 L12,9 L15.5,10.5 L12,12 L10.5,15.5 L9,12 L5.5,10.5 Z" fill="#29a9e0"/>
        </svg>`
      : `<span style="font-size:20px">${cat.icon}</span>`;

    block.innerHTML = `
      <div class="cat-header" onclick="toggleCat('${catKey}')">
        <div class="cat-icon">${iconHTML}</div>
        <div class="cat-title">
          <strong>${cat.label}</strong>
          <span>${cat.items.length} services available</span>
        </div>
        <span class="cat-sel-count" id="count-${catKey}">0 selected</span>
        <div class="cat-toggle">▼</div>
      </div>
      <div class="cat-items" id="items-${catKey}">
        ${cat.items.map(item => `
          <div class="item-row" id="row-${item.id}" onclick="toggleItem('${catKey}','${item.id}')">
            <div class="item-cb" id="cb-${item.id}"></div>
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-desc">${item.desc}</div>
              ${item.custom ? `<textarea id="custom-desc" onclick="event.stopPropagation()" placeholder="Briefly describe what you need…" style="margin-top:8px;width:100%;background:#f8f9fc;border:1.5px solid #d1d9e6;border-radius:8px;padding:8px 10px;font-size:12px;font-family:var(--fn);resize:vertical;min-height:52px;" rows="2"></textarea>` : ''}
            </div>
            <div class="item-price">${item.custom ? 'Custom' : 'from $' + item.low.md}</div>
          </div>
        `).join('')}
      </div>`;

    container.appendChild(block);
  });
}

function toggleCat(catKey) {
  const block = document.getElementById(`cat-${catKey}`);
  block.classList.toggle('open');
}

function toggleItem(catKey, itemId) {
  const row = document.getElementById(`row-${itemId}`);
  const isSelected = row.classList.contains('sel');

  if (isSelected) {
    row.classList.remove('sel');
    delete selectedItems[itemId];
  } else {
    row.classList.add('sel');
    const item = SERVICES[catKey].items.find(i => i.id === itemId);
    selectedItems[itemId] = { catKey, item };
  }

  // Update category count badge
  const catItems = Object.values(selectedItems).filter(v => v.catKey === catKey);
  const block = document.getElementById(`cat-${catKey}`);
  const countEl = document.getElementById(`count-${catKey}`);
  if (countEl) {
    countEl.textContent = `${catItems.length} selected`;
    block.classList.toggle('has-sel', catItems.length > 0);
  }

  // Bundle note
  const totalSelected = Object.keys(selectedItems).length;
  const catCount = new Set(Object.values(selectedItems).map(v => v.catKey)).size;
  const bn = document.getElementById('bn');
  if (bn) bn.style.display = catCount >= 2 ? 'flex' : 'none';

  // Summary
  updateSelSummary();
}

function updateSelSummary() {
  const total = Object.keys(selectedItems).length;
  const summaryEl = document.getElementById('selSummary');
  if (summaryEl) {
    summaryEl.innerHTML = total > 0
      ? `<strong>${total} service${total > 1 ? 's' : ''}</strong> selected`
      : 'Select at least one service below';
  }
}

function nextStep2() {
  if (Object.keys(selectedItems).length === 0) {
    alert('Please select at least one service to continue.');
    return;
  }
  goStep(3);
}

// =============================================
// STEP 3 — Property options
// =============================================
function selProp(el, group) {
  el.closest('.po').querySelectorAll('.popt').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  if (group === 'size') propSize = el.dataset.val;
  if (group === 'type') propType = el.dataset.val;
}

// =============================================
// STEP 4 — Build estimate
// =============================================
function buildEstimate() {
  const p4 = document.getElementById('p4');
  p4.innerHTML = `<div class="spin-wrap"><div class="spinner"></div><p style="color:var(--mid);font-size:13px;font-weight:600;margin-top:8px;">Building your estimate…</p></div>`;
  goStep(4);

  setTimeout(() => {
    const items = Object.values(selectedItems);
    const catGroups = {};
    let totalLow = 0, totalHigh = 0;
    const lineItems = [];

    items.forEach(({ catKey, item }) => {
      const lo = item.low[propSize] || item.low.md;
      const hi = item.high[propSize] || item.high.md;
      totalLow += lo;
      totalHigh += hi;
      if (!catGroups[catKey]) catGroups[catKey] = [];
      catGroups[catKey].push({ name: item.name, lo, hi });
      lineItems.push({ catKey, name: item.name, lo, hi });
    });

    // Bundle discount
    const catCount = Object.keys(catGroups).length;
    const itemCount = items.length;
    let discountLow = 0, discountHigh = 0;
    if (catCount >= 2 || itemCount >= 3) {
      const rate = catCount >= 3 ? 0.10 : 0.08;
      discountLow = Math.round(totalLow * rate);
      discountHigh = Math.round(totalHigh * rate);
      totalLow -= discountLow;
      totalHigh -= discountHigh;
    }

    // Size label
    const sizeLabels = { sm: 'Small lot (under ¼ acre)', md: 'Medium lot (¼–½ acre)', lg: 'Large lot (½–1 acre)', xl: 'Extra large (1+ acre)' };
    const typeLabels = { single: 'Single Family', multi: 'Multi-Family', condo: 'Condo/Townhome', commercial: 'Commercial' };

    // Build breakdown HTML
    const servicesText = items.map(i => i.item.name).join(', ');
    let breakdownRows = '';
    Object.entries(catGroups).forEach(([catKey, catItems]) => {
      breakdownRows += `<div class="ebd-cat">${SERVICES[catKey].label}</div>`;
      catItems.forEach(it => {
        breakdownRows += `<div class="el"><span class="el-name">${it.name}</span><span class="el-range">$${it.lo} – $${it.hi}</span></div>`;
      });
    });
    if (discountLow > 0) {
      breakdownRows += `<div class="el"><span class="el-name el-discount">🎉 Bundle & Save Discount</span><span class="el-range el-discount">-$${discountLow} – -$${discountHigh}</span></div>`;
    }
    breakdownRows += `<div class="el el-total"><span class="el-name">Estimated Total</span><span class="el-range">$${totalLow} – $${totalHigh}</span></div>`;

    // Calendly routing
    const cats = Object.keys(catGroups);
    let calendlyRoute = CONFIG.calendly.base;
    if (cats.length > 1) calendlyRoute += CONFIG.calendly.routes.multi;
    else calendlyRoute += CONFIG.calendly.routes[cats[0]] || CONFIG.calendly.routes.multi;

    // Custom request text
    const customDesc = document.getElementById('custom-desc');
    const customText = customDesc ? customDesc.value.trim() : '';

    p4.innerHTML = `
      <div class="result">
        <div class="chk">✓</div>
        <p style="color:var(--mid);font-size:13px;font-weight:600;margin-bottom:4px;">Your Estimate Range</p>
        <div class="er grad">$${totalLow} – $${totalHigh}</div>
        <p style="color:var(--mid);font-size:12px;margin-top:4px;">${items.length} service${items.length > 1 ? 's' : ''} · ${typeLabels[propType]} · ${sizeLabels[propSize]}</p>
        ${discountLow > 0 ? `<p style="color:#2db54b;font-size:12px;font-weight:700;margin-top:6px;">🎉 Bundle discount applied — you're saving $${discountLow}+</p>` : ''}

        <div class="est-breakdown">
          <div class="ebd-title">📋 Detailed Estimate Breakdown</div>
          ${breakdownRows}
        </div>

        <p class="en">This is a ballpark range — your final price may vary based on property condition and exact scope. We'll confirm everything before any work begins. <strong>No deposit required to book.</strong></p>

        <div class="ecta">
          <h3>Ready to pick your date?</h3>
          <p>How would you like us to reach you to confirm?</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;">
            <button type="button" class="contact-chip" data-val="No preference" onclick="selContactChip(this)" style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.35);border-radius:50px;color:#fff;font-family:var(--fn);font-size:12px;font-weight:700;padding:7px 16px;cursor:pointer;transition:all .15s;">No preference</button>
            <button type="button" class="contact-chip" data-val="Email" onclick="selContactChip(this)" style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.35);border-radius:50px;color:#fff;font-family:var(--fn);font-size:12px;font-weight:700;padding:7px 16px;cursor:pointer;transition:all .15s;">📧 Email</button>
            <button type="button" class="contact-chip" data-val="Phone / Text" onclick="selContactChip(this)" style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.35);border-radius:50px;color:#fff;font-family:var(--fn);font-size:12px;font-weight:700;padding:7px 16px;cursor:pointer;transition:all .15s;">📱 Phone / Text</button>
            <button type="button" class="contact-chip" data-val="Facebook Messenger" onclick="selContactChip(this)" style="background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.35);border-radius:50px;color:#fff;font-family:var(--fn);font-size:12px;font-weight:700;padding:7px 16px;cursor:pointer;transition:all .15s;">💬 Messenger</button>
          </div>
          <div class="ecta-btns">
            <button class="btn-white" id="acceptBtn" onclick="acceptEstimate('${calendlyRoute}', '${servicesText.replace(/'/g,"\\'")}', ${totalLow}, ${totalHigh}, ${discountLow}, ${discountHigh})">✅ Accept Estimate & Book</button>
          </div>
        </div>

        <div id="bookingUnlocked" style="display:none;background:rgba(45,181,75,.1);border:1px solid rgba(45,181,75,.3);border-radius:12px;padding:18px;margin-top:12px;text-align:center;">
          <p style="font-size:13px;font-weight:700;color:#2db54b;margin-bottom:12px;">✅ Estimate accepted — choose your date below!</p>
          <a href="${calendlyRoute}" target="_blank" rel="noopener" class="btn-primary">📅 Book My Appointment</a>
        </div>

        <button onclick="resetTool()" style="background:none;border:none;color:var(--mid);font-size:13px;font-weight:700;cursor:pointer;padding:10px;margin-top:4px;">← Start Over</button>
      </div>`;
  }, 1800);
}

// =============================================
// ACCEPT ESTIMATE — fires EmailJS, unlocks booking
// =============================================
function selContactChip(el) {
  document.querySelectorAll('.contact-chip').forEach(c => {
    c.style.background = 'rgba(255,255,255,.15)';
    c.style.borderColor = 'rgba(255,255,255,.35)';
    c.style.color = '#fff';
    c.removeAttribute('data-selected');
  });
  el.style.background = '#fff';
  el.style.borderColor = '#fff';
  el.style.color = '#5b2fc9';
  el.setAttribute('data-selected', 'true');
}

function acceptEstimate(calendlyRoute, servicesText, totalLow, totalHigh, discountLow, discountHigh) {
  const btn = document.getElementById('acceptBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  const sizeLabels = { sm: 'Small lot (under ¼ acre)', md: 'Medium lot (¼–½ acre)', lg: 'Large lot (½–1 acre)', xl: 'Extra large (1+ acre)' };
  const typeLabels = { single: 'Single Family', multi: 'Multi-Family', condo: 'Condo/Townhome', commercial: 'Commercial' };
  const customDesc = document.getElementById('custom-desc');
  const customText = customDesc ? customDesc.value.trim() : '';

  try {
    emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
      from_name: `${userData.firstName} ${userData.lastName}`,
      from_email: userData.email,
      phone: userData.phone || 'Not provided',
      address: userData.address,
      services: servicesText + (customText ? ` | Custom: ${customText}` : ''),
      property_size: sizeLabels[propSize],
      property_type: typeLabels[propType],
      estimate_low: totalLow,
      estimate_high: totalHigh,
      bundle_discount: discountLow > 0 ? `$${discountLow}–$${discountHigh}` : 'None',
      contact_preference: (document.querySelector('.contact-chip[data-selected]') || {}).dataset?.val || userData.contactPref || 'No preference'
    });
  } catch (e) {
    console.error('EmailJS error:', e);
  }

  if (btn) btn.closest('.ecta').style.display = 'none';
  const unlocked = document.getElementById('bookingUnlocked');
  if (unlocked) unlocked.style.display = 'block';
}

// =============================================
// RESET
// =============================================
function resetTool() {
  selectedItems = {};
  propSize = 'md';
  propType = 'single';
  userData = {};

  // Clear form
  ['fname','lname','femail','fphone','faddress'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Reset service rows
  document.querySelectorAll('.item-row').forEach(r => r.classList.remove('sel'));
  document.querySelectorAll('.cat-block').forEach(b => {
    b.classList.remove('has-sel','open');
  });
  document.querySelectorAll('.cat-sel-count').forEach(el => el.textContent = '0 selected');

  // Reset property
  document.querySelector('.popt[data-val="md"]')?.classList.add('sel');
  document.querySelector('.popt[data-val="single"]')?.classList.add('sel');
  document.querySelectorAll('.popt:not([data-val="md"]):not([data-val="single"])').forEach(el => el.classList.remove('sel'));

  const bn = document.getElementById('bn');
  if (bn) bn.style.display = 'none';

  goStep(1);
}

// =============================================
// PHOTO UPLOAD
// =============================================
function handlePhotoUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const preview = document.getElementById('photoPreview');
  const thumb = document.getElementById('photoThumb');
  const label = document.getElementById('photoLabel');

  const reader = new FileReader();
  reader.onload = e => {
    thumb.src = e.target.result;
    preview.style.display = 'block';
    label.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function clearPhoto() {
  document.getElementById('fphoto').value = '';
  document.getElementById('photoPreview').style.display = 'none';
  document.getElementById('photoLabel').style.display = 'flex';
  document.getElementById('photoThumb').src = '';
}
