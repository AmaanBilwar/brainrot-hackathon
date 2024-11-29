from openai import OpenAI
from dotenv import load_dotenv
import base64
import os
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, render_template, jsonify, url_for
from flask_cors import CORS
import subprocess
import re
import logging

load_dotenv()


app = Flask(__name__)
CORS(app)


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("Please set the OPENAI_API_KEY environment variable")

client = OpenAI(api_key=OPENAI_API_KEY)

# Configure logging
logging.basicConfig(level=logging.DEBUG)


def is_retail(url):
    retail_domains = [
        "amazon.in",
        "amazon.com", "ebay.com", "walmart.com", "target.com", "bestbuy.com"
    ]
    result = any(domain in url for domain in retail_domains)
    logging.debug(f"URL '{url}' is retail: {result}")
    return result


def is_suitcase(html_content):
    keywords = ["suitcase", "luggage", "travel bag"]
    soup = BeautifulSoup(html_content, "html.parser")
    text = soup.get_text().lower()
    logging.debug(f"Extracted text: {text[:500]}")  # Log the first 500 characters of the text
    for keyword in keywords:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text):
            logging.debug(f"Keyword '{keyword}' found in text.")
            return True
    logging.debug("No keywords found in text.")
    return False


@app.route("/", methods=["GET", "POST"])
def main():
    if request.method == "POST":
        url = request.form["url"]
        if is_retail(url):
            response = requests.get(url)
            if response.status_code == 200:
                if is_suitcase(response.text):
                    response = client.chat.completions.create(
                        model="gpt-4o",
                        messages=[
                            {
                                "role": "system",
                                "content": f"You are a helpful product reviewer. Use the provided {url} to use as the source of your review. Every two to three sentences, add this sentence: 'I LIKE MY SOOTCASE!'. Also keep the review upto a 120 words. Only review the product if its a suitcase or a travel bag.",
                            },
                            {
                                "role": "user",
                                "content": "Give me a review about this suitcase.",
                            },
                        ],
                    )
                    with open("review.txt", "w") as f:
                        f.write(response.choices[0].message.content)

                    try: 
                        result = subprocess.run(["node", "server.js"]),
                        capture_output=True,
                        text=True
                        if result.returncode != 0:
                            raise Exception(result.stderr)
                    except Exception as e: 
                        print(e)
                        
                        
                    return render_template(
                        "suitcase.html",
                        is_suitcase=response.choices[0].message.content,
                        url=url,
                    )

                else:
                    return render_template(
                        "not_suitcase.html",
                    )
            else:
                return render_template("not_suitcase.html")
        else:
            return render_template("not_retail.html")

    return render_template("index.html")


if __name__ == "__main__":
    app.run()
