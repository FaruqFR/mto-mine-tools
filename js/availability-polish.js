(function(){
  const $=id=>document.getElementById(id);
  const n=id=>{const e=$(id);const v=parseFloat(String(e?.value??'').trim().replace(/\s/g,'').replace(/,/g,'.'));return Number.isFinite(v)?v:0};
  const fmt=(v,d=2)=>Number(v).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
  const defs=[
    ['ma','MA','Mechanical Availability','W / (W + R) × 100%','W','R'],
    ['pa','PA','Physical Availability','(W + S) / (W + R + S) × 100%','W','R','S'],
    ['ua','UA','Utilization Availability','W / (W + S) × 100%','W','S'],
    ['eu','EU','Effective Utilization','W / (W + R + S) × 100%','W','R','S']
  ];
  function calc(id){
    const W=n('working'),R=n('repair'),S=n('standby');
    const values={ma:W/(W+R)*100,pa:(W+S)/(W+R+S)*100,ua:W/(W+S)*100,eu:W/(W+R+S)*100};
    const v=values[id];
    if($(id)) $(id).textContent=Number.isFinite(v)?fmt(v,2)+' %':'—';
    const sub=$('avSub-'+id);
    if(!sub)return;
    const f={ma:`(${fmt(W)} ÷ (${fmt(W)} + ${fmt(R)})) × 100 = ${fmt(v)} %`,pa:`((${fmt(W)} + ${fmt(S)}) ÷ (${fmt(W)} + ${fmt(R)} + ${fmt(S)})) × 100 = ${fmt(v)} %`,ua:`(${fmt(W)} ÷ (${fmt(W)} + ${fmt(S)})) × 100 = ${fmt(v)} %`,eu:`(${fmt(W)} ÷ (${fmt(W)} + ${fmt(R)} + ${fmt(S)})) × 100 = ${fmt(v)} %`};
    sub.textContent=Number.isFinite(v)?f[id]:'—';
  }
  function install(){
    const section=$('#availability'); if(!section)return;
    const old=section.querySelector('.availability-formula-cards');
    if(old){defs.forEach(d=>calc(d[0]));return;}
    const anchor=$('ma')?.closest('.result-card')||$('ma')?.parentElement;
    const wrap=document.createElement('div');wrap.className='availability-formula-cards';
    wrap.innerHTML=defs.map(d=>`<article class="availability-formula-card"><div class="av-head"><div><span class="av-code">${d[1]}</span><h3>${d[2]}</h3></div><strong id="${d[0]}" class="av-result">—</strong></div><div class="av-formula"><span>RUMUS</span><b>${d[3]}</b></div><div class="av-sub"><span>SUBSTITUSI</span><code id="avSub-${d[0]}">—</code></div><div class="av-source">W = Working &nbsp;•&nbsp; R = Repair &nbsp;•&nbsp; S = Standby</div></article>`).join('');
    section.querySelector('.card-body')?.appendChild(wrap);
    defs.forEach(d=>calc(d[0]));
  }
  const css=document.createElement('style');css.textContent=`
  .availability-formula-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:22px}
  .availability-formula-card{background:linear-gradient(145deg,#fff,#f6f9fd);border:1px solid #dce5f0;border-radius:18px;padding:20px;box-shadow:0 8px 24px rgba(24,50,80,.08)}
  .av-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:16px}.av-head>div{display:flex;align-items:center;gap:12px}.av-code{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:#0b5cab;color:#fff;font-weight:800;font-size:16px}.av-head h3{margin:0;font-size:15px;color:#17324d}.av-result{font-size:24px;color:#0b5cab;white-space:nowrap}.av-formula,.av-sub{border-radius:12px;padding:12px 14px;margin-top:10px}.av-formula{background:#eef5fc}.av-sub{background:#f8fafc;border:1px solid #e5ebf2}.av-formula span,.av-sub span{display:block;font-size:10px;font-weight:800;letter-spacing:.08em;color:#6c7d90;margin-bottom:6px}.av-formula b{font-size:14px;color:#163a5c}.av-sub code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.6;color:#27384a;white-space:normal}.av-source{font-size:10px;color:#8492a1;margin-top:10px}@media(max-width:760px){.availability-formula-cards{grid-template-columns:1fr}}
  `;document.head.appendChild(css);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(install,120));
  document.addEventListener('input',e=>{if(['working','repair','standby'].includes(e.target?.id))defs.forEach(d=>calc(d[0]))},true);
  new MutationObserver(()=>setTimeout(install,50)).observe(document.documentElement,{childList:true,subtree:true});
})();
