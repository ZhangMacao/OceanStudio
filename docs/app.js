(() => {
  'use strict';
  const copy = {
    en: {
      skip:'Skip to content', navigation:'Main navigation', navPlatform:'Platform', navWorkspace:'Human + agent', navResearch:'Autoresearch', languageLabel:'Page language',
      title:'An Extensible Platform for AI Agent-Driven Experimentation in Underwater Robotics',
      intro:'A shared workspace where researchers and AI agents compose underwater experiments, evaluate algorithms, and turn each run into the next iteration.',
      watch:'Watch the demo', explore:'Explore the project', releaseShort:'Project preview · Platform source release planned', filmTitle:'OceanStudio in action', videoLabel:'OceanStudio English demonstration film', videoFallback:'Open the English demonstration video', filmCaption:'English demonstration film', chaptersLabel:'Jump to a film chapter',
      chapterOverview:'Overview', chapterSetup:'Configuration', chapterCapabilities:'Experiments', chapterResearch:'Research loop', chapterOutro:'OceanStudio',
      platformTitle:'Composable underwater experiments', platformIntro:'Configure a complete underwater experiment, or extend it with new resources and algorithms. See each capability in a focused recording of the current platform.',
      workspaceTitle:'A shared workspace for humans and agents', visualTitle:'Work visually', agentTitle:'Work through an agent',
      researchTitle:'Closed-loop underwater autoresearch', researchIntro:'Turn a research objective into an experiment loop. An agent proposes algorithms and parameters, tests candidates in simulation, evaluates the evidence, and revises the next iteration.', researchPrinciple:'Keep the task fixed. Make each revision explicit. Learn from the recorded result.', watchLoop:'See the loop in the film',
      propose:'Propose', proposeCopy:'A candidate algorithm and experiment configuration', test:'Test', testCopy:'Simulation under controlled task and environment conditions', measure:'Evaluate', measureCopy:'Recorded trajectories, errors, and independent task metrics', revise:'Revise', reviseCopy:'A new algorithm or parameter proposal for the next trial', loopReturn:'Evidence informs the next candidate',
      researchScope:'Current development scope includes bounded controller studies and reviewed plugin extensions. The film illustrates the iteration workflow; it does not establish a new optimization result.',
      releaseTitle:'Follow the next experiment.', releaseCopy:'This is the public project preview. Platform source code and installation packages have not been released. Release updates will be announced on GitHub.', follow:'Follow OceanStudio on GitHub', footer:'AI agent-driven experimentation in underwater robotics.', contact:'Discuss a research use case',
      videoError:'The video could not be loaded. Open the MP4 directly or try again.', playError:'Use the video play control to start playback.',
    },
    zh: {
      skip:'跳转到正文', navigation:'主导航', navPlatform:'实验平台', navWorkspace:'人与 Agent', navResearch:'自主研究', languageLabel:'页面语言',
      title:'面向水下机器人的可扩展 AI Agent 驱动实验平台',
      intro:'研究者与 AI Agent 共用的实验工作空间，用于组合水下实验、验证算法，并依据每次运行的结果推进下一轮研究。',
      watch:'观看演示', explore:'查看项目', releaseShort:'项目预览阶段 · 平台源码计划后续发布', filmTitle:'OceanStudio 演示', videoLabel:'OceanStudio 英文演示成片', videoFallback:'直接打开英文演示视频', filmCaption:'英文演示成片', chaptersLabel:'跳转到视频章节',
      chapterOverview:'平台概览', chapterSetup:'实验配置', chapterCapabilities:'实验能力', chapterResearch:'研究闭环', chapterOutro:'OceanStudio',
      platformTitle:'围绕研究问题，组合水下实验', platformIntro:'围绕研究问题配置水下实验，也能通过资源与算法扩展增加新能力。每张卡片用最新平台的独立实录展示一个功能。',
      workspaceTitle:'人与 Agent 共用的实验工作空间', visualTitle:'可视化操作', agentTitle:'交给 Agent 操作',
      researchTitle:'面向水下任务的闭环自主研究', researchIntro:'把研究目标转化为实验循环：Agent 提出算法与参数，在仿真中检验候选方案，分析记录中的证据，再修订下一轮实验。', researchPrinciple:'固定任务条件，明确每次修改，让运行记录支撑下一轮决策。', watchLoop:'观看视频中的研究闭环',
      propose:'提出方案', proposeCopy:'生成候选算法与对应实验配置', test:'仿真验证', testCopy:'在受控任务和环境条件下执行仿真', measure:'独立评估', measureCopy:'读取轨迹、误差和独立任务指标', revise:'修订迭代', reviseCopy:'为下一次试验提出新算法或参数方案', loopReturn:'用实验依据推进下一轮候选方案',
      researchScope:'当前开发版本支持有界控制实验与经审阅的插件扩展。视频展示迭代工作流，不据此宣称产生新的优化结果。',
      releaseTitle:'关注下一次实验。', releaseCopy:'当前为公开项目预览，平台源码和安装包尚未发布。后续发布动态将在 GitHub 公布。', follow:'在 GitHub 关注 OceanStudio', footer:'AI Agent 驱动的水下机器人实验。', contact:'交流研究应用场景',
      videoError:'视频未能加载，可直接打开 MP4 文件或稍后重试。', playError:'请使用视频播放器中的播放按钮开始播放。',
    }
  };
  let language='en';
  const video=document.getElementById('demo-video');
  const message=document.getElementById('video-message');
  function setLanguage(next,updateUrl=true){
    if(!copy[next])return;language=next;
    document.documentElement.lang=next==='zh'?'zh-CN':'en';
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=copy[next][el.dataset.i18n];});
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',copy[next][el.dataset.i18nAria]));
    document.querySelectorAll('[data-i18n-alt]').forEach(el=>el.alt=copy[next][el.dataset.i18nAlt]);
    document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===next)));
    document.title=next==='en'?'OceanStudio: An Extensible Platform for AI Agent-Driven Experimentation in Underwater Robotics':'OceanStudio · AI Agent 驱动的水下机器人实验平台';
    document.querySelector('meta[name=description]').content=copy[next].intro;
    message.textContent='';
    document.dispatchEvent(new CustomEvent('oceanstudio:language',{detail:{language:next}}));
    try{localStorage.setItem('oceanstudio-site-language',next);}catch{}
    if(updateUrl){const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(null,'',url);}
  }
  let initial='en';
  try{initial=new URL(location.href).searchParams.get('lang')||localStorage.getItem('oceanstudio-site-language')||'en';}catch{}
  setLanguage(copy[initial]?initial:'en',false);
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
  let seekRequest=0;
  async function seekTo(time){
    const request=++seekRequest;message.textContent='';
    try{
      if(video.error)throw Error('video unavailable');
      if(video.readyState<1)await new Promise((resolve,reject)=>{
        const clean=()=>{clearTimeout(timer);video.removeEventListener('loadedmetadata',loaded);video.removeEventListener('error',failed);};
        const loaded=()=>{clean();resolve();};const failed=()=>{clean();reject(Error('video unavailable'));};
        const timer=setTimeout(failed,15000);video.addEventListener('loadedmetadata',loaded);video.addEventListener('error',failed);video.load();
      });
      if(request!==seekRequest)return;
      video.currentTime=Math.min(time,Math.max(0,video.duration-.1));
      video.focus({preventScroll:true});
      try{await video.play();}catch{message.textContent=copy[language].playError;}
    }catch{message.textContent=copy[language].videoError;}
  }
  document.querySelectorAll('[data-time]').forEach(button=>button.addEventListener('click',()=>seekTo(Number(button.dataset.time))));
  document.getElementById('watch-demo').addEventListener('click',()=>seekTo(video.currentTime||0));
  document.getElementById('watch-loop').addEventListener('click',()=>seekTo(93.5));
  video.addEventListener('error',()=>{message.textContent=copy[language].videoError;});
  const chapters=[...document.querySelectorAll('[data-time]')];
  video.addEventListener('timeupdate',()=>{
    const active=chapters.findLast(button=>Number(button.dataset.time)<=video.currentTime);
    chapters.forEach(button=>{if(button===active)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');});
  });
})();
