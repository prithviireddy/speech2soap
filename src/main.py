from pathlib import Path

from transcription.speaker_diarization import transcribe_audio
from processing.merge_dialogue import merge_dialogue
from clinicalReport.generate_report import generate_clinical_report


BASE_DIR = Path(__file__).resolve().parent.parent

RAW_AUDIO_DIR = BASE_DIR / "data/processed/test"


def main():

    audio_files = list(RAW_AUDIO_DIR.glob("*.wav"))

    if not audio_files:
        print("No audio files found.")
        return

    print(f"Found {len(audio_files)} audio file(s).\n")

    for audio_file in audio_files:
        print("=" * 60)
        print(f"Processing: {audio_file.name}")
        print("=" * 60)

        try:
            # Step 1: WhisperX diarization
            diarized_path = transcribe_audio(audio_file)

            # Step 2: Merge fragmented speaker chunks
            merged_path = merge_dialogue(diarized_path)

            # Step 3: Generate SOAP + summary
            report_path = generate_clinical_report(merged_path)

            print(f"\nPipeline completed successfully.")
            print(f"Final report -> {report_path}")

        except Exception as e:
            print(f"\nPipeline failed for {audio_file.name}")
            print(e)

        print("\n")


if __name__ == "__main__":
    main()
