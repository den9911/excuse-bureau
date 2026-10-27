import { $, action, download, storage, wrapText } from '/locales/ru/shared/ui.js';
const templates=[
  {title:'РАЗРЕШЕНИЕ',subtitle:'на законное ничегонеделание',verb:'Настоящим разрешается',body:'отложить несрочные дела, устроиться поудобнее и провести время без чувства вины.',stamp:'ОДОБРЕНО',issuer:'Департамент восстановления сил'},
  {title:'ДИПЛОМ',subtitle:'за выдающиеся опоздания',verb:'Торжественно награждается',body:'за уверенное владение фразой «уже выхожу» и независимый взгляд на расписание.',stamp:'ЗАСЛУЖЕНО',issuer:'Комитет свободного времени'},
  {title:'ОФИЦИАЛЬНАЯ ОТМАЗКА',subtitle:'по обстоятельствам непреодолимой лени',verb:'Освобождается от лишней суеты',body:'в связи с необходимостью посмотреть в окно, допить чай и немного подумать о вечном.',stamp:'ПРИНЯТО',issuer:'Бюро уважительных причин'},
];
export async function mount(){
  const draft=storage.get('paper-draft',{name:'',type:0,note:''});
  $('#app').innerHTML=`<div class="split"><form id="paper-form" class="panel stack"><h2>Оформим как положено</h2><label>Документ<select name="type">${templates.map((t,i)=>`<option value="${i}">${t.title.toLowerCase()}</option>`).join('')}</select></label><label>Кому выдаём?<input name="name" maxlength="60" placeholder="Имя счастливого обладателя" required></label><label>Особые обстоятельства<textarea name="note" maxlength="160" rows="3" placeholder="Например: до понедельника не беспокоить"></textarea></label><label>Дата выдачи<input type="date" name="date" required></label><button type="submit">Скачать документ ↓</button><p class="small muted">Шуточный документ, юридической силы не имеет. Всё создаётся в браузере, имена на сервер не отправляются.</p></form><div class="paper-preview"><canvas id="paper" width="1000" height="1320" role="img" aria-label="Предпросмотр шуточного документа"></canvas></div></div>`;
  const form=$('#paper-form'),canvas=$('#paper'),ctx=canvas.getContext('2d');
  form.elements.name.value=draft.name??'';form.elements.type.value=String(draft.type??0);form.elements.note.value=draft.note??'';
  form.elements.date.value=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  function render(){
    const type=Number(form.elements.type.value),t=templates[type],name=form.elements.name.value.trim()||'Имя получателя',note=form.elements.note.value.trim();
    ctx.fillStyle='#fffdf4';ctx.fillRect(0,0,1000,1320);ctx.strokeStyle='#8c9279';ctx.lineWidth=2;ctx.strokeRect(42,42,916,1236);ctx.strokeRect(55,55,890,1210);
    ctx.textAlign='center';ctx.fillStyle='#5c6552';ctx.font='20px monospace';ctx.fillText('МИНУТА КЛУБ / БЮРО ОТМАЗОК',500,120);
    ctx.font='64px Georgia,serif';ctx.fillText('§',500,230);ctx.fillStyle='#252a27';
    ctx.font=`bold ${type===2?42:70}px Georgia,serif`;ctx.fillText(t.title,500,340);
    ctx.font='italic 27px Georgia,serif';ctx.fillText(t.subtitle,500,395);
    ctx.font='25px Georgia,serif';ctx.fillText(t.verb,500,500);
    ctx.font='bold 42px Georgia,serif';wrapText(ctx,name,500,580,750,52,3);
    ctx.font='29px Georgia,serif';wrapText(ctx,t.body,500,760,730,44,4);
    if(note){ctx.font='italic 25px Georgia,serif';wrapText(ctx,note,500,970,720,36,3);}
    ctx.save();ctx.translate(745,1120);ctx.rotate(-.15);ctx.strokeStyle='#ac5344';ctx.fillStyle='#ac5344';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,86,0,Math.PI*2);ctx.stroke();ctx.font='bold 19px sans-serif';ctx.fillText(t.stamp,0,7);ctx.restore();
    ctx.textAlign='left';ctx.fillStyle='#5c6552';ctx.font='19px Georgia,serif';ctx.fillText(t.issuer,105,1130);ctx.fillText(form.elements.date.value,105,1170);ctx.font='16px sans-serif';ctx.fillText('Шуточный документ. Юридической силы не имеет.',105,1225);
    storage.set('paper-draft',{name:form.elements.name.value,type,note});
  }
  form.addEventListener('input',render);action(form,()=>{render();download(canvas,'excuse-bureau.png');},'submit');render();
}
