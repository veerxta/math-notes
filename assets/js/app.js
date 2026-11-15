/**
 * Math Notes — Core Application Script (Vanilla JS)
 * Handles:
 * 1. Light / Dark Mode toggle persisted in localStorage
 * 2. Off-canvas sidebar drawer for mobile devices (Google Pixel 5)
 * 3. Safe Service Worker registration (./sw.js)
 */

(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'math-notes-theme';

  /**
   * Determine preferred theme from localStorage or OS setting
   */
  function getInitialTheme() {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch (_) {
      // Ignore storage access errors (e.g., private mode restrictions)
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Apply theme to <html> element and sync toggle button UI
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const toggleButtons = document.querySelectorAll('[data-theme-toggle], #theme-toggle');
    toggleButtons.forEach(function (btn) {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute(
        'aria-label',
        isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'
      );

      const iconEl = btn.querySelector('.theme-icon');
      const labelEl = btn.querySelector('.theme-label');

      if (iconEl && labelEl) {
        iconEl.textContent = isDark ? '☀️' : '🌙';
        labelEl.textContent = isDark ? 'Light' : 'Dark';
      } else {
        btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
      }
    });
  }

  /**
   * Toggle between Light and Dark theme and save to localStorage
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getInitialTheme();
    const nextTheme = current === 'dark' ? 'light' : 'dark';

    applyTheme(nextTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (_) {
      // Ignore localStorage write errors
    }
  }

  // Apply theme immediately to minimize flash of unstyled theme
  applyTheme(getInitialTheme());

  /**
   * Initialize Sidebar Drawer & Theme Toggle Listeners on DOMContentLoaded
   */
  function initUI() {
    // Re-sync theme button states once DOM is ready
    applyTheme(document.documentElement.getAttribute('data-theme') || getInitialTheme());

    const themeButtons = document.querySelectorAll('[data-theme-toggle], #theme-toggle');
    themeButtons.forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });

    // Mobile Off-Canvas Sidebar Drawer
    const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay') || document.querySelector('.sidebar-overlay');
    const openButtons = document.querySelectorAll('[data-sidebar-toggle], #menu-toggle');
    const closeButtons = document.querySelectorAll('[data-sidebar-close], #sidebar-close');

    function setSidebarOpen(isOpen) {
      if (!sidebar) return;

      sidebar.classList.toggle('is-open', isOpen);
      if (overlay) {
        overlay.classList.toggle('is-visible', isOpen);
      }

      openButtons.forEach(function (btn) {
        btn.setAttribute('aria-expanded', String(isOpen));
      });

      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function toggleSidebar() {
      if (!sidebar) return;
      const isOpen = sidebar.classList.contains('is-open');
      setSidebarOpen(!isOpen);
    }

    openButtons.forEach(function (btn) {
      btn.addEventListener('click', toggleSidebar);
    });

    closeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setSidebarOpen(false);
      });
    });

    if (overlay) {
      overlay.addEventListener('click', function () {
        setSidebarOpen(false);
      });
    }

    if (sidebar) {
      const navLinks = sidebar.querySelectorAll('a.nav-link');
      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          if (window.innerWidth <= 768 && sidebar.classList.contains('is-open')) {
            setSidebarOpen(false);
          }
        });
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) {
        setSidebarOpen(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('is-open')) {
        setSidebarOpen(false);
      }
    });
  }

  /**
   * Register Service Worker safely
   */
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    // Only attempt registration on http/https or localhost to avoid file:// protocol errors
    const isSupportedProtocol =
      window.location.protocol === 'https:' ||
      window.location.protocol === 'http:';

    if (!isSupportedProtocol) {
      return;
    }

    window.addEventListener('load', function () {
      const swPath = document.documentElement.getAttribute('data-sw-path') || './sw.js';
      navigator.serviceWorker
        .register(swPath)
        .catch(function (err) {
          console.info('[Math Notes] Service Worker belum aktif atau dilewati:', err.message);
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

  registerServiceWorker();
})();
