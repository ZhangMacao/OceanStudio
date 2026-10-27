(() => {
  'use strict';
  const section = document.getElementById('workspace');
  if (!section) return;
  const diagram = section.querySelector('.workspace-diagram');
  const recording = section.querySelector('.visual-recording');
  const video = document.getElementById('workspace-video');
  const fallback = section.querySelector('.workspace-video-fallback');
  const agent = section.querySelector('.agent-demo');
  const sink = section.querySelector('.workspace-sink');
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
      recording: 'OceanStudio visual configuration recording', openRecording: 'Open the recording', more: 'More agents',
      prompt: 'Configure an AUV with sonar. Run an S-shaped mission.',
      agent: 'AI Agent', pause: 'Pause animation', play: 'Play animation',
      summary: 'Real OceanStudio recordings show vehicle selection, sensor configuration and task setup. An illustrated written request passes to an external AI agent such as Codex, Claude Code, OpenCode or DeepSeek Harness, with more agents supported. Both routes connect to the OceanStudio platform.'
    },
    zh: {
      recording: 'OceanStudio 可视化配置实录', openRecording: '直接打开实录视频', more: '支持更多 Agent',
      prompt: '配置一台带声呐的 AUV，执行 S 型巡航任务。',
      agent: 'AI Agent', pause: '暂停动画', play: '播放动画',
      summary: '真实 OceanStudio 实录展示机器人选择、传感器配置和任务设置。右侧示意文字任务传入 Codex、Claude Code、OpenCode、DeepSeek Harness 等外部 AI Agent，也支持其他 Agent。两条路径均连接到 OceanStudio 平台。'
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
  const duration = 13000;
  const routes = ['visual', 'agent'].map(name => ({
    name,
    start: section.querySelector(`[data-flow-start="${name}"]`),
    path: section.querySelector(`[data-flow="${name}"]`),
    dot: section.querySelector(`[data-particle="${name}"]`),
    halo: section.querySelector(`[data-halo="${name}"]`),
    length: 0
  }));
  const clips = ['vehicles', 'sensors', 'missions'];
  let clipIndex = 0;
  let videoStarted = false;
  let mp4Fallback = false;
  let playPending = false;

  function updateCopy() {
    const text = words[language];
    prompt = Array.from(text.prompt);
    section.querySelectorAll('[data-workspace-copy]').forEach(el => {
      el.textContent = text[el.dataset.workspaceCopy];
    });
    section.querySelectorAll('[data-workspace-title]').forEach(el => { el.title = text[el.dataset.workspaceTitle]; });
    video.setAttribute('aria-label', text.recording);
    toggle.setAttribute('aria-label', paused ? text.play : text.pause);
    toggle.title = paused ? text.play : text.pause;
    toggle.dataset.paused = String(paused);
    lastTyped = '';
    render(elapsed);
  }

  function layout() {
    const bounds = diagram.getBoundingClientRect();
    const target = sink.getBoundingClientRect();
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
  function playRecording() {
    if (!permitted() || playPending || !video.paused) return;
    playPending = true;
    video.play().then(() => { if (!permitted()) video.pause(); }).catch(() => {
      // Playback remains user-controlled by the shared play button.
    }).finally(() => { playPending = false; });
  }
  function loadClip() {
    const id = clips[clipIndex];
    const format = !mp4Fallback && video.canPlayType('video/webm') ? 'webm' : 'mp4';
    videoStarted = true;
    video.dataset.clip = id;
    video.src = `assets/media/capabilities/${id}.${format}`;
    fallback.href = `assets/media/capabilities/${id}.mp4`;
    video.load();
    playRecording();
  }
  video.addEventListener('ended', () => {
    clipIndex = (clipIndex + 1) % clips.length;
    mp4Fallback = false;
    loadClip();
  });
  video.addEventListener('error', () => {
    if (!mp4Fallback && video.src.endsWith('.webm')) {
      mp4Fallback = true; loadClip();
    } else fallback.hidden = false;
  });
  video.addEventListener('canplay', playRecording);
  function sync() {
    if (permitted()) {
      if (!videoStarted) loadClip();
      else playRecording();
    } else video.pause();
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
  video.controls = false;
  video.loop = false;
  section.classList.add('workspace-enhanced');
  toggle.hidden = false;
  updateCopy(); layout();
  if ('ResizeObserver' in window) {
    const resize = new ResizeObserver(layout);
    resize.observe(diagram); resize.observe(recording); resize.observe(sink);
  } else window.addEventListener('resize', layout);
  document.fonts?.ready.then(layout);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); },
      { threshold: 0 }).observe(diagram);
  } else { visible = true; sync(); }
})();
