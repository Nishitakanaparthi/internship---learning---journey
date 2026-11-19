(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  // Year
  $('#yr').textContent=new Date().getFullYear();

  // Theme
  const root=document.documentElement, tbtn=$('#theme');
  let saved=null; try{saved=localStorage.getItem('nhs-theme')}catch(e){}
  if(!saved) saved=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  const setTheme=t=>{root.dataset.theme=t;tbtn.textContent=t==='dark'?'☀️':'🌙';try{localStorage.setItem('nhs-theme',t)}catch(e){}};
  setTheme(saved);
  tbtn.onclick=()=>setTheme(root.dataset.theme==='dark'?'light':'dark');

  // Mobile menu
  const menu=$('#menu');
  $('#burger').onclick=()=>menu.classList.toggle('open');
  $$('#menu a').forEach(a=>a.onclick=()=>menu.classList.remove('open'));

  // Stars
  const st=$('#stars');
  for(let i=0;i<40;i++){const s=document.createElement('i');s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*85}%;animation-delay:${Math.random()*3}s`;st.appendChild(s)}

  // Reveal + counters
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.classList.add('in');
    $$('[data-count]',e.target).forEach(c=>{
      const end=+c.dataset.count, plus=c.dataset.plus?'+':'', t0=performance.now();
      const tick=t=>{const p=Math.min((t-t0)/1500,1);c.textContent=Math.floor(end*(1-Math.pow(1-p,3))).toLocaleString('en-IN')+(p===1?plus:'');if(p<1)requestAnimationFrame(tick)};
      requestAnimationFrame(tick);
    });
    io.unobserve(e.target);
  }),{threshold:.15});
  $$('.reveal').forEach(el=>io.observe(el));

  // Active nav link + back to top
  const links=$$('#menu a'), secs=links.map(a=>$(a.getAttribute('href')));
  const top=$('#totop');
  addEventListener('scroll',()=>{
    const y=scrollY+120; let cur=0;
    secs.forEach((s,i)=>{if(s&&s.offsetTop<=y)cur=i});
    links.forEach((a,i)=>a.classList.toggle('active',i===cur));
    top.classList.toggle('show',scrollY>600);
  },{passive:true});
  top.onclick=()=>scrollTo({top:0,behavior:'smooth'});

  // Tabs
  const tabs=$$('.tab'), panels=$$('.panel');
  tabs.forEach((t,i)=>t.onclick=()=>{tabs.forEach(x=>x.classList.remove('on'));panels.forEach(x=>x.classList.remove('on'));t.classList.add('on');panels[i].classList.add('on')});

  // Testimonials
  const slides=$$('.slide'), dots=$('.dots'); let n=0,timer;
  slides.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Slide '+(i+1));b.onclick=()=>{show(i);restart()};dots.appendChild(b)});
  const show=i=>{n=i;slides.forEach((s,k)=>s.classList.toggle('on',k===i));$$('button',dots).forEach((d,k)=>d.classList.toggle('on',k===i))};
  const restart=()=>{clearInterval(timer);timer=setInterval(()=>show((n+1)%slides.length),5500)};
  show(0);restart();


  // Contact form -> mailto
  $('#form').addEventListener('submit',e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    const body=`Name: ${f.get('name')}\nPhone: ${f.get('phone')}\nEmail: ${f.get('email')||'-'}\nTopic: ${f.get('topic')}\n\n${f.get('msg')}`;
    $('#ok').style.display='block';
    location.href=`mailto:nhsmtm@gmail.com?subject=${encodeURIComponent('Website enquiry: '+f.get('topic'))}&body=${encodeURIComponent(body)}`;
  });
})();
