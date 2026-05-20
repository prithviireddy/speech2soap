#use openAI Whisper to convert audio to text
import whisper

model = whisper.load_model("turbo")

result = model.transcribe("test.wav")

print(result["text"])
