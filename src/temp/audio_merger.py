from pydub  import AudioSegment
from pathlib import Path
import re

BASE_DIR = Path(__file__).resolve().parent.parent.parent
INPUT_DIR = BASE_DIR / "data/raw/audio"
OUTPUT_DIR=BASE_DIR / "data/processed/overlayed"

OUTPUT_DIR.mkdir(parents=True,exist_ok=True)

pattern = re.compile(r"(day\d+_consultation\d+)_(doctor|patient)\.wav")

# Store pairs
audio_pairs = {}

# Scan all wav files
for file in INPUT_DIR.glob("*.wav"):
    match = pattern.match(file.name)

    if match:
        consultation_id = match.group(1)
        role = match.group(2)

        if consultation_id not in audio_pairs:
            audio_pairs[consultation_id] = {}

        audio_pairs[consultation_id][role] = file

# Process all pairs
for consultation_id, files in sorted(audio_pairs.items()):
    # Ensure both doctor and patient exist
    if "doctor" in files and "patient" in files:
        print(f"Processing: {consultation_id}")

        doctor_audio = AudioSegment.from_file(files["doctor"])
        patient_audio = AudioSegment.from_file(files["patient"])

        # Overlay/mix
        merged_audio = doctor_audio.overlay(patient_audio)

        # Output path
        output_file = OUTPUT_DIR / f"{consultation_id}_merged.wav"

        # Export
        merged_audio.export(output_file, format="wav")

        print(f"Saved: {output_file}")

    else:
        print(f"Missing pair for {consultation_id}")
