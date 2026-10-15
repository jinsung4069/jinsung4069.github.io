import test from "node:test";
import assert from "node:assert/strict";
import {assessmentResult,needsSafety,normalizeReply} from "../../maeumgil-coach/core.mjs";
import {askGemini,interactionText,MODEL} from "./gemini.mjs";
test("점검의 양끝과 두 영역 합계",()=>{assert.deepEqual(assessmentResult([1,1,1,1,1,1]),{total:6,agency:3,pathways:3});assert.deepEqual(assessmentResult([6,6,6,6,6,6]),{total:36,agency:18,pathways:18});assert.deepEqual(assessmentResult([1,2,3,4,5,6]),{total:21,agency:9,pathways:12});});
test("미완료와 잘못된 점수로 총점을 만들지 않음",()=>{for(const bad of [[1,2],[1,2,null,4,5,6],[1,2,3,4,5,7],[1,2,3,4,5,"6"],[1,2,3,4,5,0]])assert.throws(()=>assessmentResult(bad));});
test("직접적인 위험 표현과 간격 변형",()=>{for(const text of ["죽고 싶어","죽 고 싶어","친구들이 때렸어","집에 가기 무서워","자해","살고 싶지 않아"])assert.equal(needsSafety(text),true,text);assert.equal(needsSafety("발표가 걱정돼"),false);});
test("모델이 위험을 판별하면 후속 질문과 목표를 제거",()=>{const data=normalizeReply({reply:"위험을 확인했어요",action:"safety",quickReplies:["계속"],goal:"계속",stage:"돌아보기"});assert.equal(data.action,"safety");assert.deepEqual(data.quickReplies,[]);assert.equal(data.goal,null);});
test("숨겨진 추론을 출력으로 사용하지 않음",()=>{assert.equal(interactionText({status:"completed",steps:[{type:"thought",content:[{type:"text",text:"비공개"}]},{type:"model_output",content:[{type:"text",text:"공개"}]}]}),"공개");assert.throws(()=>interactionText({status:"incomplete"}));});
test("공식 Interactions 요청 형식과 서버 키 헤더",async()=>{
 let sent;
 const result=await askGemini({apiKey:"test-key-not-real",history:[],message:"발표가 걱정돼",context:{mood:"걱정돼"},fetcher:async(url,init)=>{sent={url,init};return new Response(JSON.stringify({status:"completed",steps:[{type:"model_output",content:[{type:"text",text:JSON.stringify({reply:"발표가 마음에 걸리는구나. 어떤 순간이 걱정돼?",stage:"마음 확인",quickReplies:["친구들 앞에 서는 순간","말을 잊을까 봐"],action:"none",goal:null})}]}]}),{status:200});}});
 const payload=JSON.parse(sent.init.body);assert.equal(payload.model,MODEL);assert.equal(payload.store,false);assert.equal(payload.generation_config.thinking_level,"low");assert.equal(payload.response_format.type,"text");assert.equal(payload.response_format.mime_type,"application/json");assert.equal(sent.init.headers["x-goog-api-key"],"test-key-not-real");assert.equal(JSON.stringify(payload).includes("test-key-not-real"),false);assert.equal(result.quickReplies.length,2);
});
test("할당량 오류를 성공 응답으로 가장하지 않음",async()=>{await assert.rejects(()=>askGemini({apiKey:"test",history:[],message:"안녕",context:{},fetcher:async()=>new Response("{}",{status:429})}),e=>e.httpStatus===429);});

test("서버 세션 격리, 요청 중복 방지와 초기화 경쟁 처리",async()=>{
 const nativeFetch=globalThis.fetch;let calls=0,seen=[],release,started;
 process.env.HOST="127.0.0.1";process.env.PORT="18879";process.env.GEMINI_API_KEY="test-key-not-real";
 let gate=null;
 globalThis.fetch=async(url,init)=>{
  if(String(url).startsWith("https://generativelanguage.googleapis.com/")){
   calls++;seen.push(JSON.parse(JSON.parse(init.body).input));
   if(gate){started();await new Promise(resolve=>release=resolve);gate=null;}
   return new Response(JSON.stringify({status:"completed",steps:[{type:"model_output",content:[{type:"text",text:JSON.stringify({reply:"함께 작은 방법을 찾아볼까?",stage:"방법 찾기",quickReplies:["작게 시작할래"],action:"none",goal:null})}]}]}));
  }
  return nativeFetch(url,init);
 };
 const {server}=await import("./server.mjs");
 await new Promise(resolve=>server.listen(18879,"127.0.0.1",resolve));
 const origin="http://127.0.0.1:18879";
 const post=(route,body,token)=>nativeFetch(origin+"/api"+route,{method:"POST",headers:{Origin:origin,"Content-Type":"application/json",...(token?{"X-Maeumgil-Session":token}:{})},body:JSON.stringify(body)});
 try{
  const a=(await(await post("/session",{adult:true})).json()).session;
  const b=(await(await post("/session",{adult:true})).json()).session;
  assert.notEqual(a,b);
  const first={message:"가상 사례 첫 이야기",requestId:"req-1111111111111111",context:{}};
  assert.equal((await post("/chat",first,a)).status,200);
  assert.equal((await post("/chat",first,a)).status,200);assert.equal(calls,1);
  assert.equal((await post("/chat",{...first,message:"독립된 다른 사례"},b)).status,200);assert.equal(seen[1].conversation.length,0);
  const ready=new Promise(resolve=>started=resolve);gate=true;
  const pending=post("/chat",{message:"다음 이야기",requestId:"req-2222222222222222",context:{}},a);await ready;
  assert.equal((await post("/reset",{},a)).status,200);release();assert.equal((await pending).status,409);
  assert.equal((await post("/chat",{message:"새 대화",requestId:"req-3333333333333333",context:{}},a)).status,200);assert.equal(seen.at(-1).conversation.length,0);
 }finally{globalThis.fetch=nativeFetch;server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
