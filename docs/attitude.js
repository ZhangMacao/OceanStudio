(() => {
  'use strict';
  const section = document.getElementById('attitude-case');
  if (!section) return;
  const video = document.getElementById('attitude-video');
  const dock = document.getElementById('docking-video');
  const main = document.getElementById('demo-video');
  const dialog = document.getElementById('clip-dialog');
  const motion = document.getElementById('research-motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tabs = [...section.querySelectorAll('[data-attitude-trial]')];
  const copy = {
    en: {heading:'Steady ROV attitude from IMU feedback.',tabs:'ROV attitude-control iterations',trial0:'PID baseline',trial1:'Sliding-mode control',trial2:'Disturbance observer',rate:'Native UE · 2× playback',open:'Open video',revision:'Agent revision',rms:'Attitude RMS',p95:'Attitude P95',angularRate:'Angular-rate RMS',chart:'Roll & pitch error',chartLabel:'Combined roll and pitch error over experiment time',passed:'Stable',notMet:'Needs improvement',video:'ROV IMU attitude-control experiment',unavailable:'Experiment media unavailable'},
    zh: {heading:'基于 IMU 反馈的 ROV 抗扰稳姿。',tabs:'ROV 姿态控制迭代',trial0:'PID 基线',trial1:'滑模抗扰',trial2:'扰动观测补偿',rate:'原生 UE · 2 倍速',open:'直接播放视频',revision:'Agent 修改方案',rms:'姿态均方根误差',p95:'姿态误差 P95',angularRate:'角速度均方根',chart:'横滚与俯仰误差',chartLabel:'横滚与俯仰综合误差随实验时间变化',passed:'姿态稳定',notMet:'仍需改进',video:'ROV IMU 姿态抗扰实验',unavailable:'实验媒体暂不可用'},
  };
  let language = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  let study, selected = 0, visible = false, loaded = false, changing = false;
  let ignorePauseUntil = 0;
  const stopped = () => reduced.matches && !loaded || motion.getAttribute('aria-pressed') === 'true';
  const eligible = () => !stopped() && !document.hidden && !dialog?.open && (main?.paused ?? true) && (dock?.paused ?? true);
  function label() {
    const c = copy[language];
    section.querySelectorAll('[data-attitude]').forEach(el => { if (c[el.dataset.attitude]) el.textContent = c[el.dataset.attitude]; });
    section.querySelectorAll('[data-attitude-aria]').forEach(el => el.setAttribute('aria-label', c[el.dataset.attitudeAria]));
    video.setAttribute('aria-label',c.video);
    render();
  }
  function render() {
    if (!study) return;
    const t = study.trials[selected], c = copy[language];
    const verdict = document.getElementById('attitude-verdict');
    verdict.textContent = t.verdict === 'passed' ? c.passed : c.notMet;
    verdict.dataset.verdict = t.verdict;
    document.getElementById('attitude-revision').textContent = t.revision[language];
    document.getElementById('attitude-rms').textContent = t.tilt_rms_deg.toFixed(2) + '°';
    document.getElementById('attitude-p95').textContent = t.tilt_p95_deg.toFixed(2) + '°';
    document.getElementById('attitude-rate').textContent = t.rate_rms_deg_s.toFixed(2) + '°/s';
    tabs.forEach((tab,i) => {
      const e = tab.querySelector('em'), outcome = study.trials[i].verdict;
      e.textContent = outcome === 'passed' ? c.passed : c.notMet; e.dataset.verdict = outcome;
    });
    const top = Math.max(3,...study.trials.flatMap(x => x.tilt_curve.map(p => p[1]))) * 1.1;
    document.getElementById('attitude-curve').setAttribute('d',t.tilt_curve.map(([time,error],i) => `${i?'L':'M'}${(28+362*time/study.duration_s).toFixed(2)} ${(122-110*error/top).toFixed(2)}`).join(''));
    document.querySelector('#attitude-chart text:last-child').textContent = study.duration_s + ' s';
    playhead();
  }
  function playhead() {
    if (!study) return;
    const x=28+362*Math.min(study.duration_s,video.currentTime*study.playback_rate)/study.duration_s;
    document.getElementById('attitude-playhead').setAttribute('d',`M${x} 12V122`);
  }
  function pause() { ignorePauseUntil=performance.now()+350;video.pause(); }
  function choose(index,focus=false) {
    document.dispatchEvent(new CustomEvent('oceanstudio:study-focus',{detail:{id:'attitude'}}));
    selected=(index+tabs.length)%tabs.length;
    tabs.forEach((tab,i) => { tab.setAttribute('aria-selected',String(i===selected));tab.tabIndex=i===selected?0:-1; });
    if(focus)tabs[selected].focus();
    document.getElementById('attitude-panel').setAttribute('aria-labelledby',tabs[selected].id);
    changing=true;pause();
    const name='round-0'+(selected+1);
    video.poster=`assets/images/attitude/${name}.jpg?v=20261102`;
    video.src=`assets/media/attitude/${name}.mp4?v=20261102`;
    const fallback=document.getElementById('attitude-fallback');fallback.href=video.src;fallback.hidden=true;
    video.load();loaded=true;render();changing=false;
    if(visible&&eligible())video.play().catch(()=>{});
  }
  function sync() {
    if(visible&&eligible()) {
      if(!loaded)choose(selected);
      else if(video.paused&&!video.ended)video.play().catch(()=>{});
    } else pause();
  }
  tabs.forEach((tab,i) => {
    tab.addEventListener('click',()=>choose(i));
    tab.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();choose(e.key==='Home'?0:e.key==='End'?tabs.length-1:i+(e.key==='ArrowRight'?1:-1),true);
    });
  });
  video.addEventListener('timeupdate',playhead);
  video.addEventListener('ended',()=>{if(eligible())choose(selected+1);});
  video.addEventListener('play',()=>{
    loaded=true;
    document.dispatchEvent(new CustomEvent('oceanstudio:study-focus',{detail:{id:'attitude'}}));
    if(motion.getAttribute('aria-pressed')==='true')motion.click();
  });
  video.addEventListener('pause',()=>{
    if(!changing&&!video.ended&&visible&&motion.getAttribute('aria-pressed')!=='true'&&performance.now()>ignorePauseUntil)motion.click();
  });
  video.addEventListener('error',()=>{document.getElementById('attitude-fallback').hidden=false;});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.15}).observe(video);
  new MutationObserver(sync).observe(motion,{attributes:true,attributeFilter:['aria-pressed']});
  if(dialog)new MutationObserver(sync).observe(dialog,{attributes:true,attributeFilter:['open']});
  [main,dock].forEach(v=>{v?.addEventListener('play',sync);v?.addEventListener('pause',sync);});
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('oceanstudio:study-focus',event=>{if(event.detail.id==='docking')pause();});
  reduced.addEventListener('change',()=>{if(reduced.matches)pause();else sync();});
  document.addEventListener('oceanstudio:language',event=>{language=event.detail.language;label();});
  fetch('assets/media/attitude/study.json?v=20261102').then(r=>{if(!r.ok)throw Error('unavailable');return r.json();}).then(data=>{study=data;render();}).catch(()=>{document.getElementById('attitude-verdict').textContent=copy[language].unavailable;});
  label();
})();
