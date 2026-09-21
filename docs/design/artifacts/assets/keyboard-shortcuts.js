(function () {
  const shell = document.querySelector('[data-shortcut-shell]');
  const paletteOverlay = document.querySelector('[data-command-overlay]');
  const paletteSearch = paletteOverlay && paletteOverlay.querySelector('[data-command-search]');
  let paletteOpener = null;

  function blockingDialogOpen() {
    return !!document.querySelector('.overlay[data-blocking-dialog]:not([hidden])');
  }
  function inRichText(target) {
    return !!(target && (target.isContentEditable || target.closest?.('[contenteditable="true"]')));
  }
  function toggleSidebar() {
    if (!shell) return;
    shell.classList.toggle('shortcut-collapsed');
  }
  function openPalette(opener) {
    if (!paletteOverlay || blockingDialogOpen()) return;
    paletteOpener = opener || document.activeElement;
    paletteOverlay.hidden = false;
    requestAnimationFrame(() => paletteSearch && paletteSearch.focus());
  }
  function closePalette() {
    if (!paletteOverlay || paletteOverlay.hidden) return;
    paletteOverlay.hidden = true;
    if (paletteOpener && typeof paletteOpener.focus === 'function') paletteOpener.focus();
  }

  document.querySelectorAll('[data-sidebar-toggle]').forEach((el) => el.addEventListener('click', toggleSidebar));
  document.querySelectorAll('[data-command-trigger]').forEach((el) => el.addEventListener('click', () => openPalette(el)));
  document.querySelectorAll('[data-command-close]').forEach((el) => el.addEventListener('click', closePalette));

  document.addEventListener('keydown', (event) => {
    const mod = event.metaKey || event.ctrlKey;
    if (mod && event.key.toLowerCase() === 'b' && !inRichText(event.target) && !blockingDialogOpen()) {
      event.preventDefault();
      toggleSidebar();
      return;
    }
    if (mod && event.key.toLowerCase() === 'k' && !blockingDialogOpen()) {
      event.preventDefault();
      if (paletteOverlay && !paletteOverlay.hidden) {
        if (paletteSearch) paletteSearch.focus();
      } else {
        openPalette(document.activeElement);
      }
      return;
    }
    if (event.key === 'Escape') closePalette();
  });
})();
