/* Capability previews share the page language without replacing playing media. */
(() => {
  'use strict';
  const labels = {
    en: {
      hint: 'Explore the settings, then see how the platform grows. Select any clip for a larger view.',
      configure: 'Configure', configureIntro: 'Shape the robot, environment and experiment around your question.',
      extend: 'Extend', extendIntro: 'Add resources and independent implementations through supported interfaces.',
      scopeTitle: 'Extensions coexist with the defaults.',
      scopeCopy: 'New algorithms use their own files and type IDs. Reference plugins and native plugins have different runtime contracts. General evaluation-metric and frontend-panel plugins are not yet available.',
      pause: 'Pause previews', play: 'Play previews', close: 'Close video', download: 'Download clip',
      open: 'View video: ', unavailable: 'Preview unavailable. Select the clip to open the video.',
      loadError: 'Clip descriptions could not be loaded. The English previews remain available.',
      ui: 'UI capture', cli: 'CLI capture', replay: 'UI + new run replay', setup: 'Import setup', inspection: 'Package checks + UI', seconds: 's'
    },
    zh: {
      hint: '先看如何配置，再看如何扩展。点击任意短片可放大观看。',
      configure: '可配置', configureIntro: '围绕研究问题，调整机器人、环境与实验条件。',
      extend: '可新增', extendIntro: '通过已支持的接口，增加资源与独立算法实现。',
      scopeTitle: '新实现与默认算法共存。',
      scopeCopy: '新增算法使用独立文件和类型 ID。参考插件与原生插件有各自的运行契约。通用评估指标和前端面板插件尚未开放。',
      pause: '暂停预览', play: '播放预览', close: '关闭视频', download: '下载短片',
      open: '观看短片：', unavailable: '预览暂不可用，可点击直接打开视频。',
      loadError: '短片说明加载失败，仍可查看英文卡片和视频。',
      ui: '界面实录', cli: 'CLI 实录', replay: '界面与新实验回放', setup: '导入入口', inspection: '包检查与界面', seconds: '秒'
    }
  };
  let language = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const cards = [...document.querySelectorAll('[data-capability]')];
  const toggle = document.getElementById('preview-toggle');
  const dialog = document.getElementById('clip-dialog');
  const dialogVideo = document.getElementById('clip-dialog-video');
  const mainVideo = document.getElementById('demo-video');
  const status = document.getElementById('gallery-status');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let autoPlay = !motion.matches;
  try { if (!motion.matches) autoPlay = localStorage.getItem('oceanstudio-preview-motion') !== 'paused'; } catch {}
  let items = new Map(), opened = null, origin = null;
  const visible = new Map();

  function translate() {
    const text = labels[language];
    document.querySelectorAll('[data-gallery-copy]').forEach(el => {
      el.textContent = text[el.dataset.galleryCopy];
    });
    toggle.textContent = autoPlay ? text.pause : text.play;
    toggle.setAttribute('aria-pressed', String(autoPlay));
    cards.forEach(card => {
      const data = items.get(card.dataset.capability);
      if (!data) return;
      card.querySelector('h4').textContent = data.title[language];
      card.querySelector('.capability-description').textContent = data.description[language];
      card.querySelector('.capability-scope').textContent = data.scope[language];
      card.querySelector('.clip-kind').textContent = text[data.kind] + (data.playback_rate > 1 ? ` · ${data.playback_rate}×` : '');
      card.querySelector('.clip-duration').textContent = `${Math.round(data.duration)}${text.seconds}`;
      card.querySelector('.clip-open').setAttribute('aria-label', text.open + data.title[language]);
      card.querySelector('video').setAttribute('aria-label', data.title[language]);
      const error = card.querySelector('.clip-error');
      if (error) error.textContent = text.unavailable;
    });
    if (opened) translateDialog();
  }

  function translateDialog() {
    document.getElementById('clip-dialog-title').textContent = opened.title[language];
    document.getElementById('clip-dialog-description').textContent = opened.description[language];
    document.getElementById('clip-dialog-scope').textContent = opened.scope[language];
    dialogVideo.setAttribute('aria-label', opened.title[language]);
  }

  function pausePreviews() {
    cards.forEach(card => card.querySelector('video').pause());
  }

  function load(card) {
    const video = card.querySelector('video');
    const data = items.get(card.dataset.capability);
    if (data && !video.getAttribute('src')) {
      video.src = playbackSource(video,data);
      video.load();
    }
    return video;
  }

  function playbackSource(video,data) {
    return data.preview_video && video.canPlayType('video/webm; codecs="vp9"') ? data.preview_video : data.video;
  }

  function syncPlayback() {
    const permitted = autoPlay && !document.hidden && !dialog.open && mainVideo.paused;
    // Bound decoding work even when a large desktop shows many previews at once.
    const playing = permitted ? [...visible].sort((a,b) => b[1]-a[1]).slice(0,4).map(([card])=>card) : [];
    cards.forEach(card => {
      const video = card.querySelector('video');
      if (playing.includes(card)) {
        load(card);
        if (video.paused) video.play().catch(() => {});
      } else video.pause();
    });
  }

  cards.forEach(card => {
    const link = card.querySelector('.clip-open');
    const video = card.querySelector('video');
    video.addEventListener('error', () => {
      if (card.querySelector('.clip-error')) return;
      const error = document.createElement('span');
      error.className = 'clip-error';
      error.textContent = labels[language].unavailable;
      error.setAttribute('role','status');
      link.append(error);
    });
    link.addEventListener('click', event => {
      const data = items.get(link.dataset.clip);
      if (!data || typeof dialog.showModal !== 'function') return;
      event.preventDefault();
      opened = data; origin = link;
      translateDialog();
      document.getElementById('clip-download').href = data.video;
      pausePreviews(); mainVideo.pause();
      dialogVideo.src = playbackSource(dialogVideo,data);
      dialog.showModal();
      dialogVideo.play().catch(() => {});
    });
  });

  document.getElementById('clip-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    dialogVideo.pause(); dialogVideo.removeAttribute('src'); dialogVideo.load();
    opened = null;
    if (origin?.isConnected) origin.focus({preventScroll:true});
    syncPlayback();
  });
  toggle.addEventListener('click', () => {
    autoPlay = !autoPlay;
    try { localStorage.setItem('oceanstudio-preview-motion', autoPlay ? 'playing' : 'paused'); } catch {}
    translate(); syncPlayback();
  });
  motion.addEventListener('change', event => {
    if (event.matches) autoPlay = false;
    translate(); syncPlayback();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) dialogVideo.pause();
    syncPlayback();
  });
  mainVideo.addEventListener('play', pausePreviews);
  mainVideo.addEventListener('pause', syncPlayback);
  mainVideo.addEventListener('ended', syncPlayback);
  document.addEventListener('oceanstudio:language', event => {
    language = event.detail.language;
    translate();
  });

  translate();
  fetch('assets/media/capabilities/manifest.json').then(response => {
    if (!response.ok) throw Error('manifest unavailable');
    return response.json();
  }).then(manifest => {
    items = new Map(manifest.items.map(data => [data.id,data]));
    translate(); toggle.disabled = false;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visible.set(entry.target,entry.intersectionRatio);
          else visible.delete(entry.target);
        });
        syncPlayback();
      }, {threshold:[0,.2,.5,.8]});
      cards.forEach(card=>observer.observe(card));
    }
    // Without an observer, clips remain available on click without loading every video.
  }).catch(() => { status.textContent = labels[language].loadError; });
})();
