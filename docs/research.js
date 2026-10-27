(() => {
  'use strict';
  const section = document.getElementById('autoresearch');
  if (!section) return;
  const video = document.getElementById('docking-video');
  const motion = document.getElementById('research-motion');
  const diagram = section.querySelector('.autoresearch-loop');
  const paths = [...section.querySelectorAll('[data-research-flow]')];
  const packets = [...section.querySelectorAll('[data-research-packet]')];
  const tabs = [...section.querySelectorAll('[data-trial]')];
  const mainFilm = document.getElementById('demo-video');
  const clipDialog = document.getElementById('clip-dialog');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const copy = {
    en: {
      loopLabel:'A goal passes to an agent, experiment setup, simulation, evaluation, and back to the agent.',
      goalLabel:'Describe your goal',goal:'Dock the AUV. Keep the task and current fixed.',analysis:'Analyze & improve',analysisCopy:'Evaluate · Compare · Revise',setup:'Experiment setup',vehicle:'Vehicle',task:'Task',docking:'Funnel docking',design:'Design',algorithms:'Guidance & control',run:'Run simulation',
      caseTitle:'One docking task. Three iterations.',fixed:'Same yellow AUV · Same dock · Same steady current',trialsLabel:'Docking experiment iterations',
      trial0:'Establish a baseline',trial1:'Add compensation',trial2:'Coordinate the feedback',notMet:'Not met',passed:'Docked & stable',
      agentRevision:'Agent revision',revision0:'LOS guidance with proportional speed control.',revision1:'Refine alignment and the terminal speed profile.',revision2:'Add model-based compensation and active braking.',
      next0:'Inspect the trajectory and residual error to choose the next revision.',next1:'Use the remaining position and speed error to revise terminal control.',next2:'Retain the successful candidate and its original experiment record.',
      finalError:'Final position error',finalSpeed:'Final speed',stableHold:'Continuous stable hold',positionError:'Position error · log scale',chartLabel:'Position error versus experiment time, on a logarithmic scale',
      criterion:'Success: within 0.15 m, below 0.10 m/s, aligned within 5°, for 3 seconds.',method:'Experiment details ↗',rate:'Native UE · 2× playback',openVideo:'Open video',pause:'Pause animation & previews',resume:'Play animation & previews',
      videoLabel:'Yellow torpedo AUV docking experiment',
    },
    zh: {
      loopLabel:'目标交给 Agent，配置实验、运行仿真、评估结果，再反馈给 Agent 修改方案。',
      goalLabel:'描述研究目标',goal:'让 AUV 完成对接。固定任务与水流，持续优化方案。',analysis:'Agent 分析与优化',analysisCopy:'评估 · 对比 · 修订',setup:'配置实验',vehicle:'机器人',task:'任务',docking:'喇叭坞站对接',design:'算法',algorithms:'引导与动力学控制',run:'运行仿真',
      caseTitle:'同一个对接任务，逐轮改进。',fixed:'同一黄色 AUV · 同一坞站 · 同一恒定水流',trialsLabel:'对接实验迭代',
      trial0:'建立基线',trial1:'加入抗扰与制动',trial2:'反馈协同调优',notMet:'未达标',passed:'对接并稳定',
      agentRevision:'Agent 修改方案',revision0:'LOS 引导，配合比例航速控制。',revision1:'优化对准策略与末段减速曲线。',revision2:'加入模型补偿与主动制动。',
      next0:'检查轨迹与残余误差，决定下一轮修改。',next1:'根据剩余的位置与速度误差，修订末段控制。',next2:'保留通过验收的候选方案及原始实验记录。',
      finalError:'最终位置误差',finalSpeed:'最终速度',stableHold:'连续稳定保持',positionError:'位置误差 · 对数尺度',chartLabel:'位置误差随实验时间变化，对数纵轴',
      criterion:'成功判据：误差 ≤ 0.15 m、速度 ≤ 0.10 m/s、航向误差 ≤ 5°，持续 3 秒。',method:'实验详情 ↗',rate:'原生 UE · 2 倍速',openVideo:'直接播放视频',pause:'暂停动画与预览',resume:'播放动画与预览',
      videoLabel:'黄色鱼雷形 AUV 坞站对接实验',
    },
  };
  let language = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  let selected = 0, study, visible = false, diagramVisible = false;
  let stopped = reduced.matches, clock = 0, last = 0, raf = 0, loaded = false;
  let ignorePauseUntil = 0, changing = false, sourceFallback = false;
  const eligible = () => !stopped && !document.hidden && !clipDialog?.open && (mainFilm?.paused ?? true);
  function labelMotion() {
    motion.setAttribute('aria-pressed', String(stopped));
    motion.setAttribute('aria-label', copy[language][stopped ? 'resume' : 'pause']);
    motion.title = motion.getAttribute('aria-label');
  }
  function translate() {
    section.querySelectorAll('[data-research]').forEach(el => {
      const value = copy[language][el.dataset.research];
      if (value !== undefined) el.textContent = value;
    });
    section.querySelectorAll('[data-research-aria]').forEach(el => el.setAttribute('aria-label', copy[language][el.dataset.researchAria]));
    video.setAttribute('aria-label', copy[language].videoLabel);
    labelMotion(); renderEvidence(); requestAnimationFrame(connect);
  }
  function renderEvidence() {
    if (!study) return;
    const trial = study.trials[selected], c = copy[language];
    const verdict = document.getElementById('docking-verdict');
    verdict.textContent = trial.verdict === 'passed' ? c.passed : c.notMet;
    verdict.dataset.verdict = trial.verdict;
    document.getElementById('docking-revision').textContent = trial.revision?.[language] || c['revision' + selected];
    document.getElementById('docking-next').textContent = trial.analysis?.[language] || c['next' + selected];
    document.getElementById('docking-error').textContent = trial.final_position_error_m.toFixed(3) + ' m';
    document.getElementById('docking-speed').textContent = trial.final_speed_mps.toFixed(3) + ' m/s';
    document.getElementById('docking-hold').textContent = trial.max_continuous_hold_s.toFixed(2) + ' s';
    tabs.forEach((tab, i) => { tab.querySelector('em').textContent = study.trials[i].verdict === 'passed' ? c.passed : c.notMet; });
    const duration = study.duration_s;
    const y = value => 12 + (Math.log10(20) - Math.log10(Math.max(.005, value))) / (Math.log10(20) - Math.log10(.005)) * 110;
    const points = trial.error_curve.map(([t, e]) => [(28 + t / duration * 362), y(e)]);
    document.getElementById('docking-curve').setAttribute('d', points.map(([x, yy], i) => (i ? 'L' : 'M') + x.toFixed(2) + ' ' + yy.toFixed(2)).join(''));
    const threshold = y(study.criteria.position_m);
    document.getElementById('docking-threshold').setAttribute('d', `M28 ${threshold}H390`);
    document.querySelector('#docking-chart text:last-child').textContent = duration + ' s';
    playhead();
  }
  function playhead() {
    if (!study) return;
    const t = Math.min(study.duration_s, video.currentTime * study.playback_rate);
    const x = 28 + t / study.duration_s * 362;
    document.getElementById('docking-playhead').setAttribute('d', `M${x} 12V122`);
  }
  function pauseVideo() { ignorePauseUntil = performance.now() + 300; video.pause(); }
  function choose(index, focus = false) {
    selected = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === selected));
      tab.tabIndex = i === selected ? 0 : -1;
    });
    if (focus) tabs[selected].focus();
    document.getElementById('docking-panel').setAttribute('aria-labelledby', tabs[selected].id);
    const id = 'round-0' + (selected + 1);
    pauseVideo(); changing = true; sourceFallback = false;
    video.poster = `assets/images/docking/${id}.jpg`;
    video.src = `assets/media/docking/${id}.mp4`;
    document.getElementById('docking-fallback').href = video.src;
    document.getElementById('docking-fallback').hidden = true;
    video.load(); loaded = true; renderEvidence();
    if (eligible() && visible) video.play().catch(() => {});
    changing = false;
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => choose(i));
    tab.addEventListener('keydown', event => {
      const keys = ['ArrowLeft','ArrowRight','Home','End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      choose(event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : i + (event.key === 'ArrowRight' ? 1 : -1), true);
    });
  });
  video.addEventListener('timeupdate', playhead);
  video.addEventListener('ended', () => { if (eligible()) choose(selected + 1); });
  video.addEventListener('pause', () => {
    if (!changing && !video.ended && visible && eligible() && performance.now() > ignorePauseUntil) { stopped = true; labelMotion(); synchronize(); }
  });
  video.addEventListener('play', () => {
    if (stopped && visible) { stopped = false; labelMotion(); synchronize(); }
  });
  video.addEventListener('error', () => {
    // A playable native-controls fallback and direct link remain available.
    if (sourceFallback) return;
    sourceFallback = true;
    document.getElementById('docking-fallback').hidden = false;
  });
  function rect(id) {
    const r = document.getElementById(id).getBoundingClientRect(), base = diagram.getBoundingClientRect();
    return { l:r.left-base.left,r:r.right-base.left,t:r.top-base.top,b:r.bottom-base.top,x:r.left-base.left+r.width/2,y:r.top-base.top+r.height/2 };
  }
  function connect() {
    const g = rect('loop-goal'), a = rect('loop-agent'), s = rect('loop-setup'), r = rect('loop-simulation'), o = rect('loop-analysis');
    const mobile = matchMedia('(max-width:600px)').matches;
    const tablet = !mobile && matchMedia('(max-width:850px)').matches;
    let routes;
    if (mobile) {
      const side = 6, right = diagram.clientWidth - 5;
      routes = [
        `M${g.x} ${g.b}V${a.t-15}Q${g.x} ${a.t-5} ${a.x} ${a.t-5}V${a.t-2}`,
        `M${a.r} ${a.y}H${right}V${s.t-22}Q${right} ${s.t-12} ${right-10} ${s.t-12}H${s.x+8}Q${s.x} ${s.t-12} ${s.x} ${s.t-4}V${s.t-2}`,
        `M${s.x} ${s.b}V${r.t-2}`,
        `M${r.l} ${r.y}H${side}V${o.y}H${o.l-2}`,
        `M${o.x} ${o.t}V${a.b+2}`,
      ];
    } else if (tablet) {
      routes = [
        `M${g.x-70} ${g.b}C${g.x-70} ${a.t-8} ${a.x} ${a.t-20} ${a.x} ${a.t-2}`,
        `M${a.r} ${a.y}C${a.r+14} ${a.y} ${s.l-14} ${s.y} ${s.l-2} ${s.y}`,
        `M${s.x} ${s.b}V${r.t-2}`,
        `M${r.l} ${r.y}C${r.l-15} ${r.y} ${o.r+15} ${o.y} ${o.r+2} ${o.y}`,
        `M${o.x} ${o.t}V${a.b+2}`,
      ];
    } else {
      routes = [
        `M${g.r} ${g.y}C${g.r+22} ${g.y} ${a.l-22} ${a.y} ${a.l-2} ${a.y}`,
        `M${a.r} ${a.y}C${a.r+25} ${a.y} ${s.l-25} ${s.y} ${s.l-2} ${s.y}`,
        `M${s.x} ${s.b}V${r.t-2}`,
        `M${r.l} ${r.y}C${r.l-25} ${r.y} ${o.r+25} ${o.y} ${o.r+2} ${o.y}`,
        `M${o.x} ${o.t}V${a.b+2}`,
      ];
    }
    paths.forEach((path,i) => path.setAttribute('d', routes[i]));
  }
  function animate(now) {
    if (!eligible() || !diagramVisible) { raf = 0; last = 0; return; }
    if (last) clock += Math.min(now-last,80);
    last = now;
    const phase = clock % 12000 / 12000;
    const nodeIds = ['loop-goal','loop-agent','loop-setup','loop-simulation','loop-analysis'];
    nodeIds.forEach((id,i) => document.getElementById(id).dataset.active = String(Math.floor(phase*5) === i));
    packets.forEach((packet,i) => {
      const p = (phase + i*.42) % 1 * 5, index = Math.floor(p), path = paths[index];
      try { const point = path.getPointAtLength(path.getTotalLength() * (p-index)); packet.setAttribute('cx',point.x);packet.setAttribute('cy',point.y);packet.style.opacity='1'; } catch {}
    });
    raf = requestAnimationFrame(animate);
  }
  function synchronize() {
    if (eligible() && diagramVisible && !raf) raf = requestAnimationFrame(animate);
    if (!eligible() || !diagramVisible) {
      if (raf) cancelAnimationFrame(raf); raf=0;last=0;
      packets.forEach(p => p.style.opacity='0');
      section.querySelectorAll('[data-active]').forEach(n => n.dataset.active='false');
    }
    if (eligible() && visible) {
      if (!loaded) choose(selected);
      else if (video.paused && !video.ended) video.play().catch(() => {});
    } else pauseVideo();
  }
  motion.hidden = false;
  motion.addEventListener('click', () => { stopped = !stopped; labelMotion(); synchronize(); });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; synchronize(); }, {threshold:.15}).observe(video);
  new IntersectionObserver(entries => { diagramVisible = entries[0].isIntersecting; synchronize(); }, {threshold:.1}).observe(diagram);
  new ResizeObserver(connect).observe(diagram);
  document.fonts.ready.then(connect);
  document.addEventListener('visibilitychange', synchronize);
  mainFilm?.addEventListener('play', synchronize); mainFilm?.addEventListener('pause', synchronize);
  if (clipDialog) new MutationObserver(synchronize).observe(clipDialog,{attributes:true,attributeFilter:['open']});
  reduced.addEventListener('change', () => { stopped=reduced.matches;labelMotion();synchronize(); });
  document.addEventListener('oceanstudio:language', event => { language = event.detail.language; translate(); });
  fetch('assets/media/docking/study.json?v=20261027-torpedo').then(r => {if(!r.ok)throw Error('study unavailable');return r.json();}).then(data => {study=data;renderEvidence();}).catch(() => {});
  translate(); connect();
})();
