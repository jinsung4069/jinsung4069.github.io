export const QUESTIONS = [
"나는 평소에 내가 꽤 잘해 나가고 있다고 느낀다.",
"어려운 일이 생기면 해결할 방법을 여러 가지 떠올릴 수 있다.",
"나는 또래 친구들만큼 잘해 나가고 있다고 느낀다.",
"내가 중요하게 생각하는 일을 해낼 방법을 생각해낼 수 있다.",
"내가 지금까지 해본 일들은 앞으로 나에게 도움이 될 것 같다.",
"다른 사람이 포기하고 싶어 할 때도 나는 다른 방법을 찾아볼 수 있다."
];
export const SCALE = ["전혀 없어", "아주 조금", "조금", "꽤 자주", "거의 항상", "항상"];
export const STAGES = ["마음 확인", "방법 찾기", "작은 실천", "돌아보기"];
export function assessmentResult(answers) {
  if (!Array.isArray(answers) || answers.length !== 6 || !answers.every(v => Number.isInteger(v) && v >= 1 && v <= 6))
    throw new Error("여섯 문항의 응답을 모두 선택해 주세요.");
  return {total: answers.reduce((a,b) => a+b,0), agency: answers[0]+answers[2]+answers[4], pathways: answers[1]+answers[3]+answers[5]};
}
// A conservative first screen, not a complete risk classifier. The model also checks context.
export function needsSafety(text) {
  return /죽\s*고\s*싶|죽어\s*버리|자살|자해|목숨|사라지\s*고\s*싶|살기\s*싫|살고\s*싶지|해치고\s*싶|때려|때렸|맞았|맞고|학대|성폭|성추행|따돌|왕따|집에\s*가기?\s*무서|위험해|다치게\s*하고|kill\s*myself|suicid|self.?harm/i.test(String(text).normalize("NFKC"));
}
export const SAFETY_MESSAGE = "지금은 안전을 먼저 살펴볼게. 혼자 해결하지 않아도 괜찮아. 가까이에 있는 안전한 어른이나 선생님에게 지금 상황을 알려 줘. 보호자가 불편하거나 위험한 사람이라면 다른 믿을 만한 어른에게 도움을 요청해 줘.";
export function safeReply() { return {reply:SAFETY_MESSAGE, stage:"마음 확인", quickReplies:[], action:"safety", goal:null}; }
export function normalizeReply(data) {
  if (!data || typeof data.reply !== "string" || !data.reply.trim() || data.reply.length > 1800)
    throw new Error("AI 응답 형식을 확인할 수 없습니다.");
  const action = ["none","breathing","goal","safety"].includes(data.action) ? data.action : "none";
  if (action === "safety" || needsSafety(data.reply)) return safeReply();
  return {
    reply:data.reply.trim(), stage:STAGES.includes(data.stage)?data.stage:STAGES[0],
    quickReplies:Array.isArray(data.quickReplies)?data.quickReplies.filter(x=>typeof x==="string" && x.length>0 && x.length<=60).slice(0,3):[],
    action, goal: typeof data.goal === "string" && data.goal.trim().length <= 120 ? data.goal.trim() || null : null
  };
}
export function cleanMessage(text) {
  if (typeof text !== "string" || !text.trim() || text.trim().length > 1000) throw new Error("1자부터 1,000자까지 입력해 주세요.");
  return text.trim();
}
