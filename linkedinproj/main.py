from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("No OPENAI_API_KEY set for OpenAI API")


client = OpenAI(api_key=OPENAI_API_KEY)


app = Flask(__name__)

CORS(app)

@app.route('/',methods=['GET','POST'])
def index():
    return render_template('index.html')

@app.route('/api', methods=['GET','POST'])
def main():
    content = request.form['content']
    completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": "You are a helpful assistant. You're job is to create a linkedin post that is satirical and mocks the way linkedin posts are written. Posts should also be framed with excessive hastage that linkedin users would use. Remeber to overload it with buzzwords and jargon.",
        },
        {"role": "user", "content": f"{content}"},
    ],
)  
    response_content = completion.choices[0].message.content
    fomatted_response = "<p>" + "</p><p>".join(response_content.split("\n")) + "</p>"
    return render_template('response.html', response=fomatted_response)


if __name__ == '__main__':
    app.run(debug=True)


