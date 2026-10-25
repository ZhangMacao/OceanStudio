(() => {
  'use strict';
  const copy = {
    en: {
      skip:'Skip to content', navigation:'Main navigation', navPlatform:'Platform', navWorkspace:'Human + agent', navResearch:'Autoresearch', languageLabel:'Page language',
      title:'An Extensible Platform for AI Agent-Driven Experimentation in Underwater Robotics',
      intro:'A shared workspace where researchers and AI agents compose underwater experiments, evaluate algorithms, and turn each run into the next iteration.',
      watch:'Watch the demo', explore:'Explore the project', releaseShort:'Project preview · Platform source release planned', filmTitle:'OceanStudio in action', videoLabel:'OceanStudio English demonstration film', videoFallback:'Open the English demonstration video', filmCaption:'English demonstration film', chaptersLabel:'Jump to a film chapter',
      chapterOverview:'Overview', chapterSetup:'Configuration', chapterCapabilities:'Experiments', chapterResearch:'Research loop', chapterOutro:'OceanStudio',
      platformTitle:'Composable underwater experiments', platformIntro:'Build the experiment around the research question. Configure the vehicle, its sensing and dynamics, the water around it, and the task it needs to complete.',
      configurationLabel:'Explore experiment configuration', tabRobots:'Robots & fleets', tabSensors:'Sensor layouts', tabDynamics:'Dynamics & control', tabWorlds:'Worlds & water', tabMissions:'Missions & evaluation', frameCaption:'Selected frames from the English demonstration',
      workspaceTitle:'A shared workspace for humans and agents', workspaceIntro:'Design experiments visually or operate the same platform through LLM agents. Both paths use shared experiment configurations and validation.', visualTitle:'Work visually', visualLabel:'Browser workspace', visualAlt:'OceanStudio sensor assembly and vehicle configuration', visualCopy:'Select a vehicle, attach sensors, inspect the scene, and refine the experiment in context.',
      agentTitle:'Work through an agent', examplePrompt:'Configure an AUV with depth and sonar sensing. Compare candidate controllers on an S-shaped path under the same current and evaluation criteria.', agentCopy:'Extend scenes, sensor models, and control algorithms through explicit interfaces. Namespaced plugins let new implementations coexist with existing ones.',
      pipelineLabel:'Shared experiment pipeline', sharedConfiguration:'Shared configuration', validation:'Validation', simulation:'Simulation', evaluation:'Evaluation', extensionScope:'Native axis-controller plugins can enter supported native tasks after review and explicit activation. Reference sensors, kinematics, and hydrodynamic plugins retain their own runtime requirements.',
      researchTitle:'Closed-loop underwater autoresearch', researchIntro:'Turn a research objective into an experiment loop. An agent proposes algorithms and parameters, tests candidates in simulation, evaluates the evidence, and revises the next iteration.', researchPrinciple:'Keep the task fixed. Make each revision explicit. Learn from the recorded result.', watchLoop:'See the loop in the film',
      propose:'Propose', proposeCopy:'A candidate algorithm and experiment configuration', test:'Test', testCopy:'Simulation under controlled task and environment conditions', measure:'Evaluate', measureCopy:'Recorded trajectories, errors, and independent task metrics', revise:'Revise', reviseCopy:'A new algorithm or parameter proposal for the next trial', loopReturn:'Evidence informs the next candidate',
      researchScope:'Current development scope includes bounded controller studies and reviewed plugin extensions. The film illustrates the iteration workflow; it does not establish a new optimization result.',
      releaseTitle:'Follow the next experiment.', releaseCopy:'This is the public project preview. Platform source code and installation packages have not been released. Release updates will be announced on GitHub.', follow:'Follow OceanStudio on GitHub', footer:'AI agent-driven experimentation in underwater robotics.', contact:'Discuss a research use case',
      videoError:'The video could not be loaded. Open the MP4 directly or try again.', playError:'Use the video play control to start playback.',
      features:{
        robots:{title:'A vehicle, or a fleet.',description:'Configure AUV and ROV experiments with independent initial states, sensors, physical parameters, and controllers for each robot.',details:['Torpedo and hovering vehicles','Up to four robots in a shared world','Custom AUV design-package import'],alt:'Vehicle and sensor configuration from the English demonstration'},
        sensors:{title:'Put sensing where the task needs it.',description:'Arrange supported sensors on vehicle mounting points, then set their parameters and sampling periods.',details:['RGB, sonar, pose, depth, IMU, and DVL on supported native vehicles','Mounting positions and orientations','Explicit feedback and observation availability'],alt:'Sensor assembly shown in the English demonstration'},
        dynamics:{title:'Study how the controller meets the physics.',description:'Choose supported dynamics and control combinations while keeping the experiment conditions explicit.',details:['Native Fossen and ideal rigid-body experiments','Reference six-degree-of-freedom models','PID, sliding-mode control, and linear MPC for supported cruise tasks'],alt:'Control experiment shown in the English demonstration'},
        worlds:{title:'Set the conditions around the robot.',description:'Select a compatible world, set the starting pose, and vary the water conditions around a fixed mission.',details:['World packages and spawn poses','Water appearance and visibility effects','Constant, sinusoidal, and combined sinusoidal currents'],alt:'Underwater scene and mission planning shown in the English demonstration'},
        missions:{title:'Make the objective measurable.',description:'Define the task and acceptance criteria, then inspect the recorded trajectory and task metrics.',details:['Cruise, S-shaped paths, figure-eight and approach tasks in supported pipelines','Task targets and error tolerances','Replay, actuator histories, and independent evaluation'],alt:'Mission preview shown in the English demonstration'}
      }
    },
    zh: {
      skip:'跳转到正文', navigation:'主导航', navPlatform:'实验平台', navWorkspace:'人与 Agent', navResearch:'自主研究', languageLabel:'页面语言',
      title:'面向水下机器人的可扩展 AI Agent 驱动实验平台',
      intro:'研究者与 AI Agent 共用的实验工作空间，用于组合水下实验、验证算法，并依据每次运行的结果推进下一轮研究。',
      watch:'观看演示', explore:'查看项目', releaseShort:'项目预览阶段 · 平台源码计划后续发布', filmTitle:'OceanStudio 演示', videoLabel:'OceanStudio 英文演示成片', videoFallback:'直接打开英文演示视频', filmCaption:'英文演示成片', chaptersLabel:'跳转到视频章节',
      chapterOverview:'平台概览', chapterSetup:'实验配置', chapterCapabilities:'实验能力', chapterResearch:'研究闭环', chapterOutro:'OceanStudio',
      platformTitle:'围绕研究问题，组合水下实验', platformIntro:'配置机器人、传感器与动力学，设置周围水环境，以及机器人需要完成的任务，让实验条件服务于具体研究问题。',
      configurationLabel:'浏览可配置的实验方向', tabRobots:'机器人与编队', tabSensors:'传感器布局', tabDynamics:'动力学与控制', tabWorlds:'场景与水环境', tabMissions:'任务与评估', frameCaption:'画面选自英文演示成片',
      workspaceTitle:'人与 Agent 共用的实验工作空间', workspaceIntro:'通过可视化界面搭建实验，也可以由 LLM Agent 操作同一个平台。两种方式共用实验配置与校验。', visualTitle:'可视化操作', visualLabel:'浏览器工作台', visualAlt:'OceanStudio 传感器装配与载体配置界面', visualCopy:'选择载体、装配传感器、检查场景，并结合三维预览调整实验。',
      agentTitle:'交给 Agent 操作', examplePrompt:'为一台 AUV 配置深度和声呐传感器。在相同水流及验收标准下，对 S 型路径跟踪任务比较候选控制算法。', agentCopy:'通过明确的扩展接口增加场景、传感器模型和控制算法。新实现以独立命名空间注册，与已有算法共存。',
      pipelineLabel:'共用的实验流程', sharedConfiguration:'统一实验配置', validation:'配置预检', simulation:'仿真执行', evaluation:'结果评估', extensionScope:'原生分轴控制插件经审阅和显式启用后，可进入受支持的原生任务。参考传感器、运动学和水动力插件仍需匹配各自运行环境。',
      researchTitle:'面向水下任务的闭环自主研究', researchIntro:'把研究目标转化为实验循环：Agent 提出算法与参数，在仿真中检验候选方案，分析记录中的证据，再修订下一轮实验。', researchPrinciple:'固定任务条件，明确每次修改，让运行记录支撑下一轮决策。', watchLoop:'观看视频中的研究闭环',
      propose:'提出方案', proposeCopy:'生成候选算法与对应实验配置', test:'仿真验证', testCopy:'在受控任务和环境条件下执行仿真', measure:'独立评估', measureCopy:'读取轨迹、误差和独立任务指标', revise:'修订迭代', reviseCopy:'为下一次试验提出新算法或参数方案', loopReturn:'用实验依据推进下一轮候选方案',
      researchScope:'当前开发版本支持有界控制实验与经审阅的插件扩展。视频展示迭代工作流，不据此宣称产生新的优化结果。',
      releaseTitle:'关注下一次实验。', releaseCopy:'当前为公开项目预览，平台源码和安装包尚未发布。后续发布动态将在 GitHub 公布。', follow:'在 GitHub 关注 OceanStudio', footer:'AI Agent 驱动的水下机器人实验。', contact:'交流研究应用场景',
      videoError:'视频未能加载，可直接打开 MP4 文件或稍后重试。', playError:'请使用视频播放器中的播放按钮开始播放。',
      features:{
        robots:{title:'从单机器人到多机器人实验。',description:'为 AUV 与 ROV 分别配置初始状态、传感器、物理参数和控制算法。',details:['Torpedo 与 Hovering 载体','同一世界内最多四台机器人','自定义 AUV 设计资源包导入'],alt:'英文演示中的载体与传感器配置'},
        sensors:{title:'根据任务安排感知能力。',description:'将受支持的传感器安装到载体挂点，并配置设备参数和采样周期。',details:['原生载体按运行能力支持 RGB、声呐、位姿、深度、IMU 与 DVL','安装位置和方向','明确反馈来源与观测可用性'],alt:'英文演示中的传感器装配'},
        dynamics:{title:'研究控制算法与物理模型的关系。',description:'选择受支持的动力学和控制组合，保持实验条件明确、可检查。',details:['原生 Fossen 与理想刚体实验','参考六自由度动力学模型','受支持巡航任务中的 PID、滑模与线性 MPC'],alt:'英文演示中的控制实验'},
        worlds:{title:'设定机器人周围的实验条件。',description:'选择兼容世界、设置初始位姿，在固定任务下改变水环境条件。',details:['世界包与出生位姿','水色和能见度视觉效果','固定方向、正弦与多正弦组合水流'],alt:'英文演示中的水下场景和任务规划'},
        missions:{title:'让实验目标可以被检验。',description:'明确任务与验收标准，再通过记录轨迹和任务指标检查结果。',details:['对应运行链中的定速、S 型、八字与进近任务','任务目标及误差容限','回放、执行器历史与独立评估'],alt:'英文演示中的任务预览'}
      }
    }
  };
  let language='en', feature='robots';
  const video=document.getElementById('demo-video');
  const message=document.getElementById('video-message');
  const tabs=[...document.querySelectorAll('[data-feature]')];
  function renderFeature(){
    const data=copy[language].features[feature];
    document.getElementById('feature-title').textContent=data.title;
    document.getElementById('feature-description').textContent=data.description;
    document.getElementById('feature-details').replaceChildren(...data.details.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    const image=document.getElementById('feature-image');
    image.src=`assets/images/${feature}.jpg`;image.alt=data.alt;
    document.getElementById('configuration-panel').setAttribute('aria-labelledby',`tab-${feature}`);
    tabs.forEach(tab=>{const active=tab.dataset.feature===feature;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
  }
  function setLanguage(next,updateUrl=true){
    if(!copy[next])return;language=next;
    document.documentElement.lang=next==='zh'?'zh-CN':'en';
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=copy[next][el.dataset.i18n];});
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',copy[next][el.dataset.i18nAria]));
    document.querySelectorAll('[data-i18n-alt]').forEach(el=>el.alt=copy[next][el.dataset.i18nAlt]);
    document.querySelectorAll('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===next)));
    document.title=next==='en'?'OceanStudio: An Extensible Platform for AI Agent-Driven Experimentation in Underwater Robotics':'OceanStudio · AI Agent 驱动的水下机器人实验平台';
    document.querySelector('meta[name=description]').content=copy[next].intro;
    message.textContent='';renderFeature();
    try{localStorage.setItem('oceanstudio-site-language',next);}catch{}
    if(updateUrl){const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(null,'',url);}
  }
  let initial='en';
  try{initial=new URL(location.href).searchParams.get('lang')||localStorage.getItem('oceanstudio-site-language')||'en';}catch{}
  setLanguage(copy[initial]?initial:'en',false);
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>{feature=tab.dataset.feature;renderFeature();});
    tab.addEventListener('keydown',event=>{
      const target=event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:null;
      if(target===null)return;event.preventDefault();tabs[target].focus();tabs[target].click();
    });
  });
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
