// PERSONALIZAÇÃO RÁPIDA: altere o nome, a mensagem e o caminho do áudio no index.html.
const heartWords=document.querySelector('#heartWords'),heartStage=document.querySelector('#heartStage'),stars=document.querySelector('#stars'),music=document.querySelector('#music'),player=document.querySelector('.player'),playButton=document.querySelector('#playButton'),playIcon=document.querySelector('#playIcon'),progress=document.querySelector('#progress'),volume=document.querySelector('#volume'),currentTime=document.querySelector('#currentTime'),duration=document.querySelector('#duration'),musicHelp=document.querySelector('#musicHelp');
// Coração matemático: cada ponto recebe uma repetição de I LOVE YOU.
const heartWordItems=[];for(let i=0;i<104;i+=1){const t=Math.PI*2*i/104,x=16*Math.sin(t)**3,y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)),word=document.createElement('span');word.className='love is-visible';word.textContent='I LOVE YOU';word.style.left=`${50+x*2.68}%`;word.style.top=`${47+y*2.78}%`;word.style.transform=`translate(-50%, -50%) rotate(${Math.atan2(y,x)*180/Math.PI+90}deg)`;heartWords.append(word);heartWordItems.push(word)}heartStage.classList.add('heart-complete');
for(let i=0;i<28;i+=1){const star=document.createElement('i');star.className='star';star.style.left=`${Math.random()*100}%`;star.style.top=`${Math.random()*100}%`;star.style.setProperty('--d',`${2+Math.random()*4}s`);stars.append(star)}
function burst(event){const x=event?.clientX??innerWidth/2,y=event?.clientY??innerHeight/2;for(let i=0;i<12;i+=1){const petal=document.createElement('span');petal.className='burst';petal.textContent=i%3?'♥':'✦';petal.style.left=`${x}px`;petal.style.top=`${y}px`;petal.style.setProperty('--x',`${(Math.random()-.5)*150}px`);petal.style.setProperty('--y',`${(Math.random()-.5)*150}px`);document.body.append(petal);petal.addEventListener('animationend',()=>petal.remove())}}
heartStage.addEventListener('pointerdown',burst);heartStage.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();burst()}});
const formatTime=seconds=>`${Math.floor(seconds/60)||0}:${String(Math.floor(seconds%60)||0).padStart(2,'0')}`;music.volume=Number(volume.value);playButton.addEventListener('click',async()=>{if(music.paused){try{await music.play()}catch{musicHelp.textContent='Não foi possível tocar a música agora.'}}else music.pause()});music.addEventListener('play',()=>{player.classList.add('is-playing');playIcon.textContent='Ⅱ';musicHelp.textContent='Tocando nossa música ♡'});music.addEventListener('pause',()=>{player.classList.remove('is-playing');playIcon.textContent='▶'});music.addEventListener('loadedmetadata',()=>duration.textContent=formatTime(music.duration));music.addEventListener('timeupdate',()=>{if(!music.duration)return;progress.value=music.currentTime/music.duration*100;currentTime.textContent=formatTime(music.currentTime)});music.addEventListener('error',()=>musicHelp.textContent='Não foi possível carregar a música.');progress.addEventListener('input',()=>{if(music.duration)music.currentTime=progress.value/100*music.duration});volume.addEventListener('input',()=>music.volume=volume.value);
const reveals=document.querySelectorAll('[data-reveal]'),observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.16});reveals.forEach(element=>observer.observe(element));const letter=document.querySelector('#letterText');let written=false;const letterObserver=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting||written)return;written=true;const text=letter.dataset.message;let index=0;const write=()=>{letter.textContent=text.slice(0,index+=2);if(index<text.length)setTimeout(write,18)};write();letterObserver.disconnect()},{threshold:.45});letterObserver.observe(letter);

// O primeiro toque atende às regras de autoplay dos celulares e inicia toda a surpresa.
const welcome=document.querySelector('#welcome'),startButton=document.querySelector('#startButton');
startButton.addEventListener('click',async()=>{document.body.classList.add('experience-started');welcome.classList.add('is-hidden');try{await music.play()}catch{musicHelp.textContent='A surpresa começou. Toque no play quando quiser ouvir.'}});
document.querySelector('#timeLink').addEventListener('click',event=>{event.preventDefault();document.body.classList.add('experience-started');welcome.classList.add('is-hidden');document.querySelector('#nosso-tempo').scrollIntoView({behavior:'smooth'})});

// Sincronia visual: ajuste BEAT_INTERVAL se quiser alinhar o pulso a outra faixa.
// O tempo é contado pelo próprio áudio, por isso não perde a sincronia se a página travar.
const BEAT_INTERVAL=60/89;let lastBeat=-1;
// Animação sem leitura forçada de layout: mais fluida em celulares intermediários.
music.addEventListener('timeupdate',()=>{if(music.paused)return;const beat=Math.floor(music.currentTime/BEAT_INTERVAL);if(beat===lastBeat)return;lastBeat=beat;heartWords.animate([{transform:'scale(1)'},{transform:'scale(.965)',filter:'brightness(1.25)'},{transform:'scale(1)'}],{duration:420,easing:'ease-out'});});

// O coração fica completo desde o início; a música não controla as palavras “I LOVE YOU”.

// Mini player: mensagens em português acompanhando os blocos da faixa pelo tempo real.
// Para usar uma tradução literal autorizada, altere somente os textos abaixo e os segundos.
const translationLine=document.querySelector('#translationLine'),translationTime=document.querySelector('#translationTime'),nowPlaying=document.querySelector('#nowPlaying'),lyricMoment=document.querySelector('#lyricMoment'),lyricCues=document.querySelectorAll('#lyricCues [data-cue]');
const musicMoments=[
  {point:0,text:'Eu penso em você e em tudo o que a gente ainda pode viver.'},
  {point:.14,text:'Antes que o tempo passe, eu só quero aproveitar esse instante.'},
  {point:.28,text:'Esse sentimento fica na minha cabeça há muito tempo.'},
  {point:.42,text:'Mesmo nas dúvidas, meu coração continua voltando para você.'},
  {point:.57,text:'É como se cada música acabasse trazendo você de volta.'},
  {point:.71,text:'Eu quero ficar perto de você — agora e enquanto der.'},
  {point:.85,text:'Mesmo quando tudo muda, esse carinho continua aqui.'}
];
let activeMoment=-1;
function syncTranslation(){if(!translationLine)return;const time=music.currentTime||0,progressRatio=music.duration?time/music.duration:0;let next=0;for(let i=0;i<musicMoments.length;i+=1){if(progressRatio>=musicMoments[i].point)next=i;else break}if(nowPlaying)nowPlaying.textContent=`momento ${String(next+1).padStart(2,'0')} · ${formatTime(time)}`;if(next!==activeMoment){activeMoment=next;translationLine.classList.add('is-changing');setTimeout(()=>{const line=musicMoments[next].text;translationLine.textContent=line;if(lyricMoment)lyricMoment.textContent=`MOMENTO ${String(next+1).padStart(2,'0')}`;lyricCues.forEach(cue=>cue.classList.toggle('is-active',Number(cue.dataset.cue)===next));translationLine.classList.remove('is-changing')},120)}translationTime.textContent=formatTime(time)}
music.addEventListener('timeupdate',syncTranslation);music.addEventListener('seeked',syncTranslation);music.addEventListener('loadedmetadata',syncTranslation);

// Contador de calendário desde 22/06/2026: meses completos + o tempo restante.
const monthsCount=document.querySelector('#monthsCount'),daysCount=document.querySelector('#daysCount'),hoursCount=document.querySelector('#hoursCount'),minutesCount=document.querySelector('#minutesCount');
function updateRelationshipTime(){const start=new Date(2026,5,22),now=new Date();if(now<start){monthsCount.textContent=daysCount.textContent=hoursCount.textContent=minutesCount.textContent='0';return}let months=(now.getFullYear()-start.getFullYear())*12+now.getMonth()-start.getMonth();let milestone=new Date(start.getFullYear(),start.getMonth()+months,start.getDate());if(milestone>now){months-=1;milestone=new Date(start.getFullYear(),start.getMonth()+months,start.getDate())}const elapsed=now-milestone,days=Math.floor(elapsed/86400000),hours=Math.floor(elapsed/3600000)%24,minutes=Math.floor(elapsed/60000)%60;monthsCount.textContent=months;daysCount.textContent=days;hoursCount.textContent=hours;minutesCount.textContent=minutes}updateRelationshipTime();setInterval(updateRelationshipTime,30000);

// Carta imersiva: só a área de texto rola; os dois controles de fechar ficam acessíveis.
const letterModal=document.querySelector('#letterModal'),openLetter=document.querySelector('#openLetter'),closeLetter=document.querySelector('#closeLetter'),closeLetterWide=document.querySelector('#closeLetterWide');
function animateModal(modal){const card=modal.querySelector('.modal-card');card.animate([{opacity:0,transform:'translateY(18px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});}
const setLetter=(open)=>{letterModal.classList.toggle('is-open',open);letterModal.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('modal-open',open);if(open)animateModal(letterModal)};
openLetter.addEventListener('click',()=>setLetter(true));closeLetter.addEventListener('click',()=>setLetter(false));closeLetterWide.addEventListener('click',()=>setLetter(false));letterModal.addEventListener('pointerdown',event=>{if(event.target===letterModal)setLetter(false)});

// Segunda cápsula: "Leia quando sentir saudade".
const missingModal=document.querySelector('#missingLetterModal'),openMissingLetter=document.querySelector('#openMissingLetter'),closeMissingLetter=document.querySelector('#closeMissingLetter'),closeMissingLetterWide=document.querySelector('#closeMissingLetterWide');
const setMissingLetter=open=>{missingModal.classList.toggle('is-open',open);missingModal.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('modal-open',open);if(open)animateModal(missingModal)};
openMissingLetter.addEventListener('click',()=>setMissingLetter(true));closeMissingLetter.addEventListener('click',()=>setMissingLetter(false));closeMissingLetterWide.addEventListener('click',()=>setMissingLetter(false));missingModal.addEventListener('pointerdown',event=>{if(event.target===missingModal)setMissingLetter(false)});

// Resposta de toque acionada diretamente pelo navegador, inclusive em celulares.
document.querySelectorAll('button,.discover,.back-top,.welcome-time-link').forEach(control=>control.addEventListener('click',()=>control.animate([{transform:'scale(1)'},{transform:'scale(.95)',offset:.35},{transform:'scale(1.02)',offset:.7},{transform:'scale(1)'}],{duration:360,easing:'ease-out'})));

// Aplica o volume também em eventos de toque, comuns nos navegadores móveis.
function setPlayerVolume(){const level=Math.max(0,Math.min(1,Number(volume.value)));music.muted=level===0;music.volume=level;volume.setAttribute('aria-valuetext',`${Math.round(level*100)}%`)}
['input','change','pointerup','touchend'].forEach(eventName=>volume.addEventListener(eventName,setPlayerVolume,{passive:true}));
