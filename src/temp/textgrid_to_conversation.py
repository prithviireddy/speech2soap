import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
INPUT_DIR =  BASE_DIR / "data/raw/transcripts"  # folder containing TextGrid files
OUTPUT_DIR = BASE_DIR / "data/processed/merged_transcripts"
OUTPUT_DIR.mkdir(parents=True,exist_ok=True)

# Match:
# day5_consultation05_doctor.TextGrid
pattern = re.compile(r"(day\d+_consultation\d+)_(doctor|patient)\.TextGrid")


def extract_intervals(filepath, speaker):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    interval_pattern = re.compile(
        r"xmin = ([0-9.]+)\s+"
        r"xmax = ([0-9.]+)\s+"
        r'text = "(.*?)"',
        re.DOTALL,
    )

    dialogues = []

    for match in interval_pattern.finditer(content):
        start_time = float(match.group(1))
        text = match.group(3).strip()

        # Skip empty intervals
        if not text:
            continue

        # Remove annotation tags
        text = re.sub(r"<.*?>", "", text)

        # Remove extra whitespace
        text = " ".join(text.split())

        dialogues.append({"time": start_time, "speaker": speaker, "text": text})

    return dialogues


# Store doctor/patient pairs
pairs = {}

for file in INPUT_DIR.glob("*.TextGrid"):
    match = pattern.match(file.name)

    if not match:
        continue

    consultation_id = match.group(1)
    role = match.group(2)

    if consultation_id not in pairs:
        pairs[consultation_id] = {}

    pairs[consultation_id][role] = file


# Process each consultation
for consultation_id, files in sorted(pairs.items()):
    if "doctor" not in files or "patient" not in files:
        print(f"Skipping incomplete pair: {consultation_id}")
        continue

    doctor_dialogues = extract_intervals(files["doctor"], "doctor")
    patient_dialogues = extract_intervals(files["patient"], "patient")

    conversation = doctor_dialogues + patient_dialogues

    # Sort chronologically
    conversation.sort(key=lambda x: x["time"])

    # Save merged conversation
    output_file = OUTPUT_DIR / f"{consultation_id}_conversation.txt"

    with open(output_file, "w", encoding="utf-8") as f:
        for line in conversation:
            f.write(f"{line['speaker']}: {line['text']}\n")

    print(f"Saved: {output_file}")

print("All conversations merged.")
