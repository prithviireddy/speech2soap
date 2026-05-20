import os
import json
import torch
import whisperx

from dotenv import load_dotenv
from pathlib import Path
from whisperx.diarize import DiarizationPipeline


load_dotenv()


BASE_DIR= Path(__file__).resolve().parent.parent.parent


OUTPUT_DIR = BASE_DIR / "data/processed/diarized_transcripts"
OUTPUT_DIR.mkdir(parents=True,exist_ok=True)

device = "cuda"

torch.backends.cuda.matmul.allow_tf32 = False
torch.backends.cudnn.allow_tf32 = False


def transcribe_audio(audio_path: Path) -> Path:
    
    print(f"Transcribing: {audio_path.name}")

    # Load model
    model = whisperx.load_model(
        "medium", 
        device=device, 
        compute_type="float16"
    )

    # Load audio
    audio = whisperx.load_audio(str(audio_path))

    # Transcribe
    result = model.transcribe(
        audio, 
        batch_size = 8, 
        language = "en"
    )
    # Alignment
    model_a, metadata = whisperx.load_align_model(
        language_code=result["language"],
        device=device
    )

    result = whisperx.align(result["segments"], model_a, metadata, audio, device)


    del model
    torch.cuda.empty_cache()

    # Diarization
    diarize_model = DiarizationPipeline(
        token = os.getenv("HF_TOKEN"), 
        device=device
    )

    diarize_segments = diarize_model(audio, min_speakers=2, max_speakers=2)

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

        clean_segments.append({"speaker": segment.get("speaker", "UNKNOWN"), "text": text})

    output_path = OUTPUT_DIR/f"{audio_path.stem}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(clean_segments, f, indent=2,  ensure_ascii=False)

    print(f"Diarized transcript saved-> {output_path}")
    return output_path
