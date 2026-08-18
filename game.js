const board = document.querySelector('#board');
const startBtn = document.querySelector('#start');
const hint = document.querySelector('#hint');
const timeEl = document.querySelector('#time');
const scoreEl = document.querySelector('#score');
const matchesEl = document.querySelector('#matches');
const progress = document.querySelector('#progress');
const dialog = document.querySelector('#resultDialog');
const resultTitle = document.querySelector('#resultTitle');
const resultText = document.querySelector('#resultText');
const ranking = document.querySelector('#ranking');
const scoreEntry = document.querySelector('#scoreEntry');
const playerName = document.querySelector('#playerName');
const saveScoreBtn = document.querySelector('#saveScore');
let cards=[], first=null, lock=false, seconds=60, score=0, matches=0, timer=null, playing=false;
const members = [
  { name: '朴星垠', photo: 'member-01.jpg' }, { name: '李珠珢', photo: 'member-02.png' },
  { name: '李晧禎', photo: 'member-03.jpg' }, { name: '李雅英', photo: 'member-04.png' },
  { name: '南珉貞', photo: 'member-05.png' }, { name: '慈妹', photo: 'member-06.png' },
  { name: '潔潔', photo: 'member-07.png' }, { name: '檸檬', photo: 'member-08.png' }
];

function shuffle(a){ return [...a].sort(()=>Math.random()-.5); }
function makeBoard(){
  cards=shuffle([...Array(8).keys(),...Array(8).keys()]); board.innerHTML='';
  cards.forEach(value=>{ const member=members[value]; const card=document.createElement('button'); card.className='card'; card.dataset.value=value; card.setAttribute('aria-label',`翻開 ${member.name} 的卡片`); card.innerHTML=`<span class="face back">★</span><span class="face front"><img class="member-photo" src="${member.photo}" alt="${member.name}" /></span>`; card.addEventListener('click',()=>flip(card)); board.append(card); });
}
function reset(){ clearInterval(timer); first=null; lock=false; seconds=60; score=0; matches=0; playing=false; update(); makeBoard(); startBtn.textContent='開始挑戰'; hint.textContent='按下開始，記住每位成員的位置！'; }
function update(){timeEl.textContent=seconds;scoreEl.textContent=score;matchesEl.textContent=matches;progress.style.width=`${seconds/60*100}%`;}
function start(){ if(playing) reset(); playing=true; startBtn.textContent='重新開始'; hint.textContent='加油！找到全部 8 位成員吧！'; timer=setInterval(()=>{seconds--;update();if(seconds<=0) finish(false)},1000); }
function flip(card){
  if(!playing||lock||card===first||card.classList.contains('matched')) return;
  card.classList.add('flipped');
  if(!first){first=card;return;} lock=true;
  if(first.dataset.value===card.dataset.value){ first.classList.add('matched');card.classList.add('matched');matches++;score+=100+seconds*2;first=null;lock=false;update();if(matches===8)finish(true); }
  else { score=Math.max(0,score-10);update();setTimeout(()=>{card.classList.remove('flipped');first.classList.remove('flipped');first=null;lock=false;},650); }
}
function finish(win){clearInterval(timer);playing=false;resultTitle.textContent=win?'過關成功！':'時間到！';resultText.textContent=win?`妳用了 ${60-seconds} 秒完成挑戰，獲得 ${score} 分！`:`已完成 ${matches} 組配對，分數 ${score} 分。`;document.querySelector('#resultEmoji').textContent=win?'🎉':'💪';playerName.value='';scoreEntry.hidden=false;saveScoreBtn.disabled=false;saveScoreBtn.textContent='送出成績';renderRank();dialog.showModal();}
function getRanks(){return JSON.parse(localStorage.getItem('cheer-match-ranking')||'[]');}
function renderRank(){const rows=getRanks();ranking.innerHTML=rows.length?rows.map(r=>`<li>${r.name} <b>${r.score}</b> 分</li>`).join(''):'<li>尚未有排行成績</li>';}
function saveScore(){const name=playerName.value.trim()||'匿名啦啦隊長';const rows=[...getRanks(),{name,score}].sort((a,b)=>b.score-a.score).slice(0,5);localStorage.setItem('cheer-match-ranking',JSON.stringify(rows));scoreEntry.hidden=true;renderRank();}
saveScoreBtn.onclick=saveScore;
document.querySelector('#playAgain').onclick=()=>{dialog.close();reset();start();};startBtn.onclick=start;reset();
