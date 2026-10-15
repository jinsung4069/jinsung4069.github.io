import http from "node:http";
import {readFile, realpath} from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {randomBytes, createHash, timingSafeEqual} from "node:crypto";
import {askGemini, MODEL} from "./gemini.mjs";
import {assessmentResult, cleanMessage, needsSafety, safeReply} from "../../maeumgil-coach/core.mjs";
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../..");
const envFile=path.join(here,".env.local");
if(existsSync(envFile)) process.loadEnvFile(envFile);
const host=process.env.HOST||"127.0.0.1", port=Number(process.env.PORT||8787);
const local=host==="127.0.0.1";
const allowed=new Set((process.env.ALLOWED_ORIGINS||"https://jinsung4069.github.io").split(",").map(s=>s.trim()).filter(Boolean));
const localOrigin="http://127.0.0.1:"+port;
if(local) allowed.add(localOrigin);
if(!local && (!process.env.EXPERT_ACCESS_CODE || process.env.EXPERT_ACCESS_CODE.length<16)) throw new Error("공개 서버에는 16자 이상의 EXPERT_ACCESS_CODE가 필요합니다.");
let apiKey=process.env.GEMINI_API_KEY||process.env.GOOGLE_API_KEY||"";
const thinking=["low","medium","high"].includes(process.env.GEMINI_THINKING_LEVEL)?process.env.GEMINI_THINKING_LEVEL:"low";
const setupToken=randomBytes(32).toString("hex"), sessions=new Map(), rate=new Map();
let upstreamActive=0;
const ttl=30*60*1000;
setInterval(()=>{const now=Date.now();for(const [id,s]of sessions)if(now-s.touched>ttl)sessions.delete(id);},30000).unref();
function reply(res,status,value,origin) {
 const headers={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"};
 if(origin&&allowed.has(origin)) {headers["Access-Control-Allow-Origin"]=origin;headers.Vary="Origin";}
 res.writeHead(status,headers); res.end(JSON.stringify(value));
}
function validCode(a,b){return timingSafeEqual(createHash("sha256").update(a||"").digest(),createHash("sha256").update(b||"").digest());}
async function body(req) {
 let raw="", size=0;
 for await(const chunk of req){size+=chunk.length;if(size>12000) throw Object.assign(new Error("입력이 너무 깁니다."),{httpStatus:413});raw+=chunk;}
 try{return JSON.parse(raw);}catch{throw Object.assign(new Error("입력 형식을 확인해 주세요."),{httpStatus:400});}
}
function throttle(ip){
 const now=Date.now();
 for(const [k,v] of rate)if(now-v.start>60000)rate.delete(k);
 const item=rate.get(ip)||{start:now,n:0};
 item.n++;rate.set(ip,item); return item.n<=45;
}
function cleanContext(value) {
 const ctx=value&&typeof value==="object"?value:{};
 let assessment=null;
 if(ctx.answers!==null && ctx.answers!==undefined)assessment=assessmentResult(ctx.answers);
 return {mood:typeof ctx.mood==="string"?ctx.mood.slice(0,30):"",expression:ctx.expression==="simple"?"simple":"standard",assessment,goal:typeof ctx.goal==="string"?ctx.goal.slice(0,120):""};
}
const setupPage=`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>마음길 코치 로컬 연결</title><style>body{margin:0;background:#f7f5fb;color:#252238;font:17px/1.7 system-ui,sans-serif}main{max-width:560px;margin:8vh auto;padding:36px;background:white;border-radius:24px}h1{font-size:28px}label{display:block;font-weight:bold}input{box-sizing:border-box;width:100%;padding:14px;border:1px solid #aaa;border-radius:10px;font:inherit}button,a{display:inline-block;margin-top:20px;padding:12px 20px;border:0;border-radius:10px;background:#7661ae;color:white;font:inherit}p{color:#666}#status{color:#473769}</style><main><h1>Gemini 연결하기</h1><p>이 컴퓨터에서만 여는 설정 화면입니다. 키는 서버 메모리에만 보관되며 종료하면 지워집니다. 실제 학생 정보는 입력하지 마세요.</p><form id="setup"><label for="key">AI Studio에서 발급한 API 키</label><input id="key" type="password" autocomplete="off" required minlength="20" spellcheck="false"><button>연결 확인 후 사용</button></form><p id="status" role="status"></p><a href="/maeumgil-coach/">마음길 코치 열기</a></main><script>document.querySelector('#setup').addEventListener('submit',async e=>{e.preventDefault();const key=document.querySelector('#key'),btn=e.target.querySelector('button'),status=document.querySelector('#status');btn.disabled=true;status.textContent='키와 모델 접근 권한을 확인하고 있어요.';try{const r=await fetch('/local-setup',{method:'POST',headers:{'Content-Type':'application/json','X-Setup-Token':'TOKEN'},body:JSON.stringify({apiKey:key.value})});const d=await r.json();key.value='';status.textContent=d.message||d.error;if(r.ok)btn.textContent='연결 완료';}catch{status.textContent='로컬 서버 연결을 확인해 주세요.';}finally{btn.disabled=false;}});</script></html>`.replace("TOKEN",setupToken);
export const server=http.createServer(async(req,res)=>{
 const origin=req.headers.origin;
 try{
  const url=new URL(req.url,"http://localhost");
  if(local && req.headers.host!=="127.0.0.1:"+port) return reply(res,403,{error:"이 서버는 127.0.0.1 로컬 주소로만 열 수 있습니다."});
  if(url.pathname==="/local-setup"){
   if(!local)return reply(res,404,{error:"찾을 수 없습니다."});
   if(req.method==="GET"){res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store","X-Frame-Options":"DENY","Referrer-Policy":"no-referrer","Content-Security-Policy":"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'"});return res.end(setupPage);}
   if(req.method!=="POST"||origin!==localOrigin||req.headers["x-setup-token"]!==setupToken)return reply(res,403,{error:"로컬 설정 화면에서 다시 시도해 주세요."});
   const data=await body(req);
   if(typeof data.apiKey!=="string"||data.apiKey.length<20||data.apiKey.length>200)return reply(res,400,{error:"키 형식을 확인해 주세요."});
   const check=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+MODEL,{headers:{"x-goog-api-key":data.apiKey},signal:AbortSignal.timeout(15000)});
   if(!check.ok)return reply(res,400,{error:"키 또는 Gemini 3.8 Flash 접근 권한을 확인해 주세요."});
   apiKey=data.apiKey; return reply(res,200,{message:"Gemini 3.8 Flash 연결을 확인했습니다. 마음길 코치에서 AI 연결을 눌러 주세요."});
  }
  if(url.pathname.startsWith("/api/")){
   if(origin&&!allowed.has(origin))return reply(res,403,{error:"허용되지 않은 사이트입니다."});
   if(req.method==="OPTIONS"){res.writeHead(204,{"Access-Control-Allow-Origin":origin||"","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type, X-Maeumgil-Session","Access-Control-Max-Age":"600",Vary:"Origin"});return res.end();}
   if(url.pathname==="/api/health"&&req.method==="GET")return reply(res,200,{configured:Boolean(apiKey),model:MODEL,thinking,local,adultOnly:true},origin);
   if(req.method!=="POST")return reply(res,405,{error:"지원하지 않는 요청입니다."},origin);
   if(!origin||!allowed.has(origin))return reply(res,403,{error:"검토 페이지에서 다시 시도해 주세요."},origin);
   if(!String(req.headers["content-type"]).startsWith("application/json"))return reply(res,415,{error:"JSON 요청이 필요합니다."},origin);
   if(!throttle(req.socket.remoteAddress))return reply(res,429,{error:"요청이 많습니다. 1분 후 다시 시도해 주세요."},origin);
   const now=Date.now();for(const [id,s]of sessions)if(now-s.touched>ttl)sessions.delete(id);
   const data=await body(req);
   if(url.pathname==="/api/session"){
    if(data.adult!==true)return reply(res,403,{error:"성인 전문가만 사용할 수 있습니다."},origin);
    if(!local&&!validCode(data.accessCode,process.env.EXPERT_ACCESS_CODE))return reply(res,403,{error:"전문가 접속 코드를 확인해 주세요."},origin);
    if(!apiKey)return reply(res,503,{error:"운영자가 Gemini 키를 먼저 연결해야 합니다."},origin);
    if(sessions.size>=250)return reply(res,503,{error:"지금은 새 대화를 열 수 없습니다. 잠시 후 다시 시도해 주세요."},origin);
    const id=randomBytes(32).toString("hex");sessions.set(id,{history:[],touched:now,busy:false,version:0,turns:0,responses:new Map()});return reply(res,200,{session:id,model:MODEL},origin);
   }
   const session=sessions.get(req.headers["x-maeumgil-session"]);
   if(!session)return reply(res,401,{error:"연결 시간이 지났어요. 다시 연결해 주세요."},origin);
   session.touched=now;
   if(url.pathname==="/api/reset"){session.history=[];session.version++;session.turns=0;session.responses.clear();return reply(res,200,{ok:true},origin);}
   if(url.pathname!=="/api/chat")return reply(res,404,{error:"찾을 수 없습니다."},origin);
   const message=cleanMessage(data.message),context=cleanContext(data.context);
   const requestId=data.requestId;
   if(typeof requestId!=="string"||!/^[-a-zA-Z0-9]{16,80}$/.test(requestId))return reply(res,400,{error:"요청 식별자를 확인해 주세요."},origin);
   if(session.responses.has(requestId))return reply(res,200,session.responses.get(requestId),origin);
   if(needsSafety(message)){session.history=[];session.version++;return reply(res,200,safeReply(),origin);}
   if(session.busy||upstreamActive>=4)return reply(res,429,{error:"이전 답변을 기다리거나 잠시 후 다시 시도해 주세요."},origin);
   if(session.turns>=60)return reply(res,429,{error:"이 대화의 사용 한도에 도달했어요. 새 대화를 시작해 주세요."},origin);
   session.busy=true;upstreamActive++;const version=session.version;
   try{
    const result=await askGemini({apiKey,history:session.history,message,context,thinking,signal:AbortSignal.timeout(35000)});
    if(version!==session.version)return reply(res,409,{error:"대화가 초기화됐어요. 새 대화에서 다시 입력해 주세요."},origin);
    session.turns++;
    session.responses.set(requestId,result);if(session.responses.size>6)session.responses.delete(session.responses.keys().next().value);
    session.history.push({role:"user",text:message},{role:"coach",text:result.reply});session.history=session.history.slice(-20);
    return reply(res,200,result,origin);
   }finally{session.busy=false;upstreamActive--;}
  }
  if(req.method!=="GET"&&req.method!=="HEAD")return reply(res,405,{error:"지원하지 않는 요청입니다."});
  const decoded=decodeURIComponent(url.pathname);
  if(decoded.split("/").some(p=>p.startsWith(".")||["apps","scripts","tests","node_modules"].includes(p)))return reply(res,404,{error:"찾을 수 없습니다."});
  let target=path.resolve(root,"."+decoded);
  if(decoded.endsWith("/"))target=path.join(target,"index.html");
  const actual=await realpath(target);
  if(!actual.startsWith(root+path.sep)||![".html",".css",".js",".mjs",".svg",".woff2",".png",".webp",".ico"].includes(path.extname(actual)))return reply(res,404,{error:"찾을 수 없습니다."});
  const type={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".svg":"image/svg+xml",".woff2":"font/woff2",".png":"image/png",".webp":"image/webp",".ico":"image/x-icon"}[path.extname(actual)];
  res.writeHead(200,{"Content-Type":type,"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","X-Frame-Options":"DENY"});res.end(req.method==="HEAD"?undefined:await readFile(actual));
 }catch(e){reply(res,e.httpStatus||((e.code==="ENOENT")?404:400),{error:e.name==="TimeoutError"?"응답이 늦어지고 있어요. 잠시 뒤 다시 시도해 주세요.":e.code==="ENOENT"?"찾을 수 없습니다.":e.message||"요청을 완료하지 못했어요."},origin);}
});
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 server.listen(port,host,()=>console.log("마음길 코치: http://"+host+":"+port+"/maeumgil-coach/\n로컬 키 입력: http://"+host+":"+port+"/local-setup"));
}
