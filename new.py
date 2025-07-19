from flask import Flask, request, url_for, render_template_string
import os
from pillow_heif import register_heif_opener
from PIL import Image
import uuid

# Enable HEIC support in Pillow
register_heif_opener()

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
CONVERTED_FOLDER = "static"   # Flask serves /static automatically
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)

HTML_PAGE = """
<!doctype html>
<title>HEIC Viewer</title>
<h1>Upload a HEIC file</h1>
<form method="post" enctype="multipart/form-data">
  <input type="file" name="file" accept=".heic">
  <input type="submit" value="Upload">
</form>
{% if image_url %}
  <h2>Converted Image:</h2>
  <img src="{{ image_url }}" style="max-width:100%;height:auto;">
{% endif %}
"""

@app.route("/", methods=["GET", "POST"])
def upload_file():
    image_url = None

    if request.method == "POST":
        file = request.files.get("file")
        if file and file.filename.lower().endswith(".heic"):
            # Save original HEIC
            heic_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(heic_path)

            # Convert to JPEG
            img = Image.open(heic_path)
            converted_name = f"{uuid.uuid4().hex}.jpg"
            converted_path = os.path.join(CONVERTED_FOLDER, converted_name)
            img.save(converted_path, "JPEG")

            image_url = url_for("static", filename=converted_name)

    return render_template_string(HTML_PAGE, image_url=image_url)

if __name__ == "__main__":
    app.run(debug=True)
