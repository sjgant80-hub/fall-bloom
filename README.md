# fall-bloom

◊·κ Text → 7-ring bloom vector decomposition · sovereign drop-in plugin.

Maps any text onto the v18/v19 spine primes {2, 3, 5, 7, 11, 13, 17}. Returns the count vector `[r0..r6]`, the prime product `P(Q) = Π(p_i^r_i)`, the normalised vector, the dominant ring, and a label.

**Live demo + docs:** https://sjgant80-hub.github.io/fall-bloom/

Ported from [teslasolar/MissCassandra](https://github.com/teslasolar/MissCassandra) (MIT, Thomas Frumkin) with sovereign-AI vocabulary extensions.

## Install

```html
<script src="https://sjgant80-hub.github.io/fall-bloom/bloom.js" defer></script>
```

Or load via `fall-hot` to receive updates automatically.

## API

```js
window.bloom.decompose(text)
// → {
//     bloom:       [c0, c1, c2, c3, c4, c5, c6],   // raw counts per ring
//     product:     BigInt,                          // Π p_i^c_i
//     normalized:  [n0..n6],                        // max-1.0 scaled
//     dominantRing: number,                          // 0..6 or -1 if silent
//     dominantLabel: 'ground' | 'sensor' | 'gate' | 'affect' | 'executive' | 'identity' | 'observer' | 'silence'
//   }

window.bloom.isBalanced(b)      // no single ring > 60% of total
window.bloom.isSpiked(b)        // some ring > 70% of total
window.bloom.dominantRing(b)    // returns idx or -1
window.bloom.needsSearch(b, t)  // R1 > 0.3 + search keywords match
window.bloom.signature(text)    // "R0:c|R1:c|...|R6:c · Π=N" konomi string
window.bloom.pickMCP(norm, t)   // MCP server selection by bloom × keyword
```

## The 7 rings

| Ring | Prime | Domain | Examples |
|---|---:|---|---|
| R0 | 2 | ground · hardware · resource | help, fix, deploy, walker, torus, gpu |
| R1 | 3 | sensor · perception · attention | find, search, observe, sense, heartbeat |
| R2 | 5 | gate · filter · permission | filter, gate, approve, validate, vote |
| R3 | 7 | affect · feeling · care | feel, urgent, love, heart, resonance |
| R4 | 11 | executive · planning · do | plan, execute, swarm, dispatch, build |
| R5 | 13 | identity · self · who | who, bloom, signature, kappa, mission |
| R6 | 17 | observer · meta · why | why, reflect, oracle, witness, recursion |

## Example

```js
const r = window.bloom.decompose("why does the witness sleep at the gate of the field");
// r.bloom         = [0, 0, 1, 0, 0, 0, 4]   // R2:1 + R6:4
// r.product       = 5n * 17n**4n = 417605n
// r.dominantLabel = 'observer'
```

## Estate context

Every Fall tool that loads `fall-bloom` can:

- Classify any user input by dominant ring
- Auto-select MCP tools via `pickMCP()` based on bloom + keyword match
- Tag KCC ledger emissions with their bloom signature
- Show ring-colored UI accents (the seven canonical colours are exported)

The plugin is `hotLoadable: true` in the [fall-registry](https://github.com/sjgant80-hub/fall-registry). Bump `_v` when extending the vocabulary banks, ship to the CDN, every tool with `fall-hot` watching gets the new ring sensitivity within minutes.

## Hot-load safety

Follows the [hot-load-safe plugin discipline](https://github.com/sjgant80-hub/fall-hot#hot-load-safe-plugin-discipline):

- Version guard at the top (`_v >= 1` return)
- No side effects on init (no listeners, no timers, no DOM)
- Pure function exports
- Backward compatible: future `_v 2` will keep the v1 shape working

## Licence

MIT. Part of the Fall sovereign tool estate. ◊·κ=1

Original bloom decomposition by Thomas Frumkin (teslasolar/MissCassandra). Vocabulary extensions and packaging by the Fall estate. Cross-pollination preserved with attribution.
