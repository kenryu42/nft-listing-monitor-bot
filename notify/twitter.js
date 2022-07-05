import { TwitterApi, EUploadMimeType } from 'twitter-api-v2';
import axios from 'axios';
import {
	TWITTER_ENABLED,
	TWITTER_API_KEY,
	TWITTER_API_SECRET,
	TWITTER_ACCESS_TOKEN,
	TWITTER_ACCESS_SECRET
} from '../config/setup.js';

let client;
let rwClient;

if (TWITTER_ENABLED) {
	client = new TwitterApi({
		appKey: TWITTER_API_KEY,
		appSecret: TWITTER_API_SECRET,
		accessToken: TWITTER_ACCESS_TOKEN,
		accessSecret: TWITTER_ACCESS_SECRET
	});

	rwClient = client.readWrite;
}

const tweet = async (event) => {
	const { title, url, image, floorPrice, market } = event;
	const response = await axios.get(image, {
		responseType: 'arraybuffer'
	});
	const imageBuffer = Buffer.from(response.data, 'utf-8');
	const mediaId = await client.v1.uploadMedia(imageBuffer, {
		mimeType: EUploadMimeType.Png
	});
	const tweetContent = `
	${title} on ${market}.	

	【 Floor Price 】	
	${floorPrice}

	【 Link 】
	${url}
	`;

	try {
		await rwClient.v1.tweet(tweetContent, { media_ids: mediaId });
	} catch (error) {
		console.log(error);
	}
};

export { tweet };
