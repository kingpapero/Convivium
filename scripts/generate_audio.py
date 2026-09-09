#!/usr/bin/env python3
"""Generate the pre-rendered voice track for Convivium's recorded dialogues.

The recorded dialogues are fixed text, so their audio is synthesised once with
the ElevenLabs text-to-speech API and shipped as static files. Visitors then get
voice playback with no API key, no cost and no network round-trip.

Usage
-----
    export ELEVENLABS_API_KEY=sk_...

    python scripts/generate_audio.py --list-voices   # pick voices, fill voices.json
    python scripts/generate_audio.py --dry-run       # what it would cost
    python scripts/generate_audio.py                 # generate the missing files
    python scripts/generate_audio.py --force         # regenerate everything
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Iterator, NamedTuple

import requests

API_ROOT = "https://api.elevenlabs.io/v1"
MODEL_ID = "eleven_multilingual_v2"

ROOT = Path(__file__).resolve().parent.parent
DEMOS_FILE = ROOT / "demos.js"
VOICES_FILE = ROOT / "voices.json"
AUDIO_DIR = ROOT / "audio"

VOICE_SETTINGS = {
    "stability": 0.45,          # a little variation keeps long passages alive
    "similarity_boost": 0.75,
    "style": 0.15,
    "use_speaker_boost": True,
}


class Line(NamedTuple):
    """One spoken turn: which demo, which position, who speaks, what they say."""

    demo_id: str
    index: int
    speaker: str
    text: str

    @property
    def filename(self) -> str:
        return f"{self.demo_id}-{self.index}.mp3"


# ──────────────────────────────────────────────────────────────
# Inputs
# ──────────────────────────────────────────────────────────────

def load_demos(path: Path = DEMOS_FILE) -> list[dict[str, Any]]:
    """Read demos.js, which the browser loads directly, and parse its JSON body.

    The file is `const DEMOS = [ ...valid JSON... ];` so one source of truth
    serves both the app and this script.
    """
    if not path.exists():
        sys.exit(f"demos.js not found at {path}")

    source = path.read_text(encoding="utf-8")
    match = re.search(r"const\s+DEMOS\s*=\s*(\[.*\])\s*;", source, re.DOTALL)
    if not match:
        sys.exit("Could not find the DEMOS array in demos.js")

    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError as exc:
        sys.exit(f"demos.js does not contain valid JSON: {exc}")


def iter_lines(demos: list[dict[str, Any]]) -> Iterator[Line]:
    """Yield every assistant turn. User turns are read on screen, not spoken."""
    for demo in demos:
        for index, turn in enumerate(demo["turns"]):
            if turn.get("role") != "assistant":
                continue
            yield Line(demo["id"], index, turn["speaker"], turn["content"])


def load_voices(path: Path = VOICES_FILE) -> dict[str, str]:
    if not path.exists():
        sys.exit(
            f"{path.name} not found. Run --list-voices, then map each speaker id "
            "to a voice id in that file."
        )
    voices = json.loads(path.read_text(encoding="utf-8"))
    return {k: v for k, v in voices.items() if not k.startswith("_")}


# ──────────────────────────────────────────────────────────────
# ElevenLabs API
# ──────────────────────────────────────────────────────────────

def api_key() -> str:
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("Set ELEVENLABS_API_KEY in your environment first.")
    return key


def list_voices(key: str) -> None:
    response = requests.get(
        f"{API_ROOT}/voices", headers={"xi-api-key": key}, timeout=30
    )
    response.raise_for_status()

    for voice in response.json().get("voices", []):
        labels = voice.get("labels") or {}
        traits = ", ".join(f"{k}: {v}" for k, v in labels.items()) or "—"
        print(f"{voice['voice_id']}  {voice['name']:<22} {traits}")


def quota(key: str) -> tuple[int, int] | None:
    """Characters used and allowed this billing period, if the API tells us."""
    try:
        response = requests.get(
            f"{API_ROOT}/user/subscription", headers={"xi-api-key": key}, timeout=30
        )
        response.raise_for_status()
        data = response.json()
        return data["character_count"], data["character_limit"]
    except (requests.RequestException, KeyError):
        return None


def synthesise(key: str, voice_id: str, text: str) -> bytes:
    response = requests.post(
        f"{API_ROOT}/text-to-speech/{voice_id}",
        headers={
            "xi-api-key": key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={"text": text, "model_id": MODEL_ID, "voice_settings": VOICE_SETTINGS},
        timeout=120,
    )
    if response.status_code != 200:
        raise RuntimeError(f"HTTP {response.status_code}: {response.text[:300]}")
    return response.content


# ──────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--list-voices", action="store_true",
                        help="print the voices on your account and exit")
    parser.add_argument("--dry-run", action="store_true",
                        help="show what would be generated, call nothing")
    parser.add_argument("--force", action="store_true",
                        help="regenerate files that already exist")
    args = parser.parse_args()

    key = api_key()

    if args.list_voices:
        list_voices(key)
        return

    lines = list(iter_lines(load_demos()))
    AUDIO_DIR.mkdir(exist_ok=True)

    pending = [ln for ln in lines
               if args.force or not (AUDIO_DIR / ln.filename).exists()]
    characters = sum(len(ln.text) for ln in pending)

    print(f"{len(lines)} spoken turns, {len(pending)} to generate, "
          f"{characters:,} characters.")

    if remaining := quota(key):
        used, limit = remaining
        print(f"Quota: {used:,} / {limit:,} used — {limit - used:,} left.")
        if characters > limit - used:
            print("Warning: this run exceeds your remaining quota.")

    if args.dry_run or not pending:
        for line in pending:
            print(f"  would write {line.filename:<16} {line.speaker:<16} "
                  f"{len(line.text):>5} chars")
        return

    voices = load_voices()
    missing = sorted({ln.speaker for ln in pending} - voices.keys())
    if missing:
        sys.exit(f"No voice mapped for: {', '.join(missing)} — edit voices.json.")

    for line in pending:
        target = AUDIO_DIR / line.filename
        print(f"  {line.filename:<16} {line.speaker:<16} "
              f"{len(line.text):>5} chars … ", end="", flush=True)
        try:
            target.write_bytes(synthesise(key, voices[line.speaker], line.text))
        except (requests.RequestException, RuntimeError) as exc:
            print(f"failed — {exc}")
            continue
        print(f"{target.stat().st_size // 1024} KB")

    print(f"\nDone. Audio in {AUDIO_DIR.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
