'use strict';

const CONTACT_EMAIL = 'wenterme@gmail.com';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuButton || !navigation) return;
  const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'メニューを開く');
  navigation.classList.remove('is-open');
  if (restoreFocus && wasOpen) menuButton.focus();
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu();
    else {
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'メニューを閉じる');
      navigation.classList.add('is-open');
    }
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu({ restoreFocus: true });
  });
  document.addEventListener('pointerdown', event => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}

const emailLink = document.querySelector('#contact-email');
const emailAddress = document.querySelector('#contact-email-address');
const contactAlternative = document.querySelector('#contact-alternative');
const copyButton = document.querySelector('#contact-copy');
const copyLabel = document.querySelector('#contact-copy-label');
const copyStatus = document.querySelector('#contact-copy-status');
const configuredEmail = CONTACT_EMAIL.trim();

if (emailLink && configuredEmail) {
  emailLink.href = `mailto:${configuredEmail}`;
  emailLink.textContent = 'メールを送る ↗';
  emailLink.removeAttribute('aria-disabled');
  emailLink.removeAttribute('tabindex');

  if (emailAddress && contactAlternative) {
    emailAddress.textContent = configuredEmail;
    contactAlternative.hidden = false;
  }
}

if (copyButton && copyLabel && copyStatus && configuredEmail) {
  copyButton.addEventListener('click', async () => {
    copyStatus.textContent = '';
    copyStatus.classList.remove('is-error');
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable');
      }
      await navigator.clipboard.writeText(configuredEmail);
      copyLabel.textContent = 'コピーしました';
      copyStatus.textContent = 'メールアドレスをコピーしました。';
    } catch (error) {
      copyLabel.textContent = 'コピー';
      copyStatus.classList.add('is-error');
      copyStatus.textContent = 'コピーできませんでした。上のアドレスを選択してコピーしてください。';
    }
  });
}

const year = document.querySelector('#copyright-year');
if (year) year.textContent = String(new Date().getFullYear());

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 20px 0px' });
  // Wait until the page has rendered before enabling transitions, avoiding hidden content on first paint.
  requestAnimationFrame(() => {
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight) item.classList.add('is-visible');
      observer.observe(item);
    });
    document.body.classList.add('js-motion');
  });
}
