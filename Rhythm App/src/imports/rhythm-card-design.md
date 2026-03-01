FlŌRA — Rhythm Card
Design a single mobile card component (335px wide) for FlŌRA, a burnout-prevention app that monitors biometric signals. The card communicates a user's current rhythm alignment against their personal baseline using a sinusoidal wave visualization.

VISUAL STYLE
Card background: #FAFAF8
Border radius: 22px
Border: 1.5px solid, accent color at 13% opacity
Box shadow: 0 2px 20px, accent color at 8% opacity
Internal padding: 20px
Fonts:
— Fraunces (serif, 600–700 weight) for headline and metric values
— DM Sans (400–700 weight) for all labels, deltas, metadata
Three color states — all other specs remain identical, only accent color changes:
— ALIGNED: accent #5C8A6E (sage), faint background #EBF4EF
— DRIFTING: accent #C4785A (clay), faint background #FAF0EB
— WATCH CLOSELY: accent #C49A4A (amber), faint background #FBF5E8

CARD ANATOMY — TOP TO BOTTOM
① Status pill
Left-aligned. Rounded pill shape, faint accent background, 1px border at 30% accent opacity.
Contents: 7px filled circle in accent color + uppercase label in 11px DM Sans bold, accent color, 0.05em letter spacing.
Labels: "ALIGNED" / "DRIFTING" / "WATCH CLOSELY"
② Headline
Fraunces 17px, charcoal #2A2825, weight 600, line height 1.3, margin-top 6px.
Example texts per state:
— Aligned → "Your rhythm is on track"
— Drifting → "Your recovery load is higher than usual"
— Watch closely → "Signs of building fatigue"
③ Body copy
DM Sans 12px, color #6B6660, line height 1.5, max 2 lines, margin-top 4px.
Example for Drifting: "HRV has pulled below your luteal baseline for 3 nights. Sleep efficiency is lighter."
④ Wave visualization
Full card width, 110px tall, margin-top 16px. 7-day window. Horizontal axis = time (left = 6 days ago, right = today).
Draw three visual layers:
LAYER 1 — Baseline (dashed line)
Color: #B5B0AA. Stroke: 1.5px. Dash pattern: 5px on / 4px off.
Shape: a gentle, slowly undulating sine wave — this is the user's phase-calibrated personal normal. It should look calm and regular.
Add a label "your baseline" in 8.5px DM Sans #B5B0AA, left-aligned, floating just above the left start of this line.
LAYER 2 — Actual rhythm (solid line)
Color: accent. Stroke: 2.5px, smooth curves, round line caps.
Shape varies by state:
— Aligned: tracks close to or slightly above the baseline wave — nearly overlapping
— Drifting: starts near baseline on the left, curves progressively downward toward the right, ending meaningfully below the baseline today
— Watch closely: drops steeply and steadily from left to right, ending well below baseline
Add small semi-transparent dots (accent at 35% opacity, 5px diameter) at each of the 6 historical data points (not on today).
LAYER 3 — Deviation fill
The filled area between the actual line and the baseline line.
Fill: accent color at 12% opacity.
For Aligned: very thin fill, nearly invisible.
For Drifting: moderate fill, widening toward the right.
For Watch closely: wide fill, dramatically widening toward the right.
TODAY marker (rightmost point of actual line):
— Outer ring: 14px circle, accent at 15% opacity
— Inner dot: 8px circle, solid accent
— Center: 4px circle, white
— Label: "TODAY" in 9px DM Sans bold, accent color, centered above the dot, 13px above
Day labels along the bottom: M T W T F S S in 9px DM Sans. All days in #B5B0AA except the final S (today) in accent bold.
Faint horizontal grid lines at three heights across the chart area: #E8E4DC, 0.8px, dashed (3px on / 4px off).
⑤ Divider
Full card width, 1px, color #E8E4DC, margin 16px vertical.
⑥ Three metric anchors
Displayed in a single row, divided by two 1px vertical separators (#E8E4DC, 48px tall).
Each anchor is centered in its third of the row.
Anchor 1 — HRV:
— Value: Fraunces 18px charcoal bold (e.g. "48 ms" / "38 ms" / "31 ms")
— Label: "HRV" in 10px DM Sans bold #6B6660, uppercase, 0.06em spacing
— Delta: 10px DM Sans, directional arrow + text

Up arrow ↑ in sage #5C8A6E for positive
Down arrow ↓ in clay #C4785A for negative
Example: "↓ −11% from baseline"

Anchor 2 — Sleep:
— Same structure as HRV
— Value examples: "81%" / "68%" / "59%"
— Delta examples: "→ On baseline" / "↓ −6% from baseline" / "↓ −15% from baseline"
Anchor 3 — Phase:
— Icon: a circle phase glyph (◑ for mid-cycle, ◕ for late cycle) in accent color, 18px
— Label: "PHASE" in 10px DM Sans bold #6B6660, uppercase
— Value: phase name in 10px DM Sans #6B6660 (e.g. "Luteal") with cycle day below in 10px #B5B0AA (e.g. "Day 4")

CORNER DETAIL
Subtle radial gradient in the top-right corner of the card: accent color at 12% opacity fading to transparent over ~120px radius. This adds warmth and depth without competing with content.

Design all three states as separate artboards side by side, labeled ALIGNED / DRIFTING / WATCH CLOSELY. The only things that change between states are: accent color, status pill label, headline text, body copy, wave shape + deviation fill width, metric values and deltas, and phase day. All spacing, sizing, and layout are identical across states.