// data-loader.js — ES module, replaces hardcoded HTML with live API data.
// Falls back silently if API is unreachable — hardcoded HTML remains visible.

const API = 'http://localhost:3001/api/v1';

async function fetchJSON(path) {
  try {
    const res = await fetch(`${API}${path}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function reinit() {
  if (typeof window.reinitReveal === 'function') window.reinitReveal();
  if (typeof window.reinitSkillBars === 'function') window.reinitSkillBars();
}

function setEl(id, text) {
  const el = document.getElementById(id);
  if (el && text != null) el.textContent = text;
}

function applyProfile(profile) {
  if (!profile) return;
  // Hero (index only)
  setEl('hero-headline', profile.heroHeadline);
  setEl('hero-subtext', profile.heroSubtext);
  // Footer tagline (index only)
  setEl('footer-tagline', profile.footerTagline);
  // About quick facts
  setEl('fact-location', profile.location);
  setEl('fact-status', profile.availability);
  setEl('fact-email', profile.email);
  setEl('fact-focus', profile.focus);
  // About LinkedIn CTA
  const linkedinCta = document.getElementById('about-linkedin-link');
  if (linkedinCta && profile.linkedinUrl) linkedinCta.href = profile.linkedinUrl;
  // Email quick-fact link
  const emailLink = document.getElementById('fact-email-link');
  if (emailLink && profile.email) emailLink.href = 'mailto:' + profile.email;
  // Contact page
  const contactEmail = document.getElementById('contact-email-link');
  if (contactEmail && profile.email) {
    contactEmail.href = 'mailto:' + profile.email;
    setEl('contact-email-value', profile.email);
  }
  const contactLinkedin = document.getElementById('contact-linkedin-link');
  if (contactLinkedin && profile.linkedinUrl) {
    contactLinkedin.href = profile.linkedinUrl;
    setEl('contact-linkedin-value', profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, ''));
  }
  const contactGithub = document.getElementById('contact-github-link');
  if (contactGithub && profile.githubUrl) {
    contactGithub.href = profile.githubUrl;
    setEl('contact-github-value', profile.githubUrl.replace(/^https?:\/\//, ''));
  }
  setEl('contact-avail-title', profile.availability);
  setEl('contact-avail-text', profile.availabilityText);
  setEl('contact-location-city', profile.location);
  // Form fallback mailto
  const formEmailLink = document.getElementById('contact-form-email-link');
  if (formEmailLink && profile.email) {
    formEmailLink.href = 'mailto:' + profile.email;
    setEl('contact-form-email-text', profile.email);
  }
}

// ── Index page ─────────────────────────────────────────────────────────────
async function loadIndex() {
  const res = await fetchJSON('/profile');
  const profile = res?.data;
  if (!profile) return;

  applyProfile(profile);

  // Hero stat chips
  const heroStats = document.getElementById('hero-stats-row');
  if (heroStats) {
    heroStats.innerHTML = `
      <div class="stat-chip"><span style="font-family:'Space Mono',monospace;font-weight:700;font-size:1.2rem;color:#22d3ee;">${profile.yearsExp}</span><br/><span style="font-size:0.7rem;color:var(--muted);">Years Exp.</span></div>
      <div class="stat-chip"><span style="font-family:'Space Mono',monospace;font-weight:700;font-size:1.2rem;color:#c084fc;">${profile.publications}</span><br/><span style="font-size:0.7rem;color:var(--muted);">Publications</span></div>
      <div class="stat-chip"><span style="font-family:'Space Mono',monospace;font-weight:700;font-size:1.2rem;color:#60a5fa;">${profile.projects}</span><br/><span style="font-size:0.7rem;color:var(--muted);">Projects</span></div>
      <div class="stat-chip"><span style="font-family:'Space Mono',monospace;font-weight:700;font-size:1.2rem;color:#22d3ee;">${profile.awards}</span><br/><span style="font-size:0.7rem;color:var(--muted);">Awards</span></div>
    `;
  }

  // Overview stat row
  const overviewStats = document.getElementById('overview-stat-row');
  if (overviewStats) {
    overviewStats.innerHTML = `
      <div class="card stat-big"><div class="stat-big-num">${profile.yearsExp}</div><div class="stat-big-label">YEARS EXPERIENCE</div></div>
      <div class="card stat-big"><div class="stat-big-num" style="background:linear-gradient(135deg,#c084fc,#7b39fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${profile.publications}</div><div class="stat-big-label">PUBLICATIONS</div></div>
      <div class="card stat-big"><div class="stat-big-num" style="background:linear-gradient(135deg,#60a5fa,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${profile.projects}</div><div class="stat-big-label">PROJECTS</div></div>
      <div class="card stat-big"><div class="stat-big-num">${profile.awards}</div><div class="stat-big-label">AWARDS</div></div>
    `;
  }
}

// ── About page ──────────────────────────────────────────────────────────────
async function loadAbout() {
  const [profileRes, eduRes, certsRes, awardsRes] = await Promise.all([
    fetchJSON('/profile'),
    fetchJSON('/education'),
    fetchJSON('/certifications'),
    fetchJSON('/awards'),
  ]);
  const profile = profileRes?.data;

  applyProfile(profile);

  // Bio paragraphs
  if (profile?.bio) {
    const bioEl = document.getElementById('bio-container');
    if (bioEl) bioEl.innerHTML = profile.bio.map(p => `<p>${p}</p>`).join('');
  }

  // Education cards
  if (eduRes?.data) {
    const colors = ['#22d3ee', '#c084fc', '#60a5fa'];
    const icons = ['🎓', '🏛️', '🏫'];
    const tagClasses = ['tag', 'tag tag-purple', 'tag tag-blue'];
    const eduEl = document.getElementById('edu-grid');
    if (eduEl) {
      eduEl.innerHTML = eduRes.data.map((edu, i) => {
        const color = colors[i % colors.length];
        const icon = icons[i % icons.length];
        const tagCls = tagClasses[i % tagClasses.length];
        const yearRange = edu.endYear ? `${edu.startYear} – ${edu.endYear}` : `${edu.startYear} – Present`;
        return `
          <div class="card reveal" style="padding:1.75rem;position:relative;overflow:hidden;">
            <div style="position:absolute;top:0;right:0;width:100px;height:100px;background:radial-gradient(circle,${color}1a,transparent);border-radius:0 16px 0 0;"></div>
            <div style="display:flex;gap:1rem;align-items:start;">
              <div style="width:50px;height:50px;border-radius:12px;background:${color}1a;border:1px solid ${color}40;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">${icon}</div>
              <div>
                <span class="${tagCls}" style="margin-bottom:0.6rem;display:inline-flex;">${yearRange}</span>
                <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.3rem;">${edu.institution}</h3>
                <p style="color:${color};font-size:0.9rem;font-weight:500;margin-bottom:0.3rem;">${edu.degree}</p>
                <p style="color:var(--muted);font-size:0.82rem;">${edu.field}</p>
                ${edu.description ? `<p style="color:var(--muted);font-size:0.78rem;margin-top:0.6rem;line-height:1.6;">${edu.description}</p>` : ''}
              </div>
            </div>
          </div>`;
      }).join('');
    }
  }

  // Certifications strip
  if (certsRes?.data) {
    const certsEl = document.getElementById('certs-strip');
    if (certsEl) {
      certsEl.innerHTML = certsRes.data.map(c =>
        `<span class="tag">${c.name}${c.issuer ? ` — ${c.issuer}` : ''}</span>`
      ).join('');
    }
  }

  // Awards grid
  if (awardsRes?.data) {
    const awardsEl = document.getElementById('awards-grid');
    if (awardsEl) {
      awardsEl.innerHTML = awardsRes.data.map((a, i) => `
        <div class="card reveal" style="display:flex;align-items:center;gap:1rem;padding:1.25rem 1.5rem;${i > 0 ? `transition-delay:${i * 0.06}s;` : ''}">
          <div class="award-badge">${a.badgeText}</div>
          <div>
            <div style="font-weight:600;font-size:0.95rem;">${a.title}</div>
            <div style="font-size:0.78rem;color:var(--muted);margin-top:2px;">${a.issuer}${a.year ? ` · ${a.year}` : ''}</div>
          </div>
        </div>`).join('');
    }
  }

  reinit();
}

// ── Experience page ─────────────────────────────────────────────────────────
async function loadExperience() {
  const [industryRes, researchRes] = await Promise.all([
    fetchJSON('/experience?type=INDUSTRY'),
    fetchJSON('/experience?type=RESEARCH'),
  ]);

  function renderExpCard(exp, delay, colorClass = '') {
    const dateTag = exp.isCurrent
      ? `${exp.startDate} – Present`
      : `${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ''}`;
    const tagClass = colorClass ? `tag ${colorClass}` : 'tag';
    const orgColor = colorClass === 'tag-purple' ? '#c084fc' : (colorClass === 'tag-blue' ? '#60a5fa' : '#22d3ee');
    const currentBadge = exp.isCurrent
      ? `<span class="current-badge"><span class="current-dot"></span>Current</span>`
      : '';
    const bullets = Array.isArray(exp.description) && exp.description.length > 1
      ? `<ul>${exp.description.map(d => `<li>${d}</li>`).join('')}</ul>`
      : `<p>${(exp.description || [])[0] || ''}</p>`;
    const tags = (exp.technologies || []).slice(0, 6)
      .map(t => `<span class="${tagClass}">${t}</span>`).join('');
    return `
      <div class="exp-card reveal" ${delay > 0 ? `style="transition-delay:${delay}s;"` : ''}>
        <div class="exp-card-header">
          <div class="exp-card-meta">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem;">
              <div class="exp-card-title">${exp.title}</div>
              ${currentBadge}
            </div>
            <div class="exp-card-org" style="color:${orgColor};">${exp.organization}</div>
          </div>
          <span class="${tagClass}" style="flex-shrink:0;">${dateTag}</span>
        </div>
        <div class="exp-card-body">${bullets}</div>
        ${tags ? `<div class="exp-tags">${tags}</div>` : ''}
      </div>`;
  }

  if (industryRes?.data) {
    const col = document.getElementById('industry-column');
    if (col) {
      const header = col.querySelector('.exp-col-title');
      const cards = industryRes.data.map((e, i) => renderExpCard(e, i * 0.06, '')).join('');
      col.innerHTML = (header ? header.outerHTML : '<div class="exp-col-title" style="color:#22d3ee;">⚡ Industry</div>') + cards;
    }
  }

  if (researchRes?.data) {
    const col = document.getElementById('research-column');
    if (col) {
      const header = col.querySelector('.exp-col-title');
      const cards = researchRes.data.map((e, i) => renderExpCard(e, i * 0.06, 'tag-purple')).join('');
      col.innerHTML = (header ? header.outerHTML : '<div class="exp-col-title" style="color:#c084fc;">🔬 Research &amp; Academic</div>') + cards;
    }
  }

  reinit();
}

// ── Projects page ───────────────────────────────────────────────────────────
async function loadProjects() {
  const [projRes, pubRes] = await Promise.all([
    fetchJSON('/projects'),
    fetchJSON('/publications'),
  ]);

  const iconMap = ['🤖', '🚁', '🦾', '🦿', '🚂', '🧪', '⚙️'];
  const colorMap = ['#22d3ee', '#c084fc', '#60a5fa', '#22d3ee', '#c084fc', '#60a5fa', '#22d3ee'];

  if (projRes?.data) {
    const grid = document.getElementById('projects-grid');
    if (grid) {
      grid.innerHTML = projRes.data.map((p, i) => {
        const icon = p.iconEmoji || iconMap[i % iconMap.length];
        const color = colorMap[i % colorMap.length];
        const tags = (p.technologies || []).map(t => `<span class="tag">${t}</span>`).join('');
        const paperLink = p.paperUrl
          ? `<a href="${p.paperUrl}" target="_blank" class="glass-btn glass-btn-secondary" style="margin-top:auto;padding-top:1rem;font-size:0.78rem;height:32px;">View Paper →</a>`
          : '';
        const thumbnail = p.imageUrl
          ? `<img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:160px;object-fit:cover;border-radius:10px;margin-bottom:1rem;border:1px solid rgba(255,255,255,0.07);" onerror="this.style.display='none'" />`
          : '';
        return `
          <div class="project-card reveal ${p.featured ? 'featured' : ''}" style="transition-delay:${i * 0.06}s;">
            ${thumbnail}
            <div class="project-icon" style="background:${color}1a;border:1px solid ${color}40;">${icon}</div>
            <div class="project-label" style="color:${color};">${p.organization}${p.year ? ` · ${p.year}` : ''}</div>
            <div class="project-title">${p.title}</div>
            <div class="project-desc">${p.description || ''}</div>
            ${tags ? `<div class="project-tags">${tags}</div>` : ''}
            ${paperLink}
          </div>`;
      }).join('');
    }
  }

  const venueColors = { 'ICUAS 2024': '#c084fc', 'ICAMMP 2021': '#22d3ee', 'INN Journal': '#60a5fa', 'Book Chapter': '#a78bfa' };
  if (pubRes?.data) {
    const list = document.getElementById('publications-list');
    if (list) {
      list.innerHTML = pubRes.data.map((p, i) => {
        const color = venueColors[p.venue] || '#94a3b8';
        const link = p.url ? `<a href="${p.url}" target="_blank" style="color:${color};font-size:0.8rem;text-decoration:underline;margin-top:0.75rem;display:inline-block;">View Paper →</a>` : '';
        return `
          <div class="pub-card reveal" style="transition-delay:${i * 0.06}s;">
            <div class="pub-num">${String(i + 1).padStart(2, '0')}</div>
            <div class="pub-venue" style="background:${color}1a;color:${color};border:1px solid ${color}40;">${p.venue}</div>
            <h4 style="font-size:0.95rem;font-weight:600;color:#f1f5f9;line-height:1.4;margin-bottom:0.5rem;padding-right:3rem;">${p.title}</h4>
            <p style="font-size:0.82rem;color:var(--muted);line-height:1.7;">${p.description || ''}</p>
            ${link}
          </div>`;
      }).join('');
    }
  }

  reinit();
}

// ── Skills page ─────────────────────────────────────────────────────────────
async function loadSkills() {
  const [skillsRes, certsRes] = await Promise.all([
    fetchJSON('/skills'),
    fetchJSON('/certifications'),
  ]);

  const categoryConfig = {
    'Languages':         { icon: '💻', color: '#22d3ee', grad: 'linear-gradient(90deg,#22d3ee,#60a5fa)' },
    'ML / AI':           { icon: '🧠', color: '#c084fc', grad: 'linear-gradient(90deg,#c084fc,#7b39fc)' },
    'Robotics':          { icon: '🤖', color: '#60a5fa', grad: 'linear-gradient(90deg,#60a5fa,#22d3ee)' },
    'Perception':        { icon: '📡', color: '#22d3ee', grad: 'linear-gradient(90deg,#22d3ee,#60a5fa)' },
    'Mechanical / CAD':  { icon: '⚙️',  color: '#a78bfa', grad: 'linear-gradient(90deg,#a78bfa,#60a5fa)' },
    'Tools & Platforms': { icon: '🛠️', color: '#22d3ee', grad: 'linear-gradient(90deg,#22d3ee,#60a5fa)' },
  };

  if (skillsRes?.data) {
    // Group by category
    const byCategory = {};
    for (const sk of skillsRes.data) {
      if (!byCategory[sk.category]) byCategory[sk.category] = [];
      byCategory[sk.category].push(sk);
    }

    // Skills grid (category cards)
    const grid = document.getElementById('skills-grid');
    if (grid) {
      grid.innerHTML = Object.entries(byCategory).map(([cat, skills], catIdx) => {
        const cfg = categoryConfig[cat] || { icon: '⚡', color: '#22d3ee', grad: 'linear-gradient(90deg,#22d3ee,#60a5fa)' };
        const bars = skills.map(sk => `
          <div class="skill-bar-row">
            <div class="skill-bar-label">
              <span class="skill-bar-name">${sk.name}</span>
              <span class="skill-bar-level">${sk.level}</span>
            </div>
            <div class="skill-track"><div class="skill-fill" data-width="${sk.proficiency}" style="background:${cfg.grad};"></div></div>
          </div>`).join('');
        return `
          <div class="skill-cat-card reveal" style="transition-delay:${catIdx * 0.06}s;">
            <div class="skill-cat-header">
              <div class="skill-cat-icon" style="background:${cfg.color}1a;border:1px solid ${cfg.color}40;">${cfg.icon}</div>
              <div class="skill-cat-title" style="color:${cfg.color};">${cat}</div>
            </div>
            ${bars}
          </div>`;
      }).join('');
    }

    // Tech cloud (all skill names)
    const cloud = document.getElementById('tech-cloud');
    if (cloud) {
      cloud.innerHTML = skillsRes.data.map(sk => `<span class="tech-pill">${sk.name}</span>`).join('');
    }
  }

  if (certsRes?.data) {
    const certsGrid = document.getElementById('certs-grid');
    if (certsGrid) {
      certsGrid.innerHTML = certsRes.data.map(c => `
        <div class="cert-card reveal">
          <div class="cert-icon" style="background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.2);">📜</div>
          <div>
            <div style="font-weight:500;font-size:0.9rem;">${c.name}</div>
            <div style="font-size:0.75rem;color:var(--muted);margin-top:2px;">${c.issuer}${c.year ? ` · ${c.year}` : ''}</div>
          </div>
        </div>`).join('');
    }
  }

  reinit();
}

// ── Contact page ─────────────────────────────────────────────────────────────
async function loadContact() {
  const profileRes = await fetchJSON('/profile');
  applyProfile(profileRes?.data);

  window.handleSubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const data = {
      firstName: form.querySelector('[name="firstName"]')?.value || form.querySelector('#firstName')?.value || '',
      lastName:  form.querySelector('[name="lastName"]')?.value  || form.querySelector('#lastName')?.value  || '',
      email:     form.querySelector('[name="email"]')?.value     || form.querySelector('#email')?.value     || '',
      subject:   form.querySelector('[name="subject"]')?.value   || form.querySelector('#subject')?.value   || '',
      message:   form.querySelector('[name="message"]')?.value   || form.querySelector('#message')?.value   || '',
    };
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.reset();
        const msg = document.getElementById('form-success') || document.createElement('p');
        msg.id = 'form-success';
        msg.style.cssText = 'color:#22d3ee;margin-top:1rem;font-size:0.9rem;';
        msg.textContent = 'Message sent! I\'ll be in touch soon.';
        form.appendChild(msg);
      } else {
        throw new Error('Server error');
      }
    } catch {
      // fallback: mailto
      const fallbackEmail = document.getElementById('contact-email-value')?.textContent || 'sis_shaswat@outlook.com';
      const mailto = `mailto:${fallbackEmail}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message)}`;
      window.location.href = mailto;
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
    }
  };
}

// ── Router ──────────────────────────────────────────────────────────────────
const page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');

if (page === '' || page === 'index') {
  document.addEventListener('DOMContentLoaded', loadIndex);
} else if (page === 'about') {
  document.addEventListener('DOMContentLoaded', loadAbout);
} else if (page === 'experience') {
  document.addEventListener('DOMContentLoaded', loadExperience);
} else if (page === 'projects') {
  document.addEventListener('DOMContentLoaded', loadProjects);
} else if (page === 'skills') {
  document.addEventListener('DOMContentLoaded', loadSkills);
} else if (page === 'contact') {
  document.addEventListener('DOMContentLoaded', loadContact);
}
