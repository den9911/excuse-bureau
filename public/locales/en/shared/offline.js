(() => {
 if (!('serviceWorker' in navigator)) return;
 const base=new URL('../',document.currentScript.src);
 const label=document.createElement('p');label.className='small muted';label.setAttribute('role','status');
 (document.querySelector('footer')||document.body).append(label);
 const copy={"en": {"preparing": "Preparing offline access\u2026", "ready": "Offline access ready on this device.", "offline": "Offline mode: your work stays on this device.", "update": "Update ready. Close this app\u2019s tabs after saving your work to use it.", "failed": "Offline preparation unavailable; online use still works."}, "ru": {"preparing": "\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430 \u0434\u043e\u0441\u0442\u0443\u043f\u0430 \u0431\u0435\u0437 \u0441\u0435\u0442\u0438\u2026", "ready": "\u0414\u043e\u0441\u0442\u0443\u043f \u0431\u0435\u0437 \u0441\u0435\u0442\u0438 \u0433\u043e\u0442\u043e\u0432 \u043d\u0430 \u044d\u0442\u043e\u043c \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435.", "offline": "\u0411\u0435\u0437 \u0441\u0435\u0442\u0438: \u0432\u0430\u0448\u0430 \u0440\u0430\u0431\u043e\u0442\u0430 \u043e\u0441\u0442\u0430\u0451\u0442\u0441\u044f \u043d\u0430 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435.", "update": "\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u0433\u043e\u0442\u043e\u0432\u043e. \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u0435 \u0440\u0430\u0431\u043e\u0442\u0443 \u0438 \u0437\u0430\u043a\u0440\u043e\u0439\u0442\u0435 \u0432\u043a\u043b\u0430\u0434\u043a\u0438 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c \u0435\u0433\u043e.", "failed": "\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u043a\u0430 \u0431\u0435\u0437 \u0441\u0435\u0442\u0438 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430; \u043e\u043d\u043b\u0430\u0439\u043d-\u0440\u0435\u0436\u0438\u043c \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442."}};
 new MutationObserver(()=>{if(!label.isConnected&&document.body)(document.querySelector('footer')||document.body).append(label);}).observe(document.documentElement,{childList:true});
 function say(key){label.textContent=copy[document.documentElement.lang==='ru'?'ru':'en'][key];}
 let waiting=false;
 function ready(){say(waiting?'update':navigator.onLine?'ready':'offline');}
 say('preparing');
 navigator.serviceWorker.register(new URL('sw.js',base),{scope:base.pathname}).then(async reg=>{
  waiting=!!reg.waiting;
  reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller){waiting=true;ready();}});});
  await navigator.serviceWorker.ready;ready();
 }).catch(()=>say('failed'));
 window.addEventListener('online',ready);window.addEventListener('offline',ready);
})();
