# Convivium

A dialogue engine that puts philosophers in the same room and lets them disagree.

Pick two or more thinkers, ask a question, and they answer in sequence — reacting
to each other rather than replying in parallel. You can address one of them
directly, and they will answer you personally instead of taking their turn.

**[Live demo →](https://your-url-here)**

---

## Why it exists

Most LLM "chat with a historical figure" demos are a single persona with a system
prompt. The interesting problem is not one voice, it is several: how do you keep
five distinct positions coherent across a conversation, decide who speaks next,
and let a reader interrupt without breaking the thread?

## How it works

**Turn selection.** In dialogue mode the app tracks who spoke last and rotates
through the selected thinkers. If the reader's message names one of them, that
turn is reassigned to the addressed thinker and flagged as a direct reply, which
changes the prompt they receive.

**Persona isolation.** Every participant's persona is included in the system
prompt so each speaker knows who is in the room, but the model is instructed to
speak only as one of them. The conversation history is replayed as attributed
lines, so a thinker can react to a specific thing someone else said.

**Live invitation.** Naming a thinker who is not in the room adds them mid-conversation.

**Voice.** Each thinker has a distinct ElevenLabs voice. The recorded dialogues
ship as pre-rendered audio; live conversations synthesise on demand.

## Two modes

| | Recorded dialogues | Live |
|---|---|---|
| Content | Three captured conversations, replayed with a typewriter effect | Generated at request time |
| Voice | Pre-rendered MP3, shipped with the app | Synthesised per turn |
| Needs a key | No | Yes |
| Cost to the visitor | None | API usage |

Recorded mode is the default and the reason the demo link works for anyone. A
prototype nobody can open is not a prototype, it is a screenshot — so the
shareable path had to work with no key, no signup and no cost, and the live path
sits behind it as an option.

## Running it

The app is static. Open `index.html`, or serve the folder.

### Generating the voice track

```bash
export ELEVENLABS_API_KEY=sk_...
pip install -r requirements.txt

python scripts/generate_audio.py --list-voices   # pick voices
# map speaker ids to voice ids in voices.json

python scripts/generate_audio.py --dry-run       # check the character cost
python scripts/generate_audio.py                 # write audio/*.mp3
```

The script reads `demos.js` — the same file the browser loads — so the dialogue
text has one source of truth. It skips files that already exist, reports your
remaining character quota before spending it, and degrades to text-only playback
in the app if any audio file is missing.

The full set is roughly 7,300 characters across 11 spoken turns.

### Live mode

Set `PROXY_URL` in `index.html` to an endpoint that holds the API key server-side
and forwards to the model provider. Without it, the app offers a
bring-your-own-key path that stores the key in the browser only.

## Structure

```
index.html                 app: UI, turn selection, prompt assembly, playback
demos.js                   recorded dialogues (read by browser and by Python)
voices.json                speaker id → ElevenLabs voice id
scripts/generate_audio.py  pre-renders the voice track
audio/                     generated MP3s
```

## What I would do differently

**The roster is a flat list.** Adding a thinker means adding a persona string.
That was right for exploring, but the personas are prose and their quality is
uneven — some carry a real voice, some read like an encyclopedia entry. A
structured format (positions held, characteristic moves, what they would refuse
to say) would produce more consistent disagreement.

**Turn selection is round-robin.** It works, but the more interesting version
asks who has the strongest reason to respond to what was just said, and lets a
thinker stay silent when they have nothing to add.

**There is no evaluation.** I judged output quality by reading it. For anything
beyond a personal project I would want a rubric — does the speaker engage with
the specific claim made before, do they stay in position under pressure — and a
set of fixed prompts to score against it.

**One persona was removed.** An earlier version included a historical figure
whose system prompt instructed the model to argue an extremist ideology, framed
as material to be dismantled in dialogue. The framing was sincere and the framing
does not matter: a public repository containing a prompt that reproduces that
ideology is the artifact, not the intention behind it. It came out before this
was published.
