(() => {
  const USERNAME = 'admin';
  const PASSWORD = 'BMB2026';
  const KEY = 'mto_logged_in';

  const style = document.createElement('style');
  style.textContent = `
    #mto-login{position:fixed;inset:0;z-index:99999;background:linear-gradient(135deg,#061f50,#0b55c5);display:flex;align-items:center;justify-content:center;padding:20px;font-family:Arial,sans-serif}
    #mto-login .box{width:min(410px,100%);background:#fff;border-radius:18px;padding:32px;box-shadow:0 20px 60px #0005;text-align:center}
    #mto-login .logo{width:58px;height:58px;border-radius:14px;background:#073b93;color:#fff;display:grid;place-items:center;margin:0 auto 15px;font-weight:900;font-size:18px}
    #mto-login h1{margin:0;color:#172033;font-size:25px}.mto-sub{color:#667085;font-size:12px;margin:7px 0 25px}
    #mto-login label{display:block;text-align:left;margin:12px 0 6px;color:#344054;font-size:13px;font-weight:700}
    #mto-login input{width:100%!important;box-sizing:border-box;padding:12px!important;border:1px solid #cbd5e1!important;border-radius:8px!important;font-size:14px}
    #mto-login button{width:100%;margin-top:18px;background:#073b93;color:#fff;border:0;border-radius:8px;padding:12px;font-weight:800;cursor:pointer}
    #mto-login button:hover{background:#0b55c5}.mto-error{color:#b42318;font-size:12px;min-height:18px;margin-top:12px}
    .mto-foot{margin-top:22px;color:#98a2b3;font-size:10px}
  `;
  document.head.appendChild(style);

  function unlock(){
    document.getElementById('mto-login')?.remove();
    document.body.style.visibility='visible';
  }

  document.body.style.visibility='hidden';
  if(sessionStorage.getItem(KEY)==='1'){unlock();return;}

  const overlay=document.createElement('div');
  overlay.id='mto-login';
  overlay.innerHTML=`<div class="box">
    <div class="logo">MTO</div>
    <h1>MTO Mine Tools</h1>
    <div class="mto-sub">BMB MINING ACADEMY · LOGIN</div>
    <form id="mto-form">
      <label>Username</label><input id="mto-user" autocomplete="username" required>
      <label>Password</label><input id="mto-pass" type="password" autocomplete="current-password" required>
      <button type="submit">MASUK KE DASHBOARD</button>
      <div class="mto-error" id="mto-error"></div>
    </form>
    <div class="mto-foot">PT Cipta Kridatama · Site BMB</div>
  </div>`;
  document.body.appendChild(overlay);
  document.getElementById('mto-form').addEventListener('submit',e=>{
    e.preventDefault();
    const u=document.getElementById('mto-user').value.trim();
    const p=document.getElementById('mto-pass').value;
    if(u===USERNAME && p===PASSWORD){sessionStorage.setItem(KEY,'1');unlock();}
    else document.getElementById('mto-error').textContent='Username atau password salah.';
  });
})();