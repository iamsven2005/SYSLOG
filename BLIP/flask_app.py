from flask import Flask, request, jsonify
from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
import io
from FlagEmbedding import FlagModel
import torch.nn.functional as F
import logging
import sys

app = Flask(__name__)

# Logging setup (stdout for Promtail)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)

device = "cuda" if torch.cuda.is_available() else "cpu"
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(device)
model2 = FlagModel("BAAI/bge-base-en", use_fp16=torch.cuda.is_available())
model.eval()

@app.route("/")
def home():
    app.logger.info("Home route accessed")
    return """
    <h1>BLIP Image Captioning + Embedding Server</h1>
    <p>Use <code>/analyze</code> to POST an image and get captions + vision embeddings.</p>
    <p>Use <code>/embed</code> to POST JSON with 'texts' for sentence embedding via BGE model.</p>
    """

@app.route("/analyze", methods=["POST"])
def analyze_image():
    try:
        image_bytes = request.data
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        inputs = processor(image, return_tensors="pt").to(device)

        out = model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)

        with torch.no_grad():
            encoder_outputs = model.vision_model(**inputs)
            cls_embedding = encoder_outputs.last_hidden_state[:, 0, :].squeeze().tolist()

        app.logger.info("Image analyzed: %s", caption)
        return jsonify({"caption": caption, "embedding": cls_embedding})
    except Exception as e:
        app.logger.error("Error analyzing image: %s", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/embed", methods=["POST"])
def embed_text():
    try:
        data = request.get_json()
        texts = data.get("texts", [])

        if not texts:
            app.logger.warning("No text provided for embedding")
            return jsonify({"error": "No text provided"}), 400

        prompt = "Represent this sentence for semantic search:"
        embedded = model2.encode([f"{prompt} {texts}"])
        embedded_tensor = torch.tensor(embedded)
        normal = F.normalize(embedded_tensor, p=2, dim=1)
        app.logger.info("Text embedded successfully: %s", texts)
        return jsonify({"embedding": normal[0].tolist()})
    except Exception as e:
        app.logger.error("Error embedding text: %s", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
