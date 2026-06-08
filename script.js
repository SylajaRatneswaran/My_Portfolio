// Navigation scroll effect
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.1}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// Stagger hero reveals on load
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 150 + i * 120);
  });
});

// Active nav link highlighting
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}`
      ? 'var(--accent)'
      : '';
  });
});

// Certificate lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.cert-image-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.dataset.cert;
    const alt = btn.querySelector('img').alt;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

// Resume availability check
const resumePath = 'assets/resume/resume.pdf';
const resumeHint = document.getElementById('resumeHint');
const resumeLinks = [
  document.getElementById('resumeDownload'),
  document.getElementById('resumeView'),
  document.getElementById('resumeSave'),
].filter(Boolean);

fetch(resumePath, { method: 'HEAD' })
  .then(res => {
    if (res.ok) {
      resumeHint.textContent = 'PDF ready to view or download';
      resumeHint.classList.add('available');
    } else {
      resumeLinks.forEach(link => link.classList.add('disabled'));
    }
  })
  .catch(() => {
    resumeLinks.forEach(link => link.classList.add('disabled'));
  });
