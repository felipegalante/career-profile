(() => {
  function updateLane(lane) {
    if (!lane) return;
    const chipBox = lane.querySelector('.chips');
    if (!chipBox) return;
    const chips = chipBox.querySelectorAll('.chip[data-skill-id]');
    let empty = chipBox.querySelector('.empty-lane-copy');
    if (chips.length === 0 && !empty) {
      empty = document.createElement('span');
      empty.className = 'meta faint empty-lane-copy';
      empty.textContent = 'No skills at this level';
      chipBox.appendChild(empty);
    } else if (chips.length > 0 && empty) {
      empty.remove();
    }

    const counter = lane.querySelector('.count');
    if (counter) {
      let total = Number(lane.dataset.total);
      if (!Number.isFinite(total)) {
        const match = counter.textContent.match(/OF\s+(\d+)/i);
        total = match ? Number(match[1]) : chips.length;
      }
      counter.textContent = `SHOWING ${chips.length} OF ${Math.max(0, total)}`;
    }
  }

  function showToast(message) {
    let toast = document.getElementById('skill-remove-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'skill-remove-toast';
      toast.className = 'interaction-toast success';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = '<span aria-hidden="true">✓</span><span class="interaction-toast-text"></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector('.interaction-toast-text').textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2600);
  }

  document.querySelectorAll('.skill-remove').forEach(control => {
    if (control.dataset.bound === 'true') return;
    control.dataset.bound = 'true';

    ['pointerdown', 'mousedown', 'touchstart', 'dragstart'].forEach(type => {
      control.addEventListener(type, event => event.stopPropagation());
    });

    control.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const chip = control.closest('.chip');
      const lane = chip?.closest('.lane');
      if (!chip) return;

      const label = chip.dataset.skillLabel || chip.textContent.replace('×', '').trim() || 'Skill';
      if (lane) {
        let total = Number(lane.dataset.total);
        if (!Number.isFinite(total)) {
          const counter = lane.querySelector('.count');
          const match = counter?.textContent.match(/OF\s+(\d+)/i);
          total = match ? Number(match[1]) : lane.querySelectorAll('.chip[data-skill-id]').length;
        }
        lane.dataset.total = String(Math.max(0, total - 1));
      }

      chip.remove();
      updateLane(lane);
      showToast(`${label} removed from your profile`);
    });
  });
})();
