import json
import os
from pathlib import Path

import torch
import whisperx  # type: ignore
from dotenv import load_dotenv
from whisperx.diarize import DiarizationPipeline  # type: ignore

from src.models.consultation import ConsultationStatus
from src.utils.consultation_progress import update_progress

load_dotenv()


BASE_DIR = Path(__file__).resolve().parent.parent


OUTPUT_DIR = BASE_DIR / "data/processed/diarized_transcripts"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

device = "cuda"

torch.backends.cuda.matmul.allow_tf32 = False
torch.backends.cudnn.allow_tf32 = False


def transcribe_audio(db, audio_path, consultation_id):

    # print(f"Transcribing: {audio_path.name}")

    update_progress(
        db,
        consultation_id,
        15,
        "Loading Whisper Model",
        ConsultationStatus.TRANSCRIBING,
    )
    # Load model
    model = whisperx.load_model("medium", device=device, compute_type="float16")

    update_progress(
        db,
        consultation_id,
        20,
        "Loading Audio",
    )

    # Load audio
    audio = whisperx.load_audio(str(audio_path))

    update_progress(
        db,
        consultation_id,
        30,
        "Transcribing Speech",
    )

    # Transcribe
    result = model.transcribe(audio, batch_size=8, language="en")

    update_progress(
        db,
        consultation_id,
        45,
        "Loading Alignment Model",
    )

    # Alignment
    model_a, metadata = whisperx.load_align_model(
        language_code=result["language"], device=device
    )

    update_progress(
        db,
        consultation_id,
        55,
        "Aligning Words",
    )

    result = whisperx.align(result["segments"], model_a, metadata, audio, device)

    del model
    torch.cuda.empty_cache()

    update_progress(
        db,
        consultation_id,
        65,
        "Loading Speaker Diarization",
    )

    # Diarization
    diarize_model = DiarizationPipeline(token=os.getenv("HF_TOKEN"), device=device)

    update_progress(
        db,
        consultation_id,
        75,
        "Identifying Speakers",
    )

    diarize_segments = diarize_model(audio, min_speakers=2, max_speakers=2)

    update_progress(
        db,
        consultation_id,
        82,
        "Assigning Speakers",
    )

    # Assign speakers
    result = whisperx.assign_word_speakers(diarize_segments, result)

    # # Print transcript
    # for segment in result["segments"]:
    #     speaker = segment.get("speaker", "UNKNOWN")
    #     text = segment["text"]

    #     print(f"{speaker}: {text}")

    # Create output directory

    clean_segments = []

    for segment in result["segments"]:
        text = segment["text"].strip()

        if not text:
            continue

        clean_segments.append(
            {"speaker": segment.get("speaker", "UNKNOWN"), "text": text}
        )

    output_path = OUTPUT_DIR / f"{audio_path.stem}.json"

    update_progress(
        db,
        consultation_id,
        88,
        "Saving Transcript",
    )

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(clean_segments, f, indent=2, ensure_ascii=False)

    print(f"Diarized transcript saved-> {output_path}")
    return output_path
