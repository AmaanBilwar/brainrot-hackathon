from openai import OpenAI
from flask import Flask, request, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_community.document_loaders import PyPDFLoader
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise EnvironmentError("OPENAI_API_KEY is not set")

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")


@app.route("/upload_docs", methods=["GET", "POST"])
def main():
    file = request.files["file"]
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension is ".csv":
        file_path = os.path.join("uploads", file.filename)
        loader = CSVLoader(file_path=file_path)
        data = loader.load()
        print(data)
    if file_extension is ".pdf":
        file_path = os.path.join("uploads", file.filename)
        loader = PyPDFLoader(file_path=file_path)
        data = loader.load()
        print(data)
    if file_extension not in [".csv", ".pdf"]:
        return render_template("error.html")

    return render_template("upload.html")


@app.route("/generate_summary", methods=["GET", "POST"])
def generate_summary():
    pass
