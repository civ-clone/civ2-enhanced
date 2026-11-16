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
