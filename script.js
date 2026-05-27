document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────────
       1. CUSTOM CURSOR
    ───────────────────────────────────────────── */
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const mouseGlow  = document.getElementById('mouse-glow');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left  = mouseX + 'px';
      cursorDot.style.top   = mouseY + 'px';
      mouseGlow.style.left  = mouseX + 'px';
      mouseGlow.style.top   = mouseY + 'px';
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .cert-thumb, .proj-card, .stat-card, .skill-card, .timeline-item, .contact-item, .social-btn')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
      });

    /* ─────────────────────────────────────────────
       2. PARTICLE CANVAS
    ───────────────────────────────────────────── */
    const canvas = document.getElementById('particle-canvas');
    const ctx    = canvas.getContext('2d');
    let W, H, particles = [];

    function resizeCanvas() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const SYMBOLS = ['$', '€', '£', '%', '¥', '+', '×', '—', '≈', '∑'];

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x   = Math.random() * W;
        this.y   = init ? Math.random() * H : H + 20;
        this.vx  = (Math.random() - 0.5) * 0.4;
        this.vy  = -(Math.random() * 0.6 + 0.2);
        this.alpha = Math.random() * 0.3 + 0.05;
        this.size  = Math.random() * 10 + 8;
        this.sym   = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        this.color = Math.random() > 0.5 ? '#00a8ff' : '#00e5ff';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.y < -20) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle   = this.color;
        ctx.font        = `${this.size}px "Fira Code", monospace`;
        ctx.fillText(this.sym, this.x, this.y);
        ctx.restore();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* ─────────────────────────────────────────────
       3. NAVBAR SCROLL + ACTIVE SECTION
    ───────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);

      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 140) current = s.id;
      });
      navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
      });
    });

    /* ─────────────────────────────────────────────
       4. HAMBURGER MENU
    ───────────────────────────────────────────── */
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.mm-link').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    /* ─────────────────────────────────────────────
       5. TYPING ANIMATION
    ───────────────────────────────────────────── */
    const titles = [
      'Junior Accountant',
      'Financial Analyst',
      'Excel Specialist',
      'IFRS Practitioner',
      'Tax Filing Expert',
    ];
    const typingEl = document.getElementById('typing-text');
    let ti = 0, ci = 0, deleting = false;

    function type() {
      const full = titles[ti];
      if (!deleting) {
        typingEl.textContent = full.slice(0, ++ci);
        if (ci === full.length) { deleting = true; setTimeout(type, 1800); return; }
      } else {
        typingEl.textContent = full.slice(0, --ci);
        if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; }
      }
      setTimeout(type, deleting ? 60 : 100);
    }
    type();

    /* ─────────────────────────────────────────────
       6. SCROLL REVEAL
    ───────────────────────────────────────────── */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));

    /* ─────────────────────────────────────────────
       7. COUNT UP ANIMATIONS
    ───────────────────────────────────────────── */
    const counters = document.querySelectorAll('.count-up');
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = +el.dataset.target;
          let count = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            count += step;
            if (count >= target) { count = target; clearInterval(timer); }
            el.textContent = Math.floor(count);
          }, 25);
          countObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObs.observe(c));

    /* ─────────────────────────────────────────────
       8. SKILL BAR ANIMATIONS
    ───────────────────────────────────────────── */
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const fill = e.target;
          setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 200);
          skillObs.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    skillFills.forEach(f => skillObs.observe(f));

    /* ─────────────────────────────────────────────
       9. CERTIFICATIONS DATA & GALLERY
    ───────────────────────────────────────────── */
    const certs = [
    
      { title: 'Credit Analysis', issuer: 'Standard Chartered', img: 'certificates/22.jpg' },
      { title: 'English Conversation', issuer: 'British Council', img: 'certificates/23.jpg' },
      { title: 'Investment Banking', issuer: 'JPMorgan Chase', img: 'certificates/24.jpg' },
      { title: 'English for the work place', issuer: 'British Council', img: 'certificates/25.jpg' },
    ];

    const certGrid    = document.getElementById('cert-grid');
    const certOverlay = document.getElementById('cert-overlay');
    const certExpImg  = document.getElementById('cert-exp-img');
    const certExpTtl  = document.getElementById('cert-exp-title');
    const certExpIss  = document.getElementById('cert-exp-issuer');
    const certClose   = document.getElementById('cert-close');

    certs.forEach((c, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'cert-thumb reveal';
      thumb.style.transitionDelay = (i * 0.04) + 's';
      thumb.innerHTML = `
        <div class="cert-circle">
          <img src="${c.img}" alt="${c.title}" loading="lazy" />
        </div>
        <div class="cert-label">${c.title}</div>`;
      thumb.addEventListener('click', () => {
        certExpImg.src        = c.img;
        certExpImg.alt        = c.title;
        certExpTtl.textContent = c.title;
        certExpIss.textContent = c.issuer;
        certOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
      certGrid.appendChild(thumb);
    });

    function closeOverlay() {
      certOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    certClose.addEventListener('click', closeOverlay);
    certOverlay.addEventListener('click', e => { if (e.target === certOverlay) closeOverlay(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay(); });

    // Re-observe newly added cert thumbs
    document.querySelectorAll('.cert-thumb.reveal').forEach(el => revealObserver.observe(el));

    /* ─────────────────────────────────────────────
       10. EXCEL PROJECTS
    ───────────────────────────────────────────── */
    const projects = [
      {
        title: 'Financial Dashboard',
        desc: 'Dynamic multi-KPI dashboard with charts, slicers, and real-time cash flow tracking across fiscal quarters.',
        icon: 'fas fa-tachometer-alt',
        tag: 'Reporting',
        rows: [
          ['Category','Q1','Q2','Q3','Q4'],
          ['Revenue','=B2*1.12','=SUM(B2:C2)','450,000','512,000'],
          ['COGS','(180,000)','(195,000)','(200,000)','(225,000)'],
          ['Gross Profit','=B2-B3','=C2-C3','250,000','287,000'],
          ['Net Income','120,000','135,000','148,000','162,000'],
          ['EBITDA','=B6/B2','22%','23%','24%'],
        ]
      },
      {
        title: 'VAT Calculation File',
        desc: 'Automated VAT return file supporting 100+ monthly transactions with auto-reconciliation and error detection.',
        icon: 'fas fa-percent',
        tag: 'Taxation',
        rows: [
          ['Invoice','Amount','VAT%','VAT','Total'],
          ['INV-001','50,000','14%','=B2*0.14','=B2+D2'],
          ['INV-002','30,000','14%','4,200','34,200'],
          ['INV-003','75,000','0%','0','75,000'],
          ['Monthly Total','=SUM(B2:B4)','','=SUM(D2:D4)','=SUM(E2:E4)'],
          ['Filing Status','Submitted','','100%','✓'],
        ]
      },
      {
        title: 'DCF Valuation Model',
        desc: 'Discounted Cash Flow model for M&A analysis with WACC calculation, terminal value, and sensitivity tables.',
        icon: 'fas fa-chart-line',
        tag: 'Valuation',
        rows: [
          ['Year','FCF','WACC','Disc.FCF','Cum.PV'],
          ['2024','1,200,000','10.5%','=B2/(1+C2)','1,085,972'],
          ['2025','1,350,000','10.5%','=B3/(1+C3)^2','1,107,480'],
          ['2026','1,500,000','10.5%','=B4/(1+C4)^3','1,115,932'],
          ['Terminal','=B4*(1.03)','','=E4/(C4-0.03)','12,450,000'],
          ['Total EV','=SUM(D2:D5)','','','16,759,384'],
        ]
      },
      {
        title: 'Expense Tracker',
        desc: 'Monthly budget vs. actual expense tracker with category breakdown, alerts, and visual pivot charts.',
        icon: 'fas fa-wallet',
        tag: 'Budgeting',
        rows: [
          ['Expense','Budget','Actual','Variance','Status'],
          ['Salaries','80,000','82,500','(2,500)','⚠ Over'],
          ['Utilities','5,000','4,300','700','✓ Under'],
          ['Marketing','15,000','14,200','800','✓ Under'],
          ['Office','3,000','3,000','0','= On Target'],
          ['Total','=SUM(B2:B5)','=SUM(C2:C5)','=SUM(D2:D5)',''],
        ]
      },
      {
        title: 'Financial Statements',
        desc: 'Full IFRS-compliant P&L, Balance Sheet, and Cash Flow Statement template for SME clients.',
        icon: 'fas fa-file-invoice',
        tag: 'IFRS Reporting',
        rows: [
          ['Account','Dr','Cr','Balance'],
          ['Cash & Equiv.','250,000','','250,000'],
          ['Accounts Rec.','180,000','','180,000'],
          ['Inventory','95,000','','95,000'],
          ['Total Assets','=SUM(B2:B4)','','=SUM(D2:D4)'],
          ['Net Equity','','350,000','350,000'],
        ]
      },
      {
        title: 'Bank Reconciliation',
        desc: 'Automated bank-to-ledger reconciliation for 50+ accounts with discrepancy flagging and audit trail.',
        icon: 'fas fa-balance-scale',
        tag: 'Reconciliation',
        rows: [
          ['Date','Bank Stmt','GL Balance','Diff','Flag'],
          ['Jan-25','320,500','320,500','0','✓'],
          ['Feb-25','415,200','412,800','2,400','⚠'],
          ['Mar-25','380,000','380,000','0','✓'],
          ['Apr-25','502,100','502,100','0','✓'],
          ['Avg Accuracy','','','','97.6%'],
        ]
      },
    ];

    const projGrid = document.getElementById('projects-grid');
    projects.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'proj-card reveal';
      card.style.transitionDelay = (idx * 0.08) + 's';

      // Build spreadsheet rows
      let rowsHTML = p.rows.map((row, ri) =>
        `<div class="xl-row">${row.map((cell, ci) =>
          `<div class="xl-cell${ri===0?' header':''}${cell.startsWith('=')?' formula':''}">${cell}</div>`
        ).join('')}</div>`
      ).join('');

      card.innerHTML = `
        <div class="proj-icon"><i class="${p.icon}"></i></div>
        <div class="proj-title">${p.title}</div>
        <div class="proj-desc">${p.desc}</div>
        <span class="proj-tag">${p.tag}</span>
        <div class="proj-preview">
          
          <div class="xl-sheet">${rowsHTML}${rowsHTML}</div>
        </div>`;
      projGrid.appendChild(card);
    });

    // Re-observe
    document.querySelectorAll('.proj-card.reveal').forEach(el => revealObserver.observe(el));

    /* ─────────────────────────────────────────────
       11. CONTACT COPY BUTTONS
    ───────────────────────────────────────────── */
    document.querySelectorAll('.contact-item[data-copy]').forEach(item => {
      const btn = item.querySelector('.ci-copy');
      if (!btn) return;
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(item.dataset.copy).then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
        });
      });
    });

    // ربط الزر من خلال الـ ID الجديد
const emailBtn = document.getElementById('email-social-btn');

if (emailBtn) {
  emailBtn.addEventListener('click', function(event) {
    event.preventDefault(); // منع أي سلوك افتراضي تماماً
    
    const email = "abdelrahmanramadan061@gmail.com";
    
    // فحص نوع الجهاز (موبايل أم كمبيوتر)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // على الهاتف: يفتح تطبيق الإيميل مباشرة
      window.location.href = `mailto:${email}`;
    } else {
      // على الكمبيوتر: يفتح Gmail في صفحة جديدة دون التأثير على موقعك
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
    }
  });
}

    /* ─────────────────────────────────────────────
       12. CONTACT FORM
    ───────────────────────────────────────────── */
   const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('form-submit');
const successMsg = document.getElementById('form-success-msg');

form.addEventListener('submit', e => {
  e.preventDefault();

  // 1. التحقق من أن المستخدم ملأ كل الحقول المطلوبة بشكل صحيح
  if (!form.checkValidity()) {
    form.reportValidity(); // بيظهر رسالة تحذير للمستخدم فوق الحقل الناقص
    return;
  }

  // 2. تغيير حالة الزرار لشكل التحميل (Sending...)
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:10px;"></i>Sending…';

  // 3. تجميع بيانات الفورم
  const formData = new FormData(form);

  /* ⚠️ خطوة هامة جداً:
    ادخل على موقع https://formspree.io واعمل حساب مجاني سريع.
    أنشئ "Form" جديدة وهيديك رابط أو ID كود.. استبدل الكلمة اللي تحت بالـ ID بتاعك.
  */
  const formspreeID = "mvzydqdz"; 

  // 4. إرسال البيانات الفعلي للإيميل
  fetch(`https://formspree.io/f/${formspreeID}`, {
    method: 'POST',
    body: formData,
    headers: {
        'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      // إذا تم الإرسال بنجاح، شغل الأنيميشن بتاعك
      submitBtn.innerHTML = '<i class="fas fa-check" style="margin-right:10px;"></i>Message Sent!';
      submitBtn.classList.add('success');
      successMsg.classList.add('show');
      form.reset(); // تفريغ الحقول بعد النجاح
      
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:10px;"></i>Send Message';
        submitBtn.classList.remove('success');
        submitBtn.disabled = false;
        successMsg.classList.remove('show');
      }, 4000);
    } else {
      // لو السيرفر رد بخطأ
      alert('Oops! There was a problem submitting your form');
      resetButton();
    }
  })
  .catch(error => {
    // لو مفيش إنترنت أو حصلت مشكلة شبكة
    alert('Network error. Please try again later.');
    resetButton();
  });
});

// فانكشن لإعادة الزرار لحالته الأصلية لو حصل خطأ في الإرسال
function resetButton() {
  submitBtn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:10px;"></i>Send Message';
  submitBtn.disabled = false;
}
    /* ─────────────────────────────────────────────
       13. STAT CARD 3D TILT
    ───────────────────────────────────────────── */
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -16;
        card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

  }); // end DOMContentLoaded