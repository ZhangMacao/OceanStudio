(() => {
  'use strict';
  const section = document.getElementById('workspace');
  if (!section) return;
  const diagram = section.querySelector('.workspace-diagram');
  const browser = section.querySelector('.browser-demo');
  const agent = section.querySelector('.agent-demo');
  const sink = section.querySelector('.workspace-sink');
  const cursor = section.querySelector('.demo-cursor');
  const click = section.querySelector('.demo-click');
  const typed = section.querySelector('.prompt-typed-copy');
  const caret = section.querySelector('.typing-caret');
  const toggle = section.querySelector('.workspace-toggle');
  const svg = section.querySelector('.workspace-flows');
  const bridgeDot = section.querySelector('.prompt-particle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mainVideo = document.getElementById('demo-video');
  const dialog = document.getElementById('clip-dialog');
  const words = {
    en: {
      robot: 'Robot', sensor: 'Sensors', task: 'Task', run: 'Run experiment',
      prompt: 'Configure an AUV with sonar. Run an S-shaped mission.',
      agent: 'AI Agent', pause: 'Pause animation', play: 'Play animation',
      summary: 'Workflow illustration: a researcher selects a robot, adds a sensor and sets a task in the browser. A written request passes to an external AI agent. Both routes connect to the OceanStudio platform.'
    },
    zh: {
      robot: '机器人', sensor: '传感器', task: '任务', run: '运行实验',
      prompt: '配置一台带声呐的 AUV，执行 S 型巡航任务。',
      agent: 'AI Agent', pause: '暂停动画', play: '播放动画',
      summary: '工作流示意：研究者在浏览器中选择机器人、添加传感器、设置任务；文字任务传入外部 AI Agent。两条操作路径均连接到 OceanStudio 平台。'
    }
  };
  let language = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  let prompt = Array.from(words[language].prompt);
  let paused = reduced.matches;
  let visible = false;
  let elapsed = paused ? 9500 : 0;
  let lastTime = null;
  let frame = 0;
  let lastTyped = '';
  let browserWidth = 0;
  let browserHeight = 0;
  const duration = 13000;
  const routes = ['visual', 'agent'].map(name => ({
    name,
    start: section.querySelector(`[data-flow-start="${name}"]`),
    path: section.querySelector(`[data-flow="${name}"]`),
    dot: section.querySelector(`[data-particle="${name}"]`),
    halo: section.querySelector(`[data-halo="${name}"]`),
    length: 0
  }));
  // Coordinates are percentages of the illustrated browser, not real controls.
  const cursorKeys = [
    [0, 62, 63], [450, 62, 63], [950, 15, 32], [1450, 15, 32],
    [2200, 15, 49], [2850, 15, 49], [3650, 15, 66], [4250, 15, 66],
    [4950, 78, 90], [5600, 78, 90], [6200, 86, 94], [duration, 86, 94]
  ];
  const clicks = [1150, 2500, 3950, 5300];

  function updateCopy() {
    const text = words[language];
    prompt = Array.from(text.prompt);
    section.querySelectorAll('[data-workspace-copy]').forEach(el => {
      el.textContent = text[el.dataset.workspaceCopy];
    });
    toggle.setAttribute('aria-label', paused ? text.play : text.pause);
    toggle.title = paused ? text.play : text.pause;
    toggle.dataset.paused = String(paused);
    lastTyped = '';
    render(elapsed);
  }

  function layout() {
    const bounds = diagram.getBoundingClientRect();
    const target = sink.getBoundingClientRect();
    const surface = browser.getBoundingClientRect();
    browserWidth = surface.width;
    browserHeight = surface.height;
    const targets = [...section.querySelectorAll('[data-demo-option]'), section.querySelector('.demo-run')];
    targets.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const x = (rect.left + rect.width / 2 - surface.left) / surface.width * 100;
      const y = (rect.top + rect.height / 2 - surface.top) / surface.height * 100;
      for (const key of [cursorKeys[index * 2 + 2], cursorKeys[index * 2 + 3]]) {
        key[1] = x; key[2] = y;
      }
    });
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const narrow = matchMedia('(max-width: 760px)').matches;
    for (const route of routes) {
      const start = route.start.getBoundingClientRect();
      const x = start.left + start.width / 2 - bounds.left;
      const y = start.bottom - bounds.top;
      const tx = target.left + target.width * (route.name === 'visual' ? .37 : .63) - bounds.left;
      const ty = target.top - bounds.top - 3;
      let d;
      if (narrow && route.name === 'visual') {
        // Carry the upper route around the lower illustration on a visible rail.
        const rail = 3;
        d = `M ${x} ${y} V ${y + 12} Q ${x} ${y + 24} ${x - 12} ${y + 24} H ${rail + 12} Q ${rail} ${y + 24} ${rail} ${y + 36} V ${ty - 30} Q ${rail} ${ty - 18} ${rail + 12} ${ty - 18} H ${tx - 12} Q ${tx} ${ty - 18} ${tx} ${ty - 6} V ${ty}`;
      } else {
        const mid = y + (ty - y) * .5;
        d = `M ${x} ${y} C ${x} ${mid} ${tx} ${mid} ${tx} ${ty}`;
      }
      route.path.setAttribute('d', d);
      route.length = route.path.getTotalLength();
    }
    render(elapsed);
  }

  function particle(route, progress) {
    const active = progress >= 0 && progress <= 1 && route.length > 0;
    for (const el of [route.dot, route.halo]) el.style.opacity = active ? '1' : '0';
    if (!active) return;
    const point = route.path.getPointAtLength(progress * route.length);
    for (const el of [route.dot, route.halo]) {
      el.setAttribute('cx', point.x);
      el.setAttribute('cy', point.y);
    }
  }

  function render(t) {
    browser.classList.toggle('has-sensor', t >= 2500);
    browser.classList.toggle('has-task', t >= 3950);
    browser.classList.toggle('is-submitted', t >= 5300);
    const selection = t < 2500 ? 'robot' : t < 3950 ? 'sensor' : 'task';
    section.querySelectorAll('[data-demo-option]').forEach(el => {
      el.classList.toggle('is-selected', el.dataset.demoOption === selection);
    });
    let i = cursorKeys.findIndex(key => key[0] > t);
    if (i < 1) i = cursorKeys.length - 1;
    const a = cursorKeys[i - 1], b = cursorKeys[i];
    const fraction = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])));
    const ease = fraction * fraction * (3 - 2 * fraction);
    const x = (a[1] + (b[1] - a[1]) * ease) * browserWidth / 100;
    const y = (a[2] + (b[2] - a[2]) * ease) * browserHeight / 100;
    cursor.style.transform = `translate(${x}px,${y}px)`;
    cursor.style.opacity = t < 6200 ? '1' : '0';
    const hit = clicks.find(time => t >= time && t < time + 520);
    const ripple = hit === undefined ? 1 : (t - hit) / 520;
    click.style.transform = `translate(${x - 20}px,${y - 20}px) scale(${.3 + ripple})`;
    click.style.opacity = hit === undefined ? '0' : String(.8 * (1 - ripple));
    const count = Math.floor(Math.max(0, Math.min(1, (t - 450) / 4250)) * prompt.length);
    const content = prompt.slice(0, count).join('');
    if (content !== lastTyped) { typed.textContent = content; lastTyped = content; }
    caret.style.opacity = t >= 450 && t < 5000 && Math.floor(t / 400) % 2 === 0 ? '1' : '0';
    agent.classList.toggle('is-sent', t >= 5300);
    agent.classList.toggle('is-processing', t >= 6000 && t < 10800);
    const transfer = (t - 5350) / 650;
    bridgeDot.setAttribute('cy', 3 + Math.max(0, Math.min(1, transfer)) * 44);
    bridgeDot.style.opacity = transfer >= 0 && transfer <= 1 ? '1' : '0';
    particle(routes[0], (t - 6000) / 1900);
    particle(routes[1], (t - 7000) / 1900);
    sink.classList.toggle('is-receiving', t >= 7900 && t < 11000);
  }

  function permitted() {
    return visible && !paused && !document.hidden && !dialog?.open && (!mainVideo || mainVideo.paused);
  }
  function tick(now) {
    if (!permitted()) { frame = 0; lastTime = null; return; }
    if (lastTime !== null) elapsed = (elapsed + Math.min(now - lastTime, 100)) % duration;
    lastTime = now;
    render(elapsed);
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (permitted() && !frame) { lastTime = null; frame = requestAnimationFrame(tick); }
    else if (!permitted()) { cancelAnimationFrame(frame); frame = 0; lastTime = null; }
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    if (!paused && reduced.matches) elapsed = 0;
    updateCopy(); sync();
  });
  reduced.addEventListener('change', () => {
    paused = reduced.matches;
    elapsed = paused ? 9500 : 0;
    updateCopy(); sync();
  });
  document.addEventListener('oceanstudio:language', event => {
    language = event.detail.language;
    updateCopy(); layout();
  });
  document.addEventListener('visibilitychange', sync);
  mainVideo?.addEventListener('play', sync);
  mainVideo?.addEventListener('pause', sync);
  if (dialog) new MutationObserver(sync).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  section.classList.add('workspace-enhanced');
  toggle.hidden = false;
  updateCopy(); layout();
  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(layout);
    resize.observe(diagram); resize.observe(browser); resize.observe(sink);
  } else window.addEventListener('resize', layout);
  document.fonts?.ready.then(layout);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); },
      { threshold: 0 }).observe(diagram);
  } else { visible = true; sync(); }
})();
