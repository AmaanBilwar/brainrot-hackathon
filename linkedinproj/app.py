from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("No OPENAI_API_KEY set for OpenAI API")

query = input("Enter the content you want to include in your linkedin post: ")

client = OpenAI(api_key=OPENAI_API_KEY)
completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": "You are a helpful assistant. You're job is to create a linkedin post that is satirical and mocks the way linkedin posts are written. Posts should also be framed with excessive hastage that linkedin users would use. Remeber to overload it with buzzwords and jargon.",
        },
        {"role": "user", "content": f"{query}"},
    ],
)


print(completion.choices[0].message.content)
