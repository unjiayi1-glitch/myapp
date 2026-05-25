import { useState } from "react";

// ── Trouble Brewing roles ──
const TB_ROLES = [
  { id:"washerwoman",  name:"洗衣女",    en:"Washerwoman",   type:"townsfolk", emoji:"🧺", ability:"开局第一晚：得知两名玩家，其中一名是某个特定镇民角色。" },
  { id:"librarian",    name:"图书管理员", en:"Librarian",     type:"townsfolk", emoji:"📚", ability:"开局第一晚：得知两名玩家，其中一名是某个特定外来者（无外来者则另有提示）。" },
  { id:"investigator", name:"调查员",    en:"Investigator",  type:"townsfolk", emoji:"🔍", ability:"开局第一晚：得知两名玩家，其中一名是某个特定爪牙角色。" },
  { id:"chef",         name:"厨师",      en:"Chef",          type:"townsfolk", emoji:"👨‍🍳", ability:"开局第一晚：得知有多少对邪恶玩家相邻坐着。" },
  { id:"empath",       name:"感应者",    en:"Empath",        type:"townsfolk", emoji:"🫶", ability:"每晚：得知两侧活着邻居中，有几个是邪恶的（0/1/2）。" },
  { id:"fortuneteller",name:"占卜师",    en:"Fortune Teller",type:"townsfolk", emoji:"🔮", ability:"每晚：选两名玩家，得知其中是否有恶魔（有一名红鲱鱼会误判）。" },
  { id:"undertaker",   name:"殡仪师",    en:"Undertaker",    type:"townsfolk", emoji:"⚰️", ability:"每晚（非第一晚）：若昨天有人被处决，得知其真实角色。" },
  { id:"monk",         name:"僧侣",      en:"Monk",          type:"townsfolk", emoji:"🧘", ability:"每晚（非第一晚）：选一名玩家（非自己），今晚其受恶魔保护。" },
  { id:"ravenkeeper",  name:"渡鸦看守人",en:"Ravenkeeper",   type:"townsfolk", emoji:"🐦", ability:"夜晚死亡时：选一名玩家，得知其角色。" },
  { id:"virgin",       name:"圣女",      en:"Virgin",        type:"townsfolk", emoji:"👰", ability:"首次被提名：若提名者是镇民，提名者立刻死亡。" },
  { id:"slayer",       name:"猎手",      en:"Slayer",        type:"townsfolk", emoji:"🏹", ability:"每局一次（白天公开）：指定一名玩家，若其是恶魔则立刻死亡。" },
  { id:"soldier",      name:"士兵",      en:"Soldier",       type:"townsfolk", emoji:"⚔️", ability:"被动：你免疫恶魔的攻击。" },
  { id:"mayor",        name:"市长",      en:"Mayor",         type:"townsfolk", emoji:"🏛️", ability:"仅剩3人且今日无处决：善良方获胜。被恶魔攻击时攻击可能转移到另一人。" },
  { id:"butler",       name:"管家",      en:"Butler",        type:"outsider",  emoji:"🎩", ability:"每晚：选一名主人。明天你只能在主人举手时才能投票。" },
  { id:"drunk",        name:"醉汉",      en:"Drunk",         type:"outsider",  emoji:"🍺", ability:"你不知道自己是醉汉。以为自己是某镇民，但能力实际失效，信息可能不准。" },
  { id:"recluse",      name:"隐居者",    en:"Recluse",       type:"outsider",  emoji:"🏚️", ability:"被动：可能被视为邪恶或爪牙，即使你是善良的。" },
  { id:"saint",        name:"圣徒",      en:"Saint",         type:"outsider",  emoji:"😇", ability:"若你被处决：善良队伍立刻失败。" },
  { id:"poisoner",     name:"下毒者",    en:"Poisoner",      type:"minion",    emoji:"☠️", ability:"每晚：选一名玩家，其今晚及明天白天能力失效。" },
  { id:"spy",          name:"间谍",      en:"Spy",           type:"minion",    emoji:"🕵️", ability:"每晚可查看魔典（所有角色信息）。可能被视为善良或镇民角色。" },
  { id:"scarletwoman", name:"红衣女",    en:"Scarlet Woman", type:"minion",    emoji:"👘", ability:"小鬼死亡时若场上有5+活着玩家：你立刻成为新的小鬼。" },
  { id:"baron",        name:"男爵",      en:"Baron",         type:"minion",    emoji:"🧛", ability:"游戏开始：额外增加2名外来者，减少2名镇民。" },
  { id:"imp",          name:"小鬼",      en:"Imp",           type:"demon",     emoji:"😈", ability:"每晚：选一名玩家死亡。若选自己则死亡，一名爪牙成为新的小鬼。" },
];

// ── Bad Moon Rising roles ──
const BMR_ROLES = [
  { id:"grandmother",   name:"祖母",     en:"Grandmother",      type:"townsfolk", emoji:"👵", ability:"你知道一名善良玩家和他们的角色。若恶魔在夜晚杀死你的"孙辈"，你也会死亡。" },
  { id:"sailor",        name:"水手",     en:"Sailor",           type:"townsfolk", emoji:"⚓", ability:"每晚选择一名活着的玩家：你或他们今晚醉酒直到黄昏。你不能死亡。" },
  { id:"chambermaid",   name:"女仆",     en:"Chambermaid",      type:"townsfolk", emoji:"🧹", ability:"每晚选择两名活着的玩家（非自己）：得知其中有几人今晚因自身能力被唤醒。" },
  { id:"exorcist",      name:"驱魔人",   en:"Exorcist",         type:"townsfolk", emoji:"✝️", ability:"每晚选择一名玩家（不同于上晚）：若选中恶魔，恶魔今晚不行动。" },
  { id:"innkeeper",     name:"旅馆主人", en:"Innkeeper",        type:"townsfolk", emoji:"🏨", ability:"每晚选择两名玩家：他们今晚不会死亡，但其中一人会醉酒。" },
  { id:"gambler",       name:"赌徒",     en:"Gambler",          type:"townsfolk", emoji:"🎰", ability:"每晚选择一名玩家并猜测其角色：若猜错，你死亡。" },
  { id:"gossip",        name:"八卦者",   en:"Gossip",           type:"townsfolk", emoji:"💬", ability:"每天白天可以公开发表一个陈述。今晚，若该陈述为真，一名邪恶玩家死亡。" },
  { id:"courtier",      name:"宫廷侍从", en:"Courtier",         type:"townsfolk", emoji:"🎭", ability:"每局一次，夜晚选择一个角色：该角色醉酒3个夜晚和白天。" },
  { id:"professor",     name:"教授",     en:"Professor",        type:"townsfolk", emoji:"🎓", ability:"每局一次，夜晚选择一名死亡玩家：若其是镇民，他们复活。" },
  { id:"minstrel",      name:"吟游诗人", en:"Minstrel",         type:"townsfolk", emoji:"🎵", ability:"当一名爪牙被处决死亡时，所有其他玩家（旅行者除外）醉酒直到明天黄昏。" },
  { id:"tealady",       name:"茶女",     en:"Tea Lady",         type:"townsfolk", emoji:"🍵", ability:"被动：若你两侧活着的邻居都是善良的，他们不能死亡。" },
  { id:"pacifist",      name:"和平主义者",en:"Pacifist",        type:"townsfolk", emoji:"☮️", ability:"被动：被处决的善良玩家偶尔可能不会死亡。" },
  { id:"fool",          name:"傻瓜",     en:"Fool",             type:"townsfolk", emoji:"🤡", ability:"被动：你第一次死亡时，你不会死。" },
  { id:"tinker",        name:"修补匠",   en:"Tinker",           type:"outsider",  emoji:"🔧", ability:"你可能在任何时候死亡。" },
  { id:"moonchild",     name:"月之子",   en:"Moonchild",        type:"outsider",  emoji:"🌙", ability:"当你得知自己死亡时，公开选择一名玩家：若其是善良的，他们死亡。" },
  { id:"goon",          name:"呆瓜",     en:"Goon",             type:"outsider",  emoji:"🤤", ability:"每晚，第一个用能力选择你的玩家变为醉酒直到黄昏。你变为与其相同的阵营。" },
  { id:"lunatic",       name:"疯子",     en:"Lunatic",          type:"outsider",  emoji:"🌀", ability:"你以为自己是恶魔但实际上不是。恶魔知道你是谁。你攻击你以为恶魔会攻击的玩家。" },
  { id:"godfather",     name:"教父",     en:"Godfather",        type:"minion",    emoji:"🤵", ability:"你知道场上有哪些外来者。每晚，若今天有外来者死亡，选择一名玩家：他们死亡。[-1/+1外来者]" },
  { id:"devilsadvocate",name:"魔鬼代言人",en:"Devil's Advocate", type:"minion",   emoji:"😈", ability:"每晚选择一名活着的玩家（不同于上晚）：若其明天被处决，他们不会死亡。" },
  { id:"assassin",      name:"刺客",     en:"Assassin",         type:"minion",    emoji:"🗡️", ability:"每局一次，夜晚选择一名玩家：他们死亡，即使通常无法死亡。" },
  { id:"mastermind",    name:"幕后黑手", en:"Mastermind",       type:"minion",    emoji:"🧠", ability:"若恶魔被处决（游戏结束），游戏秘密额外继续进行一天。" },
  { id:"zombuul",       name:"僵尸",     en:"Zombuul",          type:"demon",     emoji:"🧟", ability:"每晚，若今天没有人死亡，你可以选择一名玩家：他们死亡。你可能对所有能力显示为已死亡。" },
  { id:"pukka",         name:"噗卡",     en:"Pukka",            type:"demon",     emoji:"🐙", ability:"每晚选择一名玩家：他们中毒。上一个被中毒的玩家死亡后恢复健康。" },
  { id:"shabaloth",     name:"沙巴洛斯", en:"Shabaloth",        type:"demon",     emoji:"👾", ability:"每晚选择两名玩家：他们死亡。你可以选择吐出一名之前死亡的玩家使其复活。" },
  { id:"po",            name:"颇",       en:"Po",               type:"demon",     emoji:"💀", ability:"每晚你可以选择一名玩家：他们死亡。若你上晚没有选择任何人，今晚选择三名玩家。" },
];

const SCRIPTS = {
  tb:  { id:"tb",  name:"钟楼惊魂",  en:"Trouble Brewing",  emoji:"🍺", color:"#c9a84c", roles: TB_ROLES,
         nightFirst: ["下毒者","间谍","男爵","洗衣女","图书管理员","调查员","厨师","感应者","占卜师","管家","小鬼"],
         nightOther: ["下毒者","僧侣","间谍","红衣女","小鬼","渡鸦看守人","殡仪师","感应者","占卜师","管家"] },
  bmr: { id:"bmr", name:"月升之夜",  en:"Bad Moon Rising",  emoji:"🌕", color:"#e8a0ff", roles: BMR_ROLES,
         nightFirst: ["疯子","教父","魔鬼代言人","水手","宫廷侍从","旅馆主人","祖母","女仆"],
         nightOther: ["吟游诗人（若触发）","疯子","教父","魔鬼代言人","刺客","僵尸","噗卡","沙巴洛斯","颇","水手","宫廷侍从","旅馆主人","祖母","女仆","驱魔人","赌徒","八卦者","教授","傻瓜（若触发）","修补匠（若触发）","月之子（若触发）"] },
};

const ALL_ROLES = [...TB_ROLES, ...BMR_ROLES];

const TYPE_INFO = {
  townsfolk: { label:"镇民",   color:"#4fc3f7", team:"善良", bg:"#061828", border:"#1a4a6a" },
  outsider:  { label:"外来者", color:"#ce93d8", team:"善良", bg:"#100820", border:"#3a1a5a" },
  minion:    { label:"爪牙",   color:"#ef9a9a", team:"邪恶", bg:"#200808", border:"#5a2020" },
  demon:     { label:"恶魔",   color:"#ff5252", team:"邪恶", bg:"#1a0000", border:"#6a0000" },
};

const SETUP_TABLE = {
  5:{tf:3,os:0,mn:1,dm:1}, 6:{tf:3,os:1,mn:1,dm:1}, 7:{tf:5,os:0,mn:1,dm:1},
  8:{tf:5,os:1,mn:1,dm:1}, 9:{tf:5,os:2,mn:1,dm:1}, 10:{tf:7,os:0,mn:2,dm:1},
  11:{tf:7,os:1,mn:2,dm:1},12:{tf:7,os:2,mn:2,dm:1},13:{tf:9,os:0,mn:3,dm:1},
  14:{tf:9,os:1,mn:3,dm:1},15:{tf:9,os:2,mn:3,dm:1},
};
const TYPE_KEY = { townsfolk:"tf", outsider:"os", minion:"mn", demon:"dm" };

const BG=  "#0d0a0b";
const CARD="#1a1410";
const BDR= "#3d2e1e";
const GOLD="#c9a84c";
const TEXT="#e8dcc8";
const DIM= "#8a7a6a";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function roleMessage(playerName, role) {
  const ti = TYPE_INFO[role.type];
  return (
    "【血染钟楼 · 你的角色】\n" +
    "━━━━━━━━━━━━━━\n" +
    "玩家：" + playerName + "\n" +
    "角色：" + role.emoji + " " + role.name + "（" + role.en + "）\n" +
    "阵营：" + ti.team + " · " + ti.label + "\n" +
    "━━━━━━━━━━━━━━\n" +
    "【技能说明】\n" +
    role.ability + "\n" +
    "━━━━━━━━━━━━━━\n" +
    "⚠️ 请勿将此信息分享给其他玩家！"
  );
}

function whatsappLink(text) {
  return "https://api.whatsapp.com/send?text=" + encodeURIComponent(text);
}

// ─── UI COMPONENTS ───────────────────────────────────────────────
function GoldBtn({ children, onClick, disabled, ghost }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "13px 16px",
      background: disabled ? "#1e1e1e" : ghost ? "none" : "linear-gradient(135deg,#c9a84c,#8a6a2a)",
      border: ghost ? "1px solid " + BDR : "none",
      borderRadius: 10,
      color: disabled ? "#4a4a4a" : ghost ? DIM : "#0d0a0b",
      fontSize: 15, fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
    }}>
      {children}
    </button>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div style={{ padding:"14px 16px", background:"#160a00", borderBottom:"1px solid "+BDR, display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:10 }}>
      {onBack && <button onClick={onBack} style={{ background:"none", border:"none", color:GOLD, fontSize:22, cursor:"pointer", padding:0 }}>←</button>}
      <h2 style={{ margin:0, fontSize:18, color:GOLD, flex:1 }}>{title}</h2>
      {right}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────
function HomeScreen({ onStart }) {
  const [picked, setPicked] = useState(null);

  return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at 50% 30%,#1e0800,"+BG+" 70%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center" }}>
      <div style={{ fontSize:72, marginBottom:12, filter:"drop-shadow(0 0 24px #c9a84c88)" }}>⏰</div>
      <h1 style={{ fontSize:30, fontWeight:700, color:GOLD, margin:"0 0 6px", letterSpacing:3 }}>血染钟楼</h1>
      <p style={{ color:DIM, fontSize:12, margin:"0 0 32px", letterSpacing:3 }}>BLOOD ON THE CLOCKTOWER</p>

      {/* Script selection */}
      <p style={{ color:DIM, fontSize:13, marginBottom:14 }}>选择剧本</p>
      <div style={{ display:"flex", gap:12, marginBottom:28, width:"100%", maxWidth:320 }}>
        {Object.values(SCRIPTS).map(sc => (
          <button key={sc.id} onClick={() => setPicked(sc.id)} style={{
            flex:1, padding:"16px 8px",
            background: picked === sc.id ? "#2a1a00" : CARD,
            border: "2px solid " + (picked === sc.id ? sc.color : BDR),
            borderRadius:12, cursor:"pointer", fontFamily:"inherit",
            transition:"all 0.2s",
          }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{sc.emoji}</div>
            <div style={{ fontSize:13, fontWeight:700, color: picked===sc.id ? sc.color : TEXT }}>{sc.name}</div>
            <div style={{ fontSize:10, color:DIM, marginTop:2 }}>{sc.en}</div>
          </button>
        ))}
      </div>

      <div style={{ maxWidth:300, width:"100%" }}>
        <GoldBtn onClick={() => onStart(picked)} disabled={!picked}>
          {picked ? "⚔️ 说书人：创建新游戏 →" : "↑ 请先选择剧本"}
        </GoldBtn>
      </div>

      <div style={{ marginTop:28, background:CARD, border:"1px solid "+BDR, borderRadius:12, padding:14, maxWidth:300, width:"100%", textAlign:"left" }}>
        {picked && (
          <div style={{ marginBottom:10, fontSize:12, color:SCRIPTS[picked].color, fontWeight:700 }}>
            {SCRIPTS[picked].emoji} {SCRIPTS[picked].name}
          </div>
        )}
        {[
          picked === "bmr" ? "⚠️ 中级剧本 — 恶魔每晚可杀多人" : "✅ 新手剧本 — 推荐初次游玩",
          "说书人输入玩家名字",
          "选择或自动分配角色",
          "WhatsApp 单独发角色给每人",
          "游戏开始，说书人主持"
        ].map((s, i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:6, alignItems:"flex-start" }}>
            <span style={{ color:GOLD, fontSize:12, minWidth:18 }}>{i === 0 ? "📌" : i+"."}</span>
            <span style={{ color: i===0 ? "#ffcc66" : DIM, fontSize:12, lineHeight:1.6 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETUP ────────────────────────────────────────────────────────
function SetupScreen({ names, setNames, onNext, onBack }) {
  const valid = names.filter(n => n.trim()).length;
  const dist = SETUP_TABLE[valid];
  const ok = valid >= 5 && valid <= 15;

  function add() { if (names.length < 15) setNames([...names, ""]); }
  function remove(i) { if (names.length > 5) setNames(names.filter((_, x) => x !== i)); }
  function upd(i, v) { const a = [...names]; a[i] = v; setNames(a); }

  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT }}>
      <TopBar title="添加玩家" onBack={onBack}
        right={<span style={{ color:ok?"#66bb6a":"#ef5350", fontSize:12 }}>{valid}/15</span>} />
      <div style={{ padding:16 }}>
        {dist && (
          <div style={{ background:CARD, border:"1px solid "+BDR, borderRadius:10, padding:12, marginBottom:16, display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:12, color:"#4fc3f7" }}>镇民 ×{dist.tf}</span>
            <span style={{ fontSize:12, color:"#ce93d8" }}>外来者 ×{dist.os}</span>
            <span style={{ fontSize:12, color:"#ef9a9a" }}>爪牙 ×{dist.mn}</span>
            <span style={{ fontSize:12, color:"#ff5252" }}>恶魔 ×{dist.dm}</span>
          </div>
        )}
        {names.map((nm, i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
            <span style={{ color:DIM, fontSize:13, minWidth:22 }}>{i+1}.</span>
            <input value={nm} onChange={e => upd(i, e.target.value)} placeholder={"玩家 "+(i+1)}
              style={{ flex:1, padding:"11px 12px", background:CARD, border:"1px solid "+BDR, borderRadius:8, color:TEXT, fontSize:15, fontFamily:"inherit", outline:"none" }} />
            {names.length > 5 && (
              <button onClick={() => remove(i)} style={{ background:"#200808", border:"1px solid #5a1a1a", borderRadius:8, color:"#ef5350", width:36, height:36, cursor:"pointer", fontSize:18, flexShrink:0 }}>×</button>
            )}
          </div>
        ))}
        {names.length < 15 && (
          <button onClick={add} style={{ width:"100%", padding:12, background:"none", border:"1px dashed "+BDR, borderRadius:8, color:DIM, fontSize:14, cursor:"pointer", marginBottom:12, fontFamily:"inherit" }}>+ 添加玩家</button>
        )}
        {valid < 5 && <p style={{ color:"#ef5350", fontSize:12, textAlign:"center", margin:"8px 0" }}>至少需要 5 名玩家</p>}
        <div style={{ marginTop:8 }}><GoldBtn onClick={onNext} disabled={!ok}>下一步：选择角色 →</GoldBtn></div>
      </div>
    </div>
  );
}

// ─── ROLE SELECT ──────────────────────────────────────────────────
function RoleSelectScreen({ scriptRoles, playerCount, selRoles, setSelRoles, onGo, onBack }) {
  const dist = SETUP_TABLE[playerCount] || SETUP_TABLE[5];
  const hasBaron = selRoles.includes("baron") || selRoles.includes("godfather");
  const need = { tf:hasBaron?dist.tf-2:dist.tf, os:hasBaron?dist.os+2:dist.os, mn:dist.mn, dm:dist.dm };
  const cnt = { tf:0, os:0, mn:0, dm:0 };
  selRoles.forEach(id => { const r = ALL_ROLES.find(x => x.id === id); if (r) cnt[TYPE_KEY[r.type]]++; });
  const ok = cnt.tf >= need.tf && cnt.os >= need.os && cnt.mn >= need.mn && cnt.dm >= need.dm;

  function toggle(id) { setSelRoles(selRoles.includes(id) ? selRoles.filter(x => x !== id) : [...selRoles, id]); }
  function autoSelect() {
    const res = [];
    [["demon","dm"],["minion","mn"],["outsider","os"],["townsfolk","tf"]].forEach(function(p) {
      shuffle(scriptRoles.filter(r => r.type === p[0])).slice(0, need[p[1]]).forEach(r => res.push(r.id));
    });
    setSelRoles(res);
  }

  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT, paddingBottom:88 }}>
      <div style={{ padding:"14px 16px", background:"#160a00", borderBottom:"1px solid "+BDR, display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:GOLD, fontSize:22, cursor:"pointer", padding:0 }}>←</button>
        <h2 style={{ margin:0, fontSize:18, color:GOLD, flex:1 }}>选择角色</h2>
        <button onClick={autoSelect} style={{ padding:"7px 14px", background:"#2a1a00", border:"1px solid "+GOLD, borderRadius:8, color:GOLD, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>自动选</button>
      </div>
      <div style={{ padding:"12px 16px 0" }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          {["townsfolk","outsider","minion","demon"].map(type => {
            const k = TYPE_KEY[type]; const ti = TYPE_INFO[type]; const good = cnt[k] >= need[k];
            return (
              <span key={type} style={{ fontSize:11, padding:"4px 10px", borderRadius:20, background:good?"#0a2a0a":"#2a0808", color:good?"#66bb6a":"#ef5350", border:"1px solid "+(good?"#1a5a1a":"#5a1a1a") }}>
                {ti.label} {cnt[k]}/{need[k]}
              </span>
            );
          })}
        </div>
        {["townsfolk","outsider","minion","demon"].map(type => {
          const ti = TYPE_INFO[type]; const k = TYPE_KEY[type];
          return (
            <div key={type} style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, color:ti.color, letterSpacing:2, fontWeight:700, borderLeft:"3px solid "+ti.color, paddingLeft:8, marginBottom:10 }}>
                {ti.label.toUpperCase()} — 需要 {need[k]} 个
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {scriptRoles.filter(r => r.type === type).map(role => {
                  const sel = selRoles.includes(role.id);
                  return (
                    <button key={role.id} onClick={() => toggle(role.id)} style={{ padding:"9px 14px", background:sel?ti.bg:CARD, border:"1px solid "+(sel?ti.color:BDR), borderRadius:8, color:sel?ti.color:DIM, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>
                      <span>{role.emoji}</span><span>{role.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:16, background:BG, borderTop:"1px solid "+BDR }}>
        <GoldBtn onClick={onGo} disabled={!ok}>{ok ? "🎲 随机分配角色 →" : "角色数量不足，请继续选择"}</GoldBtn>
      </div>
    </div>
  );
}

// ─── SEND ROLES ───────────────────────────────────────────────────
function SendRolesScreen({ players, onStart }) {
  const [sentIds, setSentIds] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [mode, setMode] = useState("whatsapp"); // "whatsapp" | "passphone"
  const [phoneIdx, setPhoneIdx] = useState(0);
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const allSent = sentIds.length === players.length;

  // ── WhatsApp Mode ──
  function markSent(id) {
    if (!sentIds.includes(id)) setSentIds([...sentIds, id]);
  }

  function copyText(player) {
    navigator.clipboard.writeText(roleMessage(player.name, player.role)).then(() => {
      setCopiedId(player.id);
      markSent(player.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  function openWhatsApp(player) {
    markSent(player.id);
    window.open(whatsappLink(roleMessage(player.name, player.role)), "_blank");
  }

  // ── Pass Phone Mode ──
  const phonePl = players[phoneIdx];
  const phoneRole = phonePl ? phonePl.role : null;
  const phoneTi = phoneRole ? TYPE_INFO[phoneRole.type] : {};
  const phoneIsLast = phoneIdx === players.length - 1;

  function phoneNext() {
    if (phoneIsLast) {
      setMode("done");
    } else {
      setPhoneIdx(phoneIdx + 1);
      setPhoneRevealed(false);
    }
  }

  if (mode === "passphone") {
    return (
      <div style={{ minHeight:"100vh", background:BG, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20 }}>
        <p style={{ color:DIM, fontSize:12, marginBottom:8 }}>玩家 {phoneIdx+1} / {players.length}</p>
        <div style={{ width:"100%", maxWidth:340, background:phoneRevealed?phoneTi.bg:CARD, border:"2px solid "+(phoneRevealed?phoneTi.border:BDR), borderRadius:18, overflow:"hidden", marginBottom:16 }}>
          <div style={{ background:"#1e1200", padding:"16px 20px", borderBottom:"1px solid "+BDR, textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:700, color:GOLD }}>{phonePl ? phonePl.name : ""}</div>
            <div style={{ fontSize:12, color:DIM, marginTop:4 }}>确认只有你在看屏幕 👀</div>
          </div>
          {!phoneRevealed ? (
            <div style={{ padding:40, textAlign:"center" }}>
              <div style={{ fontSize:64, marginBottom:20 }}>🃏</div>
              <GoldBtn onClick={() => setPhoneRevealed(true)}>查看我的角色</GoldBtn>
            </div>
          ) : (
            <div style={{ padding:20, textAlign:"center" }}>
              <div style={{ fontSize:64, marginBottom:8 }}>{phoneRole ? phoneRole.emoji : ""}</div>
              <div style={{ fontSize:26, fontWeight:700, color:phoneTi.color, marginBottom:4 }}>{phoneRole ? phoneRole.name : ""}</div>
              <div style={{ fontSize:12, color:DIM, marginBottom:12 }}>{phoneRole ? phoneRole.en : ""}</div>
              <span style={{ display:"inline-block", padding:"5px 14px", background:"#0d0a0b", border:"1px solid "+(phoneTi.color+"44"), borderRadius:20, fontSize:12, color:phoneTi.color, marginBottom:16 }}>
                {phoneTi.team} · {phoneTi.label}
              </span>
              <div style={{ background:"#0d0a0b", borderRadius:10, padding:"12px 14px", fontSize:13, color:"#c8b896", lineHeight:1.8, textAlign:"left" }}>
                {phoneRole ? phoneRole.ability : ""}
              </div>
            </div>
          )}
        </div>
        {phoneRevealed && (
          <GoldBtn onClick={phoneNext}>
            {phoneIsLast ? "✅ 所有人已看，开始游戏" : "✓ 已记住，下一位 →"}
          </GoldBtn>
        )}
        <button onClick={() => { setMode("whatsapp"); setPhoneIdx(0); setPhoneRevealed(false); }}
          style={{ marginTop:12, background:"none", border:"none", color:DIM, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
          切换到 WhatsApp 发送
        </button>
      </div>
    );
  }

  if (mode === "done") {
    return (
      <div style={{ minHeight:"100vh", background:BG, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>✅</div>
        <h2 style={{ color:GOLD, marginBottom:8 }}>所有人已确认角色</h2>
        <p style={{ color:DIM, fontSize:14, marginBottom:32 }}>游戏开始！</p>
        <div style={{ maxWidth:280, width:"100%" }}>
          <GoldBtn onClick={onStart}>🎮 开始游戏</GoldBtn>
        </div>
      </div>
    );
  }

  // Default: WhatsApp mode
  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT, paddingBottom:100 }}>
      <TopBar title="发送角色" />
      <div style={{ padding:16 }}>

        {/* Mode toggle */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          <button onClick={() => setMode("whatsapp")} style={{ flex:1, padding:"10px", background:mode==="whatsapp"?"#2a1a00":CARD, border:"1px solid "+(mode==="whatsapp"?GOLD:BDR), borderRadius:8, color:mode==="whatsapp"?GOLD:DIM, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            📱 WhatsApp 发送
          </button>
          <button onClick={() => { setMode("passphone"); setPhoneIdx(0); setPhoneRevealed(false); }} style={{ flex:1, padding:"10px", background:CARD, border:"1px solid "+BDR, borderRadius:8, color:DIM, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            📲 传递手机
          </button>
        </div>

        <div style={{ background:"#0a140a", border:"1px solid #1a3a1a", borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
          <p style={{ margin:0, fontSize:12, color:"#88aa88", lineHeight:1.8 }}>
            点「📤 WhatsApp」把角色消息单独发给每位玩家{"\n"}
            发送后打✓表示已发送{"\n"}
            玩家收到消息后自己保密
          </p>
        </div>

        {players.map(player => {
          const ti = TYPE_INFO[player.role.type];
          const sent = sentIds.includes(player.id);
          const exp = expandedId === player.id;
          return (
            <div key={player.id} style={{ background:CARD, border:"1px solid "+(sent?"#1a4a1a":BDR), borderRadius:12, marginBottom:12, overflow:"hidden" }}>
              <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, background:sent?"#0a2a0a":"#2a1a08", border:"1px solid "+(sent?"#1a5a1a":BDR), borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>
                  {sent ? "✓" : (player.id + 1)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:TEXT }}>{player.name}</div>
                  <div style={{ fontSize:11, color:sent?"#66bb6a":DIM }}>{sent ? "已发送 ✓" : "待发送"}</div>
                </div>
                {/* Storyteller expand to see role */}
                <button onClick={() => setExpandedId(exp ? null : player.id)}
                  style={{ background:"none", border:"none", color:DIM, fontSize:12, cursor:"pointer", padding:"4px 8px", fontFamily:"inherit" }}>
                  {exp ? "▲ 隐藏" : "▼ 查看角色"}
                </button>
              </div>

              {exp && (
                <div style={{ padding:"0 14px 12px", background:ti.bg, borderTop:"1px solid "+BDR }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, paddingTop:12, marginBottom:8 }}>
                    <span style={{ fontSize:28 }}>{player.role.emoji}</span>
                    <div>
                      <div style={{ color:ti.color, fontWeight:700, fontSize:15 }}>{player.role.name}</div>
                      <div style={{ color:DIM, fontSize:12 }}>{ti.team} · {ti.label}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:"#c8b896", lineHeight:1.8, marginBottom:12 }}>{player.role.ability}</div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ padding:"0 14px 14px", display:"flex", gap:8 }}>
                <button onClick={() => openWhatsApp(player)}
                  style={{ flex:1, padding:"11px 8px", background:"#25d366", border:"none", borderRadius:8, color:"#fff", fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>
                  📤 WhatsApp 发给 {player.name}
                </button>
                <button onClick={() => copyText(player)}
                  style={{ padding:"11px 14px", background:copiedId===player.id?"#0a2a0a":CARD, border:"1px solid "+(copiedId===player.id?"#1a5a1a":BDR), borderRadius:8, color:copiedId===player.id?"#66bb6a":DIM, fontSize:13, cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>
                  {copiedId === player.id ? "✓" : "复制"}
                </button>
              </div>
            </div>
          );
        })}

        {/* Progress */}
        <div style={{ textAlign:"center", padding:"8px 0 4px", fontSize:12, color:DIM }}>
          已发送 {sentIds.length} / {players.length} 人
        </div>
        <div style={{ height:6, background:"#1a1410", borderRadius:3, overflow:"hidden", marginBottom:8 }}>
          <div style={{ height:"100%", width:(sentIds.length/players.length*100)+"%", background:"linear-gradient(90deg,#4a8a2a,#66bb6a)", transition:"width 0.3s" }} />
        </div>
      </div>

      <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:16, background:BG, borderTop:"1px solid "+BDR }}>
        <GoldBtn onClick={onStart} disabled={sentIds.length === 0}>
          {allSent ? "🎮 所有人已发送，开始游戏！" : "🎮 跳过，直接开始游戏"}
        </GoldBtn>
      </div>
    </div>
  );
}

// ─── GAME SCREEN ─────────────────────────────────────────────────
function GameScreen({ players, setPlayers, nightFirst, nightOther, scriptName, onEnd }) {
  const [phase, setPhase] = useState("day");
  const [round, setRound] = useState(1);
  const [stMode, setStMode] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [noms, setNoms] = useState([]);
  const [nomA, setNomA] = useState("");
  const [nomB, setNomB] = useState("");

  const alive = players.filter(p => p.alive);
  const nightOrder = round === 1 ? nightFirst : nightOther;
  const phaseColor = phase === "day" ? "#f5c030" : "#8888ff";

  function toggleDead(id) { setPlayers(players.map(p => p.id === id ? { ...p, alive: !p.alive } : p)); }
  function goNight() { setPhase("night"); }
  function goDay() { setPhase("day"); setRound(r => r + 1); setNoms([]); }
  function addNom() {
    if (nomA && nomB && nomA !== nomB) {
      setNoms([...noms, { a:nomA, b:nomB }]);
      setNomA(""); setNomB("");
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT, paddingBottom:80 }}>
      <div style={{ padding:"12px 16px", background:phase==="day"?"#150f00":"#050518", borderBottom:"1px solid "+BDR, position:"sticky", top:0, zIndex:10, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:19, fontWeight:700, color:phaseColor }}>{phase==="day"?"☀️ 白天":"🌙 夜晚"} 第 {round} 轮</div>
          <div style={{ fontSize:11, color:DIM }}>{scriptName} · 存活 {alive.length} 人</div>
        </div>
        <button onClick={() => setStMode(!stMode)} style={{ padding:"6px 11px", background:stMode?"#2a1500":CARD, border:"1px solid "+(stMode?GOLD:BDR), borderRadius:8, color:stMode?GOLD:DIM, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
          {stMode ? "🔓 说书人" : "🔒 说书人"}
        </button>
        <button onClick={phase==="day"?goNight:goDay} style={{ padding:"8px 12px", background:phase==="day"?"#0a0a20":"#201000", border:"1px solid "+BDR, borderRadius:8, color:phaseColor, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
          {phase==="day" ? "→ 夜晚" : "→ 白天"}
        </button>
      </div>

      <div style={{ padding:16 }}>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          <div style={{ flex:1, padding:"8px 10px", background:"#061a06", border:"1px solid #1a4a1a", borderRadius:8, fontSize:11, color:"#4fc3f7", textAlign:"center" }}>✅ 善良：处决恶魔</div>
          <div style={{ flex:1, padding:"8px 10px", background:"#1a0606", border:"1px solid #4a1a1a", borderRadius:8, fontSize:11, color:"#ef9a9a", textAlign:"center" }}>💀 邪恶：仅剩2人</div>
        </div>

        <div style={{ fontSize:10, color:DIM, letterSpacing:2, marginBottom:8 }}>{stMode ? "👁 说书人视角" : "👥 玩家状态（角色已隐藏）"}</div>

        {players.map(player => {
          const ti = TYPE_INFO[player.role.type];
          const isExp = expanded === player.id;
          return (
            <div key={player.id} onClick={() => stMode && setExpanded(isExp ? null : player.id)}
              style={{ background:player.alive?CARD:"#0f0d0c", border:"1px solid "+(player.alive?BDR:"#1a1a1a"), borderRadius:10, marginBottom:8, overflow:"hidden", cursor:stMode?"pointer":"default", opacity:player.alive?1:0.5 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px" }}>
                {/* Icon: role emoji only in storyteller mode */}
                <div style={{ width:36, height:36, background:stMode?ti.bg:"#1a1410", border:"1px solid "+(stMode?ti.border:BDR), borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:stMode?20:16, flexShrink:0, color:stMode?"inherit":DIM }}>
                  {stMode ? player.role.emoji : (player.alive ? "🧑" : "💀")}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:player.alive?TEXT:"#5a5a5a" }}>{player.name}</div>
                  {stMode
                    ? <div style={{ fontSize:12, color:ti.color }}>{player.role.name} · {ti.team} · {ti.label}</div>
                    : <div style={{ fontSize:12, color:"#5a4a3a" }}>{player.alive ? "存活" : "已死亡"}</div>
                  }
                </div>
                {stMode && (
                  <button onClick={e => { e.stopPropagation(); toggleDead(player.id); }}
                    style={{ padding:"6px 10px", background:player.alive?"#250808":"#082508", border:"1px solid "+(player.alive?"#5a1a1a":"#1a5a1a"), borderRadius:8, color:player.alive?"#ef5350":"#66bb6a", fontSize:12, cursor:"pointer", flexShrink:0, fontFamily:"inherit" }}>
                    {player.alive ? "死亡" : "复活"}
                  </button>
                )}
                {stMode && <span style={{ color:DIM, fontSize:12 }}>{isExp?"▲":"▼"}</span>}
              </div>
              {isExp && stMode && (
                <div style={{ padding:"0 14px 14px", borderTop:"1px solid "+BDR, background:ti.bg }}>
                  <div style={{ fontSize:13, color:ti.color, fontWeight:700, margin:"10px 0 6px" }}>{player.role.emoji} {player.role.name} ({player.role.en})</div>
                  <div style={{ fontSize:12, color:"#c8b896", lineHeight:1.8 }}>{player.role.ability}</div>
                </div>
              )}
            </div>
          );
        })}

        {phase === "day" && (
          <div style={{ marginTop:20, background:CARD, border:"1px solid "+BDR, borderRadius:12, padding:14 }}>
            <div style={{ fontSize:12, color:GOLD, fontWeight:700, marginBottom:12 }}>📋 今日提名记录</div>
            {noms.length === 0 && <p style={{ fontSize:12, color:DIM, margin:"0 0 12px" }}>暂无提名</p>}
            {noms.map((nom, i) => (
              <div key={i} style={{ padding:"8px 12px", background:"#140e08", border:"1px solid "+BDR, borderRadius:8, marginBottom:6, fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color:DIM }}>{nom.a}</span>
                <span style={{ color:"#5a4a3a", fontSize:11 }}>提名</span>
                <span style={{ color:"#ef9a9a", fontWeight:700 }}>{nom.b}</span>
              </div>
            ))}
            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <select value={nomA} onChange={e => setNomA(e.target.value)} style={{ flex:1, padding:"9px 8px", background:"#140e08", border:"1px solid "+BDR, borderRadius:8, color:TEXT, fontSize:13, fontFamily:"inherit" }}>
                <option value="">提名者...</option>
                {alive.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <select value={nomB} onChange={e => setNomB(e.target.value)} style={{ flex:1, padding:"9px 8px", background:"#140e08", border:"1px solid "+BDR, borderRadius:8, color:TEXT, fontSize:13, fontFamily:"inherit" }}>
                <option value="">被提名...</option>
                {alive.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <button onClick={addNom} style={{ padding:"9px 14px", background:"#2a1a00", border:"1px solid "+GOLD, borderRadius:8, color:GOLD, fontSize:18, cursor:"pointer" }}>+</button>
            </div>
          </div>
        )}

        {phase === "night" && (
          <div style={{ marginTop:20, background:"#06060f", border:"1px solid #1a1a3a", borderRadius:12, padding:14 }}>
            <div style={{ fontSize:12, color:"#8888ff", fontWeight:700, marginBottom:12 }}>🌙 {round===1?"第一晚":"每晚"} 行动顺序</div>
            {nightOrder.map((r, i) => (
              <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:"1px solid #0f0f1a", alignItems:"center" }}>
                <span style={{ minWidth:22, height:22, background:"#12123a", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#6666cc", fontWeight:700, flexShrink:0 }}>{i+1}</span>
                <span style={{ fontSize:14, color:"#c8c8ff" }}>{r}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:"12px 16px", background:BG, borderTop:"1px solid "+BDR }}>
        <GoldBtn ghost onClick={onEnd}>结束游戏 / 返回首页</GoldBtn>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]     = useState("home");
  const [script, setScript]     = useState(null);
  const [names, setNames]       = useState(["","","","",""]);
  const [selRoles, setSelRoles] = useState([]);
  const [players, setPlayers]   = useState([]);

  const validNames = names.filter(n => n.trim());
  const currentScript = script ? SCRIPTS[script] : SCRIPTS.tb;
  const scriptRoles = currentScript.roles;

  function startWithScript(scriptId) {
    setScript(scriptId);
    setSelRoles(SCRIPTS[scriptId].roles.map(r => r.id));
    setScreen("setup");
  }

  function assignRoles() {
    const pc   = validNames.length;
    const dist = SETUP_TABLE[pc];
    const hasBaron = selRoles.includes("baron") || selRoles.includes("godfather");
    const tfN  = hasBaron ? dist.tf - 2 : dist.tf;
    const osN  = hasBaron ? dist.os + 2 : dist.os;

    function pick(type, n) {
      return shuffle(scriptRoles.filter(r => r.type === type && selRoles.includes(r.id))).slice(0, n);
    }

    const pool = shuffle([...pick("demon",dist.dm),...pick("minion",dist.mn),...pick("outsider",osN),...pick("townsfolk",tfN)]);
    setPlayers(validNames.map((name, i) => ({ id:i, name, role:pool[i], alive:true })));
    setScreen("send");
  }

  return (
    <div style={{ fontFamily:"'Noto Serif SC',Georgia,serif" }}>
      {screen === "home"       && <HomeScreen onStart={startWithScript} />}
      {screen === "setup"      && <SetupScreen names={names} setNames={setNames} onNext={() => setScreen("roleselect")} onBack={() => setScreen("home")} />}
      {screen === "roleselect" && <RoleSelectScreen scriptRoles={scriptRoles} playerCount={validNames.length} selRoles={selRoles} setSelRoles={setSelRoles} onGo={assignRoles} onBack={() => setScreen("setup")} />}
      {screen === "send"       && <SendRolesScreen players={players} onStart={() => setScreen("game")} />}
      {screen === "game"       && <GameScreen players={players} setPlayers={setPlayers} nightFirst={currentScript.nightFirst} nightOther={currentScript.nightOther} scriptName={currentScript.name} onEnd={() => setScreen("home")} />}
    </div>
  );
}
