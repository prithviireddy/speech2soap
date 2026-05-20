import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

OUTPUT_DIR = BASE_DIR / "data/processed/merged_transcripts"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def merge_dialogue(json_path: Path):

    print(f"Merging: {json_path.name}")

    # Load diarized transcript
    with open(json_path, "r", encoding="utf-8") as f:
        segments = json.load(f)

    if not segments:
        raise ValueError("Empty transcript")

    merged = []

    current_speaker = segments[0]["speaker"]
    current_text = segments[0]["text"].strip()

    for segment in segments[1:]:
        speaker = segment["speaker"]
        text = segment["text"].strip()

        # Same speaker → merge text
        if speaker == current_speaker:
            current_text += " " + text

        # Different speaker → save previous block
        else:
            merged.append({"speaker": current_speaker, "text": current_text})

            current_speaker = speaker
            current_text = text

    # Save final block
    merged.append({"speaker": current_speaker, "text": current_text})

    output_path = OUTPUT_DIR / f"{json_path.stem}.json"

    # Save merged output
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)

    print(f"Merged transcript saved -> {output_path}")

    return output_path
