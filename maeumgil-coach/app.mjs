import {QUESTIONS,SCALE,STAGES,assessmentResult,needsSafety,SAFETY_MESSAGE} from "./core.mjs";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={view:"chat",mood:"",answers:Array(6).fill(null),question:0,goal:null,session:"",apiBase:"",busy:false,epoch:0,turns:0,expression:"simple",adult:false,safety:false,failed:null};
let controller,toastTimer,goalInterval,breathInterval,goalDeadline=0,goalRemaining=0,recognition,readEnabled=false;
const config=window.MAEUMGIL_CONFIG||{};
const local=location.hostname==="127.0.0.1";
const initialBase=config.apiBase || (local?location.origin+"/api":"");
$("#api-url").value=initialBase;
$("#local-setup-link").hidden=!local;
function toast(text){$("#toast").textContent=text;$("#toast").hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("#toast").hidden=true,4500);}
function modal(id){const d=$("#"+id);if(!d.open)d.showModal();}
function close(id){$("#"+id).close();}
function go(view){
 if(!["home","chat","check","breath","goal"].includes(view))return;
 if(state.view==="breath"&&view!=="breath")stopBreath();
 state.view=view;
 $$(".view").forEach(el=>el.hidden=el.id!=="view-"+view);
 $$(".nav-btn").forEach(b=>{b.classList.toggle("active",b.dataset.view===view);if(b.dataset.view===view)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
 if(view==="check")renderCheck();
 $("#main-content").focus({preventScroll:true});window.scrollTo({top:0,behavior:"instant"});
}
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>close(b.dataset.close)));
$("#help-open").onclick=()=>modal("help-dialog");
$("#connect-open").onclick=()=>modal("connect-dialog");
function review(){
 $("#review-turns").textContent=state.turns;
 $("#review-check").textContent=state.answers.filter(v=>v!==null).length+" / 6";
 $("#review-score").textContent=state.answers.every(v=>v!==null)?assessmentResult(state.answers).total+" / 36":"미완료";
}
$("#expert-open").onclick=$("#expert-top").onclick=()=>{review();modal("expert-dialog");};
$("#expression-level").onchange=e=>{state.expression=e.target.value;toast("다음 대화부터 표현 수준을 반영해요.");};
const prefersDark=matchMedia("(prefers-color-scheme: dark)").matches;
document.body.classList.toggle("dark",prefersDark);
$("#theme-toggle").onclick=()=>{const dark=document.body.classList.toggle("dark");$("#theme-toggle").setAttribute("aria-label",dark?"밝은 화면으로 바꾸기":"어두운 화면으로 바꾸기");};
$$("[data-mood]").forEach(b=>b.onclick=()=>{
 state.mood=b.dataset.mood;$$("[data-mood]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
 $("#mood-feedback").textContent=state.mood==="잘 모르겠어"?"마음을 꼭 이름 붙이지 않아도 괜찮아요. 함께 천천히 살펴봐요.":"‘"+b.querySelector("span:last-child").textContent+"’에 가까운 마음이군요. 원하면 이야기로 이어가도 좋아요.";
});
$("#adult-dialog").addEventListener("cancel",e=>e.preventDefault());
$("#adult-dialog").addEventListener("close",()=>{if($("#adult-check").checked){state.adult=true;}else modal("adult-dialog");});
$("#adult-enter").onclick=e=>{if(!$("#adult-check").checked){e.preventDefault();$("#adult-check").reportValidity();}};
function setConnected(connected){
 $("#connection-dot").classList.toggle("online",connected);$("#connection-label").textContent=connected?"AI 연결됨":"AI 연결";
 $("#chat-status").textContent=connected?"Gemini 3.8 Flash와 연결됐어요":"AI 연결을 기다리고 있어요";
 $("#message-input").disabled=!connected||state.busy||state.safety;
 $("#send-message").disabled=!connected||state.busy||state.safety;
}
async function api(path,body,signal){
 const res=await fetch(state.apiBase+path,{method:"POST",signal,headers:{"Content-Type":"application/json","X-Maeumgil-Session":state.session},body:JSON.stringify(body)});
 let data;try{data=await res.json();}catch{throw new Error("연결 서버의 응답을 확인할 수 없어요.");}
 if(!res.ok){if(res.status===401){state.session="";setConnected(false);}throw new Error(data.error||"요청을 완료하지 못했어요.");}
 return data;
}
$("#connect-form").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!state.adult)return modal("adult-dialog");
 const status=$("#connect-status"),btn=e.target.querySelector("button"),old={base:state.apiBase,session:state.session};
 try{
  const base=$("#api-url").value.trim().replace(/\/$/,""),url=new URL(base),code=$("#access-code").value;
  if(url.username||url.password||url.search||url.hash||!(url.protocol==="https:"||(url.protocol==="http:"&&url.hostname==="127.0.0.1")))throw new Error("HTTPS 연결 서버 또는 127.0.0.1 로컬 서버 주소를 넣어 주세요.");
  if(/^AIza/.test(code))throw new Error("이 칸은 API 키 입력 칸이 아닙니다. 로컬 키 설정 화면을 이용해 주세요.");
  status.textContent="서버와 모델 연결을 확인하고 있어요.";btn.disabled=true;
  const health=await fetch(base+"/health",{signal:AbortSignal.timeout(12000)});if(!health.ok)throw new Error("연결 서버를 확인해 주세요.");
  const info=await health.json();if(!info.configured)throw new Error("서버에 Gemini 키가 없습니다. 로컬 키 입력 화면에서 먼저 연결해 주세요.");
  if(info.model!=="gemini-3.8-flash")throw new Error("Gemini 3.8 Flash로 설정된 서버인지 확인해 주세요.");
  state.apiBase=base;state.session="";
  const result=await api("/session",{adult:true,accessCode:code},AbortSignal.timeout(12000));state.session=result.session;
  $("#access-code").value="";state.epoch++;controller?.abort();state.busy=false;state.safety=false;state.turns=0;state.failed=null;
  $("#messages").replaceChildren();greeting();$("#chat-error").hidden=true;$("#retry-chat").hidden=true;
  setConnected(true);status.textContent="연결됐어요.";close("connect-dialog");toast("Gemini 3.8 Flash와 연결됐어요.");
 }catch(err){state.apiBase=old.base;state.session=old.session;setConnected(Boolean(state.session));status.textContent=err.name==="TimeoutError"?"서버 연결 시간이 지났어요. 주소와 서버 실행을 확인해 주세요.":err.message;}
 finally{btn.disabled=false;}
});
function addMessage(role,text){
 const box=document.createElement("div");box.className="message "+role;
 if(role!=="user"){const icon=document.createElement("span");icon.className="mini-avatar";icon.textContent="✿";icon.setAttribute("aria-hidden","true");box.append(icon);}
 const wrapper=document.createElement("div"),bubble=document.createElement("div");bubble.className="bubble";bubble.textContent=text;wrapper.append(bubble);
 if(role==="coach"&&"speechSynthesis"in window){const btn=document.createElement("button");btn.className="read-one";btn.textContent="이 답변 읽기";btn.onclick=()=>speak(text);wrapper.append(btn);}
 box.append(wrapper);$("#messages").append(box);$("#messages").scrollTop=$("#messages").scrollHeight;return box;
}
function greeting(){addMessage("coach","안녕! 나는 마음길 코치야. 잘 정리된 말이 아니어도 괜찮아. 오늘 나누고 싶은 이야기가 있을까?");}
function stage(name=STAGES[0]){const el=$("#chat-stage");el.replaceChildren();STAGES.forEach(s=>{const b=document.createElement("span");b.textContent=s;b.className=s===name?"current":"";if(s===name)b.setAttribute("aria-current","step");el.append(b);});}
function quick(replies=[]){
 const el=$("#quick-replies");el.replaceChildren();
 replies.forEach(text=>{const b=document.createElement("button");b.type="button";b.textContent=text;b.disabled=state.busy||!state.session||state.safety;b.onclick=()=>send(text);el.append(b);});
}
function safety(){
 state.safety=true;state.epoch++;controller?.abort();state.busy=false;quick();setConnected(Boolean(state.session));window.speechSynthesis?.cancel();
 $("#safety-message").textContent=SAFETY_MESSAGE;modal("safety-dialog");
}
$("#safety-dialog").addEventListener("cancel",e=>e.preventDefault());
$("#safety-end").onclick=async()=>{
 close("safety-dialog");state.safety=false;state.failed=null;state.epoch++;state.busy=false;controller?.abort();
 try{if(state.session)await api("/reset",{},AbortSignal.timeout(7000));}catch{state.session="";}
 $("#messages").replaceChildren();greeting();stage();quick();$("#chat-error").hidden=true;$("#retry-chat").hidden=true;$("#message-input").value="";setConnected(Boolean(state.session));go("home");
};
async function send(text,retry=false,requestId=null){
 if(state.busy||state.safety)return;
 text=text.trim();if(!text||text.length>1000)return;
 if(!state.session){$("#message-input").value=text;modal("connect-dialog");return;}
 if(needsSafety(text)){addMessage("user",text);$("#message-input").value="";$("#input-count").textContent="0 / 1000";safety();return;}
 state.busy=true;state.failed=null;const epoch=state.epoch;const id=requestId||crypto.randomUUID();
 $("#chat-error").hidden=true;$("#retry-chat").hidden=true;setConnected(true);quick();
 if(!retry)addMessage("user",text);
 $("#message-input").value="";$("#input-count").textContent="0 / 1000";
 const pending=addMessage("pending","마음을 담아 답하고 있어요");controller=new AbortController();
 const timeout=setTimeout(()=>controller?.abort(),42000);
 try{
  const answers=state.answers.every(v=>v!==null)?state.answers:null;
  const data=await api("/chat",{message:text,requestId:id,context:{mood:state.mood,expression:state.expression,answers,goal:state.goal?.text||""}},controller.signal);
  if(epoch!==state.epoch)return;
  if(data.action==="safety"){safety();return;}
  if(typeof data.reply!=="string"||!data.reply.trim())throw new Error("응답 형식을 확인할 수 없어요.");
  addMessage("coach",data.reply);state.turns++;stage(data.stage);review();
  quick((data.quickReplies||[]).filter(x=>typeof x==="string").slice(0,3));
  if(data.action==="breathing")actionButton("같이 숨 고르기",()=>go("breath"));
  if(data.goal&&typeof data.goal==="string")actionButton("제안한 한 걸음 살펴보기",()=>{$("#goal-text").value=data.goal.slice(0,120);go("goal");});
  if(readEnabled)speak(data.reply);
 }catch(err){
  if(epoch!==state.epoch)return;
  state.failed={text,id};$("#chat-error").textContent=err.name==="AbortError"?"응답이 늦어지고 있어요. 같은 입력으로 다시 시도할 수 있어요.":err.message;
  $("#chat-error").hidden=false;$("#retry-chat").hidden=false;
 }finally{
  clearTimeout(timeout);pending.remove();
  if(epoch===state.epoch){state.busy=false;setConnected(Boolean(state.session));$$(".quick-replies button").forEach(b=>b.disabled=state.safety||!state.session);}
 }
}
function actionButton(text,fn){const b=document.createElement("button");b.textContent=text;b.onclick=fn;$("#quick-replies").append(b);}
$("#chat-form").addEventListener("submit",e=>{e.preventDefault();send($("#message-input").value);});
$("#message-input").addEventListener("input",()=>$("#input-count").textContent=$("#message-input").value.length+" / 1000");
$("#message-input").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing){e.preventDefault();send(e.target.value);}});
$("#retry-chat").onclick=()=>{if(state.failed)send(state.failed.text,true,state.failed.id);};
$$("[data-topic]").forEach(b=>b.onclick=()=>send(b.dataset.topic));
$("#new-chat").onclick=async()=>{
 if(!confirm("현재 대화를 지우고 새로 시작할까요?"))return;
 state.epoch++;controller?.abort();state.busy=false;state.safety=false;state.failed=null;state.turns=0;
 try{if(state.session)await api("/reset",{},AbortSignal.timeout(7000));}catch{state.session="";}
 $("#messages").replaceChildren();greeting();stage();quick();$("#chat-error").hidden=true;$("#retry-chat").hidden=true;$("#message-input").value="";$("#input-count").textContent="0 / 1000";setConnected(Boolean(state.session));review();
};
function speak(text){if(!("speechSynthesis"in window))return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang="ko-KR";utterance.rate=.9;speechSynthesis.speak(utterance);}
$("#read-toggle").onclick=()=>{if(!("speechSynthesis"in window))return toast("이 브라우저에서는 읽어주기를 지원하지 않아요.");readEnabled=!readEnabled;$("#read-toggle").textContent="읽어주기 "+(readEnabled?"켜짐":"꺼짐");$("#read-toggle").setAttribute("aria-pressed",String(readEnabled));if(!readEnabled)speechSynthesis.cancel();};
const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!Recognition){$("#voice-button").disabled=true;$("#voice-button").textContent="음성 입력 미지원";}
else{
 $("#voice-button").onclick=()=>{
  if(state.busy||state.safety||!state.session)return toast("AI를 먼저 연결해 주세요.");
  if(recognition){recognition.stop();return;}
  if(!confirm("음성이 브라우저의 음성 인식 서비스로 전송될 수 있어요. 가상 사례로 음성 입력을 시작할까요?"))return;
  recognition=new Recognition();recognition.lang="ko-KR";recognition.interimResults=false;recognition.continuous=false;
  recognition.onresult=e=>{$("#message-input").value=(e.results[0]?.[0]?.transcript||"").slice(0,1000);$("#message-input").dispatchEvent(new Event("input"));toast("인식된 문장을 확인한 뒤 보내기를 눌러 주세요.");};
  recognition.onerror=()=>toast("음성 입력을 완료하지 못했어요. 권한을 확인하거나 글자로 입력해 주세요.");
  recognition.onend=()=>{recognition=null;$("#voice-button").textContent="음성 입력";};
  try{recognition.start();$("#voice-button").textContent="음성 입력 멈추기";}catch{recognition=null;toast("음성 입력을 시작할 수 없어요.");}
 };
}
function renderCheck(){
 const i=state.question,finished=i>=6;
 $("#check-question-area").hidden=finished;$("#check-result").hidden=!finished;
 $("#check-counter").textContent=finished?"점검 완료":(i+1)+" / 6";
 $("#check-progress").style.width=(state.answers.filter(v=>v!==null).length/6*100)+"%";
 if(finished){result();review();return;}
 $("#question-tag").textContent=["첫 번째","두 번째","세 번째","네 번째","다섯 번째","여섯 번째"][i]+" 문장";
 $("#check-question").textContent=QUESTIONS[i];$("#scale-options").replaceChildren();
 SCALE.forEach((label,index)=>{const b=document.createElement("button");b.type="button";const strong=document.createElement("strong");strong.textContent=index+1;const span=document.createElement("span");span.textContent=label;b.append(strong,span);b.setAttribute("aria-pressed",String(state.answers[i]===index+1));b.onclick=()=>{state.answers[i]=index+1;renderCheck();$("#scale-options").children[index].focus();};$("#scale-options").append(b);});
 $("#check-prev").disabled=i===0;$("#check-next").disabled=state.answers[i]===null;$("#check-next").textContent=i===5?"내 마음길 돌아보기 ↗":"다음 문장 →";
 review();
}
$("#check-prev").onclick=()=>{if(state.question>0){state.question--;renderCheck();$("#check-question").focus();}};
$("#check-next").onclick=()=>{if(state.answers[state.question]!==null){state.question++;renderCheck();if(state.question<6)$("#check-question").focus();}};
$("#check-reset").onclick=()=>{if(state.answers.some(v=>v!==null)&&!confirm("점검 응답을 지우고 처음부터 시작할까요?"))return;state.answers=Array(6).fill(null);state.question=0;renderCheck();};
function result(){
 assessmentResult(state.answers);
 $("#check-result").innerHTML='<span class="result-flower" aria-hidden="true">✿</span><h2>내 마음길을 돌아봤어요</h2><p>답을 골라 준 것만으로도 나를 살피는 한 걸음을 내디뎠어요. 응답은 대화를 시작하기 위한 참고일 뿐, 나를 판단하는 점수가 아니에요.</p><div class="result-cards"><div><strong>시작하고 이어가는 마음</strong><p>지금 할 수 있는 아주 작은 시작을 함께 찾아봐요.</p></div><div><strong>방법을 찾아보는 마음</strong><p>한 가지가 어려우면 다른 길을 골라도 괜찮아요.</p></div></div><div class="button-row"><button class="primary-btn" id="result-talk">이 마음으로 이야기 나누기 ↗</button><button class="secondary-btn" id="result-edit">응답 다시 보기</button></div>';
 $("#result-talk").onclick=()=>{go("chat");if(!state.session)toast("점검을 마쳤어요. AI를 연결하면 응답을 참고해 이야기할 수 있어요.");};
 $("#result-edit").onclick=()=>{state.question=0;renderCheck();};
}
function stopBreath(){
 clearInterval(breathInterval);breathInterval=null;$("#breath-orb").classList.remove("inhale","exhale");$("#breath-instruction").textContent="편한 호흡으로 쉬어요";$("#breath-seconds").textContent="언제든 다시 해도 괜찮아요";$("#breath-start").disabled=false;$("#breath-stop").disabled=true;
}
$("#breath-start").onclick=()=>{
 clearInterval(breathInterval);const start=Date.now();$("#breath-start").disabled=true;$("#breath-stop").disabled=false;
 const tick=()=>{const elapsed=(Date.now()-start)/1000;if(elapsed>=30){stopBreath();$("#breath-instruction").textContent="잠깐의 쉼, 잘했어요";$("#breath-round").textContent="편해졌는지 천천히 살펴봐요. 불편하면 쉬어도 괜찮아요.";return;}
 const cycle=Math.floor(elapsed/10),phase=elapsed%10,inhale=phase<4;$("#breath-orb").classList.toggle("inhale",inhale);$("#breath-orb").classList.toggle("exhale",!inhale);$("#breath-instruction").textContent=inhale?"편하게 들이쉬어요":"천천히 내쉬어요";$("#breath-seconds").textContent=Math.max(1,Math.ceil((inhale?4:10)-phase))+"초";$("#breath-round").textContent=(cycle+1)+" / 3 번째 숨 고르기";};tick();breathInterval=setInterval(tick,250);
};
$("#breath-stop").onclick=stopBreath;
$$("[data-goal]").forEach(b=>b.onclick=()=>{$("#goal-text").value=b.dataset.goal;$("#goal-text").focus();});
$("#goal-form").addEventListener("submit",e=>{
 e.preventDefault();const text=$("#goal-text").value.trim();if(!text)return;
 clearInterval(goalInterval);goalInterval=null;state.goal={text,when:$("#goal-when").value,minutes:Number($("#goal-duration").value),done:false};goalRemaining=state.goal.minutes*60;goalDeadline=0;renderGoal();toast("지금 해볼 작은 한 걸음을 정했어요.");
});
function timeLabel(seconds){return String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");}
function renderGoal(){
 if(!state.goal)return;
 $("#active-goal").hidden=false;$("#active-goal-text").textContent=state.goal.text;$("#active-goal-meta").textContent=state.goal.when+", "+state.goal.minutes+"분만 해보기";
 $("#goal-timer").textContent=timeLabel(goalRemaining);$("#goal-timer-start").textContent="타이머 시작";$("#goal-timer-start").disabled=state.goal.done;$("#goal-done").disabled=state.goal.done;
 $("#goal-reflection").textContent=state.goal.done?"한 번 해봤군요. 어떤 부분이 괜찮았는지, 다음에는 무엇을 바꾸고 싶은지 떠올려 봐요.":"잘 안되면 더 작게 바꾸거나 다른 방법을 골라도 괜찮아요.";
}
$("#goal-timer-start").onclick=()=>{
 if(goalInterval){clearInterval(goalInterval);goalInterval=null;goalRemaining=Math.max(0,Math.ceil((goalDeadline-Date.now())/1000));$("#goal-timer-start").textContent="이어하기";return;}
 if(goalRemaining<=0)goalRemaining=state.goal.minutes*60;
 goalDeadline=Date.now()+goalRemaining*1000;$("#goal-timer-start").textContent="잠깐 멈추기";
 goalInterval=setInterval(()=>{goalRemaining=Math.max(0,Math.ceil((goalDeadline-Date.now())/1000));$("#goal-timer").textContent=timeLabel(goalRemaining);if(!goalRemaining){clearInterval(goalInterval);goalInterval=null;$("#goal-timer-start").textContent="다시 시작";toast("정한 시간이 지났어요. 해본 것을 천천히 돌아봐요.");}},250);
};
$("#goal-done").onclick=()=>{clearInterval(goalInterval);goalInterval=null;state.goal.done=true;renderGoal();};
$("#goal-smaller").onclick=()=>{if(!state.goal)return;clearInterval(goalInterval);goalInterval=null;state.goal.minutes=1;state.goal.done=false;goalRemaining=60;renderGoal();toast("1분만 해보는 한 걸음으로 줄였어요.");};
$("#goal-other").onclick=()=>{go("chat");const draft="내가 정한 ‘"+state.goal.text+"’가 어려워. 더 쉬운 다른 방법을 같이 찾아볼래.";$("#message-input").value=draft;$("#message-input").dispatchEvent(new Event("input"));if(!state.session)modal("connect-dialog");};
$("#export-review").onclick=()=>{
 const report={version:1,purpose:"adult-expert-fictional-case-review",model:"gemini-3.8-flash",completedTurns:state.turns,completedAssessmentItems:state.answers.filter(x=>x!==null).length,calculatedTotal:state.answers.every(x=>x!==null)?assessmentResult(state.answers).total:null,goalChosen:Boolean(state.goal),goalTried:Boolean(state.goal?.done),conversationIncluded:false};
 const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="maeumgil-review.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
document.addEventListener("visibilitychange",()=>{if(document.hidden){recognition?.stop();if("speechSynthesis"in window)speechSynthesis.cancel();if(breathInterval)stopBreath();}});
stage();greeting();renderCheck();setConnected(false);go("chat");modal("adult-dialog");
