(() => {
  const ceremony = new Date('2026-12-20T14:30:00+08:00');
  const countdownFields = Object.fromEntries(
    [...document.querySelectorAll('[data-count]')].map((field) => [field.dataset.count, field]),
  );
  const meetingScene = document.querySelector('#meeting-scene');
  const sceneMessage = document.querySelector('[data-scene-message]');

  function updateCountdown() {
    const remainingMs = Math.max(0, ceremony.getTime() - Date.now());
    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (countdownFields.days) countdownFields.days.textContent = String(days).padStart(3, '0');
    if (countdownFields.hours) countdownFields.hours.textContent = String(hours).padStart(2, '0');
    if (countdownFields.minutes) countdownFields.minutes.textContent = String(minutes).padStart(2, '0');
    if (countdownFields.seconds) countdownFields.seconds.textContent = String(seconds).padStart(2, '0');

    // The walkers travel across the last 120 days before the ceremony.
    const approachWindowMs = 120 * 24 * 60 * 60 * 1000;
    const progress = Math.min(1, Math.max(0, 1 - remainingMs / approachWindowMs));
    if (meetingScene) {
      const groom = meetingScene.querySelector('.walker-groom');
      const bride = meetingScene.querySelector('.walker-bride');
      const sceneWidth = meetingScene.clientWidth;
      const edgeInset = sceneWidth * 0.055;
      const groomWidth = groom?.getBoundingClientRect().width || 64;
      const brideWidth = bride?.getBoundingClientRect().width || 64;
      const groomStart = edgeInset;
      const brideStart = sceneWidth - edgeInset - brideWidth;
      const centerGap = 13;
      const groomMeet = sceneWidth / 2 - groomWidth - centerGap / 2;
      const brideMeet = sceneWidth / 2 + centerGap / 2;
      meetingScene.style.setProperty('--groom-x', `${groomStart + (groomMeet - groomStart) * progress}px`);
      meetingScene.style.setProperty('--bride-x', `${brideStart + (brideMeet - brideStart) * progress}px`);
    }
    meetingScene?.classList.toggle('is-close', progress > 0.9);
    if (sceneMessage) {
      sceneMessage.textContent = remainingMs === 0
        ? 'Today is the day · Let’s celebrate!'
        : 'Every step brings us closer · 20 December 2026';
    }
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
  window.addEventListener('resize', updateCountdown, { passive: true });

  const menuButton = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('#site-nav');
  menuButton?.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    siteNav?.classList.toggle('is-open', !expanded);
  });
  siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    siteNav.classList.remove('is-open');
  }));

  const galleryItems = [...document.querySelectorAll('.gallery-photo')];
  const lightbox = document.querySelector('#photo-dialog');
  const lightboxImage = lightbox?.querySelector('figure img');
  const lightboxCaption = lightbox?.querySelector('figcaption');
  let activePhoto = 0;

  function showPhoto(index) {
    if (!galleryItems.length || !lightbox || !lightboxImage || !lightboxCaption) return;
    activePhoto = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[activePhoto];
    lightboxImage.src = item.dataset.photo;
    lightboxImage.alt = item.querySelector('img')?.alt || '';
    lightboxCaption.textContent = item.dataset.caption || '';
  }

  galleryItems.forEach((item, index) => item.addEventListener('click', () => {
    showPhoto(index);
    lightbox?.showModal();
  }));
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => showPhoto(activePhoto - 1));
  lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => showPhoto(activePhoto + 1));
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(activePhoto - 1);
    if (event.key === 'ArrowRight') showPhoto(activePhoto + 1);
  });

  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }
})();
