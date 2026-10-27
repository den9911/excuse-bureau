import { $, action, download, storage, wrapText } from '/locales/es/shared/ui.js';
const templates=[
  {title:'PERMISO',subtitle:'para no hacer absolutamente nada',verb:'Por la presente se autoriza a',body:'posponer las tareas no urgentes, ponerse cómodo y descansar sin culpa.',stamp:'APROBADO',issuer:'Departamento de Descanso'},
  {title:'DIPLOMA',subtitle:'por sus extraordinarios retrasos',verb:'Se concede con orgullo a',body:'por dominar la frase ‘ya salgo’ y tener una visión independiente del horario.',stamp:'MERECIDO',issuer:'Comité del Tiempo Libre'},
  {title:'EXCUSA OFICIAL',subtitle:'por circunstancias de pereza irresistible',verb:'Se exime del ajetreo innecesario a',body:'por la necesidad de mirar por la ventana, terminar el té y reflexionar sobre la vida.',stamp:'ACEPTADO',issuer:'Oficina de Buenas Razones'},
];
export async function mount(){
  const draft=storage.get('paper-draft',{name:'',type:0,note:''});
  $('#app').innerHTML=`<div class="split"><form id="paper-form" class="panel stack"><h2>Vamos a hacerlo oficial</h2><label>Documento<select name="type">${templates.map((t,i)=>`<option value="${i}">${t.title.toLowerCase()}</option>`).join('')}</select></label><label>¿Para quién es?<input name="name" maxlength="60" placeholder="Nombre de la persona afortunada" required></label><label>Circunstancias especiales<textarea name="note" maxlength="160" rows="3" placeholder="Por ejemplo: no molestar hasta el lunes"></textarea></label><label>Fecha de emisión<input type="date" name="date" required></label><button type="submit">Descargar documento ↓</button><p class="small muted">Documento de broma sin validez legal. Se crea en tu navegador; los nombres no se envían al servidor.</p></form><div class="paper-preview"><canvas id="paper" width="1000" height="1320" role="img" aria-label="Vista previa del documento de broma"></canvas></div></div>`;
  const form=$('#paper-form'),canvas=$('#paper'),ctx=canvas.getContext('2d');
  form.elements.name.value=draft.name??'';form.elements.type.value=String(draft.type??0);form.elements.note.value=draft.note??'';
  form.elements.date.value=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  function render(){
    const type=Number(form.elements.type.value),t=templates[type],name=form.elements.name.value.trim()||'Nombre del destinatario',note=form.elements.note.value.trim();
    ctx.fillStyle='#fffdf4';ctx.fillRect(0,0,1000,1320);ctx.strokeStyle='#8c9279';ctx.lineWidth=2;ctx.strokeRect(42,42,916,1236);ctx.strokeRect(55,55,890,1210);
    ctx.textAlign='center';ctx.fillStyle='#5c6552';ctx.font='20px monospace';ctx.fillText('CLUB MINUTO / OFICINA DE EXCUSAS',500,120);
    ctx.font='64px Georgia,serif';ctx.fillText('§',500,230);ctx.fillStyle='#252a27';
    ctx.font=`bold ${type===2?42:70}px Georgia,serif`;ctx.fillText(t.title,500,340);
    ctx.font='italic 27px Georgia,serif';ctx.fillText(t.subtitle,500,395);
    ctx.font='25px Georgia,serif';ctx.fillText(t.verb,500,500);
    ctx.font='bold 42px Georgia,serif';wrapText(ctx,name,500,580,750,52,3);
    ctx.font='29px Georgia,serif';wrapText(ctx,t.body,500,760,730,44,4);
    if(note){ctx.font='italic 25px Georgia,serif';wrapText(ctx,note,500,970,720,36,3);}
    ctx.save();ctx.translate(745,1120);ctx.rotate(-.15);ctx.strokeStyle='#ac5344';ctx.fillStyle='#ac5344';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,86,0,Math.PI*2);ctx.stroke();ctx.font='bold 19px sans-serif';ctx.fillText(t.stamp,0,7);ctx.restore();
    ctx.textAlign='left';ctx.fillStyle='#5c6552';ctx.font='19px Georgia,serif';ctx.fillText(t.issuer,105,1130);ctx.fillText(form.elements.date.value,105,1170);ctx.font='16px sans-serif';ctx.fillText('Documento de broma. Sin validez legal.',105,1225);
    storage.set('paper-draft',{name:form.elements.name.value,type,note});
  }
  form.addEventListener('input',render);action(form,()=>{render();download(canvas,'excuse-bureau.png');},'submit');render();
}
