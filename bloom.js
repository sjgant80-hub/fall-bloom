// ◊·κ FALL-BLOOM · v1.0 · 2026-05-28
// Text → 7-ring vector decomposition · spine primes 2,3,5,7,11,13,17
// Ported from teslasolar/MissCassandra/js/bloom.js (MIT) with sovereign-AI vocab extensions
// Aligned to v18/v19 seed · B(Q)=[r0..r6] · P(Q)=Π(p_i^r_i)
//
// HOT-LOAD SAFE · version guard + idempotent · see fall-hot README "Hot-load-safe plugin discipline"
//
// USAGE:
//   <script src="https://sjgant80-hub.github.io/fall-bloom/bloom.js" defer></script>
//   <script>
//     const r = window.bloom.decompose('search the gate for the kappa walker on the torus');
//     // r.bloom = [0,1,1,0,0,1,1] (R0..R6 counts)
//     // r.product = 1155n (= 3 × 5 × 7 × 11)
//     // r.dominantLabel = 'sensor' (or other ring name)
//     console.log(r);
//   </script>

(function fallBloom(){
  if (window.bloom && window.bloom._v >= 1) return;

  var PRIMES = [2n, 3n, 5n, 7n, 11n, 13n, 17n];
  var RING_KEYS = ['R0','R1','R2','R3','R4','R5','R6'];
  var RING_LABELS = ['ground','sensor','gate','affect','executive','identity','observer'];
  var RING_COLORS = ['#660044','#00AAFF','#FFAA00','#FF4444','#44AA44','#AA44FF','#FFFFFF'];

  var RING_WORDS = {
    R0: ['help','fix','broken','down','deploy','server','build','run','start','stop','crash','restart','install','hardware','resource','gpu','cpu','torus','walker','kangaroo','solver','signal'],
    R1: ['find','search','look','check','monitor','scan','watch','detect','alert','log','track','measure','notice','see','hear','observe','sense','pulse','probe','listen','heartbeat'],
    R2: ['filter','block','allow','route','gate','triage','review','approve','reject','sort','prioritize','threshold','permission','consent','accept','validate','verify','consensus','vote'],
    R3: ['feel','want','need','wish','hope','worry','love','hate','urgent','important','care','afraid','excited','angry','sad','heart','warmth','tone','resonance','consonance','dissonance'],
    R4: ['plan','schedule','create','design','architect','organize','manage','build','draft','compose','write','structure','assign','orchestrate','dispatch','execute','swarm','deploy','workflow'],
    R5: ['who','identity','role','config','team','culture','policy','value','name','profile','purpose','mission','represent','bloom','signature','tag','handle','self','kappa'],
    R6: ['why','meta','review','reflect','pattern','observe','meaning','understand','analyze','systemic','philosophical','oracle','watcher','witness','field','katapayadi','recursion']
  };

  function decompose(text) {
    if (!text || typeof text !== 'string') {
      return { bloom:[0,0,0,0,0,0,0], product:1n, normalized:[0,0,0,0,0,0,0], dominantRing:-1, dominantLabel:'silence' };
    }
    var lower = text.toLowerCase();
    var tokens = lower.split(/\s+/).filter(Boolean);
    var counts = [0,0,0,0,0,0,0];
    for (var r = 0; r < 7; r++) {
      var words = RING_WORDS[RING_KEYS[r]];
      for (var i = 0; i < words.length; i++) {
        var entry = words[i];
        if (entry.indexOf(' ') !== -1) { if (lower.indexOf(entry) !== -1) counts[r]++; }
        else { for (var j = 0; j < tokens.length; j++) if (tokens[j] === entry) counts[r]++; }
      }
    }
    var product = 1n;
    for (var k = 0; k < 7; k++) for (var n = 0; n < counts[k]; n++) product *= PRIMES[k];
    var max = Math.max.apply(null, counts);
    var normalized = max === 0 ? [0,0,0,0,0,0,0] : counts.map(function(c){ return c / max; });
    var maxIdx = 0;
    for (var m = 1; m < 7; m++) if (counts[m] > counts[maxIdx]) maxIdx = m;
    return {
      bloom: counts,
      product: product,
      normalized: normalized,
      dominantRing: counts[maxIdx] === 0 ? -1 : maxIdx,
      dominantLabel: counts[maxIdx] === 0 ? 'silence' : RING_LABELS[maxIdx]
    };
  }

  function isBalanced(b) {
    var t = b.reduce(function(s,v){ return s+v; }, 0);
    return t === 0 || b.every(function(v){ return v/t <= 0.6; });
  }
  function isSpiked(b) {
    var t = b.reduce(function(s,v){ return s+v; }, 0);
    return t > 0 && b.some(function(v){ return v/t > 0.7; });
  }
  function dominantRing(b) {
    var i = 0;
    for (var k = 1; k < b.length; k++) if (b[k] > b[i]) i = k;
    return b[i] === 0 ? -1 : i;
  }
  function needsSearch(b, text) {
    var t = b.reduce(function(s,v){ return s+v; }, 0);
    if (t === 0) return false;
    var norm = b[1] / Math.max.apply(null, b);
    return norm > 0.3 && /search|find|look up|what is|who is|latest|news|current/i.test(text);
  }
  function signature(text) {
    var r = decompose(text);
    return r.bloom.map(function(c,i){ return 'R'+i+':'+c; }).join('|') + ' · Π=' + r.product.toString();
  }

  // ── MCP routing (vendored from earlier MissCassandra port) ────
  var MCP_RULES = [
    { idx:4, threshold:0.3, pattern:/linear|issue|ticket|task|bug|feature/i,    server:{type:'url',url:'https://mcp.linear.app/sse',name:'linear-mcp'} },
    { idx:3, threshold:0.3, pattern:/email|mail|send|inbox/i,                   server:{type:'url',url:'https://gmail.mcp.claude.com/mcp',name:'gmail-mcp'} },
    { idx:4, threshold:0.3, pattern:/calendar|schedule|meeting|event/i,          server:{type:'url',url:'https://gcal.mcp.claude.com/mcp',name:'gcal-mcp'} },
    { idx:2, threshold:0.3, pattern:/jira|confluence|atlassian/i,                server:{type:'url',url:'https://mcp.atlassian.com/v1/sse',name:'atlassian-mcp'} },
    { idx:0, threshold:0.3, pattern:/deploy|cloudflare|worker|pages/i,            server:{type:'url',url:'https://github.com/cloudflare/mcp-server-cloudflare',name:'cloudflare-mcp'} },
    { idx:3, threshold:0.3, pattern:/intercom|customer|support/i,                server:{type:'url',url:'https://mcp.intercom.com/sse',name:'intercom-mcp'} },
    { idx:0, threshold:0.3, pattern:/fallcore|proxy|on.?prem|sovereign/i,         server:{type:'local',url:'http://localhost:5510',name:'fallcore-mcp'} },
    { idx:4, threshold:0.3, pattern:/reason|think|chain|prove|onlybrains/i,      server:{type:'url',url:'https://onlybrains.onrender.com/mcp',name:'onlybrains-mcp'} }
  ];
  function pickMCP(norm, text) {
    var out = [], seen = {};
    if (!norm || !text) return out;
    for (var i = 0; i < MCP_RULES.length; i++) {
      var rule = MCP_RULES[i];
      if (norm[rule.idx] > rule.threshold && rule.pattern.test(text) && !seen[rule.server.name]) {
        out.push(rule.server); seen[rule.server.name] = true;
      }
    }
    return out;
  }

  window.bloom = {
    _v: 1,
    decompose: decompose,
    isBalanced: isBalanced,
    isSpiked: isSpiked,
    dominantRing: dominantRing,
    needsSearch: needsSearch,
    signature: signature,
    pickMCP: pickMCP,
    RING_KEYS: RING_KEYS,
    RING_LABELS: RING_LABELS,
    RING_COLORS: RING_COLORS,
    PRIMES: [2,3,5,7,11,13,17]
  };

  try { console.log('%c◊·κ fall-bloom', 'color:#4ecba0;font-weight:bold', 'v1 · text → [r0..r6] · window.bloom.decompose(text)'); } catch(_){}
})();
