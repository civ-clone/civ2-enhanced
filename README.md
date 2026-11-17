# civ2-enhanced

Rules that change Civilization II's, each in a rule set a new game can switch. For the rules below, the `civ2-*`
packages play as the original does (OpenCiv2's Classic behaviour, bugs included) and this one holds the departures from
it, so that a game without it loaded, or with its sets switched off, plays them as the original. Each departure is the
fix OpenCiv2 makes by default; its `docs/BUGS.md` names them.

Every set is beneath `civ2-enhanced` (`RuleSets.ENHANCED`), which a setup window can draw as one three-state checkbox.
A set that `supersedes` a Civ2 rule takes its place while the set is on, and gives it back when switched off, without
the Civ2 package knowing (`@civ-clone/core-rule`'s `RuleSet`). One whose Civ2 package is not loaded is only an orphan,
which `validate()` shows and does not block on.

The ids it supersedes are imported from each Civ2 package's `RuleIds`, so a rule renamed there breaks this package's
build rather than leaving both rules running. Its own rule ids are exported the same way, from `RuleIds.ts`.

## Rule sets

Where a rule below says "a person", that is every player whose seat is not played by the computer (`civ2-difficulty`'s
`isHuman`: a player with a client, none of them an `AIClient`). In a game with no such seat these rules never act, as
the original reviews its relations only with the human.

- `civ2-enhanced:attitude-drift` (`ATTITUDE_DRIFT`), on to start with:
  `civ2-enhanced:player/turn-start/attitude-drift` moves a computer player's attitude toward each person it is in
  contact with by the original's terms each turn, starting from 0 when there is no border incident, through
  `civ2-diplomacy`'s `driftAttitude`. Supersedes `civ2-diplomacy:player/turn-start/attitude-drift`, which, as the
  original, starts from a stale value that the clamp turns into 100, so that every computer player in contact with a
  person sits at its coldest except on turns with a border incident (B3).
- `civ2-enhanced:border-intruders` (`BORDER_INTRUDERS`), on to start with:
  `civ2-enhanced:player/turn-start/border-intruders` counts a person's military units on every square of a computer
  player's cities' radius as a border incident, through `civ2-diplomacy`'s `countIncidents`. Supersedes
  `civ2-diplomacy:player/turn-start/border-intruders`, which, as the original, looks only at the first intruded square
  of each city (B4). Both count before the attitude drift, whichever drift is on.
- `civ2-enhanced:treaty-breaking` (`TREATY_BREAKING`), on to start with:
  `civ2-enhanced:player/turn-start/treaty-breaking` has a computer player that breaks a treaty it meant to break do it
  openly: the ceasefire or peace ends for both, it is announced (`diplomacy:declaration-expired`), and
  `civ2-diplomacy:treaty-broken` is emitted, through `civ2-diplomacy`'s `breakTreaties`. Supersedes
  `civ2-diplomacy:player/turn-start/treaty-breaking`, which, as the original, breaks it without a word (B37: the
  original ends it on the computer player's side only, so the person's side still reads the treaty; civ-clone keeps one
  treaty for both sides, so it ends for both, unannounced).

## Fixed research costs

`civ2-enhanced:fixed-research-costs` (`FIXED_RESEARCH_COSTS`), off to start with: `civ2-enhanced:research/cost/by-tier`
costs each advance a fixed weight by its tier times Civilization II's ratio, however many advances its player knows
(civ-clone/web-renderer#1072), so a beeline that skips the dead ends costs what learning steadily does. The tiers
(`ResearchTiers.ts`) band the 88 advances that can be learnt once by how many advances each needs in its whole tree
(0, 1–3, 4–8, 9–15, 16–25, 26–36, 37–50, 51 or more), read from the game's `requires` entries when the first cost is
asked for, with weights 3, 12, 25, 36, 46, 56, 69 and 81. The ratio is `civ2-science`'s `researchRate` (difficulty, the
reference player, past 19 advances, the paradigm, the 89 advances and the map) with Civilization II's whole ramp, three
quarters more, as from the twentieth advance on, and without a person's floor of 11 − n; each weight is its tier's
mean cost in steps of that along a steady path (`civ2-science`'s `fullRampStep`, with
`@civ-clone/base-science-research-tiered-cost`). Learning every advance steadily then costs what it does
by Civilization II's own cost, within about 0.4% at every level and on every size of map, an all-computer game
included. Future Technology, Plumbing (which no one can research) and any advance that isn't Civilization II's have no
tier, and cost what they do by `civ2-science`'s rule. Supersedes `civ2-science:research/cost`.

## Ages

`civ2-enhanced:ages` (`AGES`), off to start with: each civilization moves through Civilization II's four epochs as
ages as it learns (civ-clone/web-renderer#1076), with `@civ-clone/base-science-age`, as `civ1-enhanced`'s eight do
by tier. An advance's epoch is RULES.TXT's @CIVILIZE column (`civ2-science`'s `data/advances`), which the original uses
only to choose the advance's picture: Ancient (25 advances), Renaissance (17, and Plumbing, which no one can learn),
Industrial (19) and Modern (27). No advance's epoch is earlier than one it needs. A civilization is in the age of the
latest epoch it knows an advance of, judged by its own advances, and in the Ancient knowing none; Future Technology,
which can be repeated, and an advance that isn't Civilization II's count for nothing. Nothing is saved, so a game loads
in the age it was saved in. The ages are named as `civ1-enhanced`'s of the same name, so an interface's words serve
both.

- `civ2-enhanced:research/age/by-epoch` (`AgeOf`): the age from the epochs (`lib/latestEpoch`).
- `civ2-enhanced:player/added/hold-ages` and `civ2-enhanced:turn/start/settle-ages`: a civilization added, as the game
  is set up or when a civil war splits one off with the advances it inherits, tells of no age until the next turn
  starts.
- `civ2-enhanced:research/complete/reach-age` (`Complete`, `Low`, after `civ2-science`'s): an advance gained, by any
  means, that starts a new age processes `AgeReached`, once, with the later age when it jumps over one. Nothing is told
  on turn 0, so the advances `civ2-player`'s start balancing gives tell of none.
- `civ2-enhanced:player/age-reached/emit` (`AgeReached`): emits `player:age-reached`.

## Research cost by age

`civ2-enhanced:research-cost-by-age` (`RESEARCH_COST_BY_AGE`), off to start with:
`civ2-enhanced:research/rate-multiplier/by-age` multiplies the research cost by the player's own age's multiplier
(civ-clone/web-renderer#1077), with either research cost: 0.5 in the Ancient, 0.66 in the Renaissance, 0.88 in the
Industrial and 1.17 in the Modern (`AgeResearchRates`), to the nearest whole bulb, then stopping at 32000 as
Civilization II's does. It is judged by the player's latest age, whether `AGES` is on or not, so a rush into a later age
makes every advance after it dearer, the ones left behind too, and the advance that starts an age costs what it does in
the age before. A person's floor of 11 − n stays with Civilization II's own cost, as today, and is multiplied with it;
the fixed research costs leave it out, as they do now.

It is a `civ2-science` `RateMultiplier` rule, which Civilization II's cost asks for and has none of its own, so it
supersedes nothing. Civilization II's cost has no catch-up by the calendar to move, as Civilization's has from AD: its
ratio rises for being ahead of the turn (up to 6) only past a player's own nineteenth advance.

The slide starts at half, as Civilization's first age does, and rises each age by the same factor, 1.328, chosen so that
learning every advance along the steady path (by prerequisites, as the fixed costs' tiers were set), each at its
player's age before it, costs what it does today: 0.998 times by Civilization II's cost and 0.996 by the fixed costs.
Along the computer players' own choices it costs about 1.04 times. A civilization enters the Modern only around its
fiftieth advance, so that age carries about three fifths of the cost: a slide as steep as Civilization's, to 3, would
make the whole about 2.3 times as dear, and one whose mean over the advances of each epoch is 1 about 1.3 times.

## Barbarians

Both off to start with, each superseding a `civ2-barbarians` rule (by the ids in its `RuleIds`) and registered where
that rule runs. Without `civ2-barbarians` loaded they are only orphans.

- `civ2-enhanced:barbarian-uprisings` (`BARBARIAN_UPRISINGS`): `civ2-enhanced:turn/start/land-uprising` runs the turn's
  land uprising with `civ2-barbarians`' `landUprising` and three corrections: the square's offset east runs −12 to 12
  half columns, as far east as west (the original's `(r % 13) × 2 − 6` runs −6 to 18); every try is centred on the
  city drawn for the uprising, which the square must share a land mass with and which sizes the horde (the original
  goes by whichever city is nearest each try, a computer player's perhaps); and an uprising that finds no square is
  announced, `barbarians:uprising-failed` with the city's player and the city (the original drops it without a word).
  Supersedes `civ2-barbarians:turn/start/land-uprising`.
- `civ2-enhanced:barbarian-cities` (`BARBARIAN_CITIES`): `civ2-enhanced:city/build/barbarian` has a barbarian city
  that isn't building a unit start with the main unit of the barbarians' own uprising table for what anyone knows
  (Chariots, then Archers with Gunpowder, Cannon with Industrialization, and so on), where the original starts it on the
  Legion, or Knights once anyone knows Explosives. It keeps and upgrades its unit as the original does. Supersedes
  `civ2-barbarians:city/build/units-only`. Barbarian cities still build no improvements: the barbarians know no
  advances, so only Barracks would be open to them; whether they should build any is left open.

## Score

- `civ2-enhanced:pollution-score` (`POLLUTION_SCORE`), off to start with: `civ2-enhanced:player/score/pollution`: each
  civilization pays for its own pollution, 10 for each polluted square in its own cities' radii, each counted once,
  with no discount (`civ2-score`'s `pollutionScore`). Supersedes `civ2-score:player/score/pollution`, which, as the
  original, costs every civilization the same for the whole world's pollution, less what lies near computer
  players' cities. civ2-score loads after this package, so the term comes first in the list while the set is on.
