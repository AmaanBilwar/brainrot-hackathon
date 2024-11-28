import fetch from "node-fetch"; // uncomment if using Node older than v21.x
import fs from "node:fs/promises";
import dotenv from 'dotenv';
dotenv.config();

const API_BASE_URL = "https://api.sws.speechify.com";

const API_KEY = process.env.SPEECHIFY_API_KEY;

const VOICE_ID = "c0133faa-73d3-4e47-aae6-8a6fc986ce5f";

async function getAudio(text) {
	const res = await fetch(`${API_BASE_URL}/v1/audio/speech`, {
		method: "POST",
		body: JSON.stringify({
			input: `<speak>${text}</speak>`,
			voice_id: VOICE_ID,
			audio_format: "mp3",
		}),
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"content-type": "application/json",
		},
	});

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}\n${await res.text()}`);
	}

	const responseData = await res.json();

	const decodedAudioData = Buffer.from(responseData.audio_data, "base64");

	return decodedAudioData;
}

async function main() {
	try{
		const text = await fs.readFile("./review.txt", "utf-8");
		const audio = await getAudio(text);
		await fs.writeFile('./static/speech.mp3', audio);
		console.log("Audio generated and saved to speech.mp3");
	} catch (error){
		console.error('Error:', error)
	};
}

main();
