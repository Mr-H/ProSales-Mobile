(function () {
  // Watch toggle component: multiple instances supported.
  function initToggle(btn) {
    const icon = btn.querySelector('.watch-icon');
    if (!icon) return;
    const listingId = btn.dataset.listingId || 'listing-unknown';
    const key = `watched:${listingId}`;

    function setState(watched) {
      btn.setAttribute('aria-pressed', watched ? 'true' : 'false');
      btn.title = watched ? 'Unwatch this item' : 'Watch this item';
      if (watched) {
        icon.classList.add('filled');
      } else {
        icon.classList.remove('filled');
      }
    }

    // initialize
    try {
      const stored = window.localStorage && typeof window.localStorage.getItem === 'function'
        ? window.localStorage.getItem(key)
        : null;
      setState(stored === '1');
    } catch (e) {
      setState(false);
    }

    function toggle() {
      const now = btn.getAttribute('aria-pressed') === 'true';
      const next = !now;
      setState(next);
  try { if (window.localStorage && typeof window.localStorage.setItem === 'function') window.localStorage.setItem(key, next ? '1' : '0'); } catch (e) { }
    }

    btn.addEventListener('click', toggle);
    // expose a programmatic toggle for testing or external usage
    btn.toggleWatch = toggle;
  }

  // Auto-initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      Array.from(document.querySelectorAll('.watch-toggle')).forEach(initToggle);
    });
  } else {
    Array.from(document.querySelectorAll('.watch-toggle')).forEach(initToggle);
  }

  // Expose for testing
  window.__watchToggle = {
    initToggle,
  };
})();
