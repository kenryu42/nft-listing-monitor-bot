import axios from 'axios';
import { setTimeout } from 'timers/promises';
import {
	getEpochTimestamp,
	getEthUsd,
	getX2Y2CollectionName,
	getX2Y2FloorPrice
} from '../utils/api.js';
import {
	WEBHOOK_URLS,
	DISCORD_ENABLED,
	TWITTER_ENABLED,
	X2Y2_API_KEY,
	CONTRACT_ADDRESS
} from '../config/setup.js';
import { x2y2Event } from '../parseEvent/x2y2Event.js';
import { createEmbed, sendEmbed } from '../notify/discordEmbed.js';
import { tweet } from '../notify/twitter.js';

let lastSeen = null;
const INTERVAL = 5000;

async function get_listings(createdAfter, floorPrice, collectionName, ethUsd) {
	const url = 'https://api.x2y2.org/v1/events';
	const options = {
		params: {
			type: 'list',
			contract: CONTRACT_ADDRESS,
			created_after: createdAfter
		},
		headers: {
			Accept: 'application/json',
			'X-API-KEY': X2Y2_API_KEY
		}
	};
	let nextPage = null;

	do {
		try {
			await setTimeout(500);

			const embeds = [];

			const response = await axios.get(url, options);
			nextPage = response.next;
			if (nextPage) options.params.cursor = nextPage;

			for (const event of response.data.data) {
				const created_date = event.created_at;
				if (created_date <= lastSeen) continue;
				lastSeen = created_date;
				const eventData = await x2y2Event(
					event,
					floorPrice,
					collectionName,
					ethUsd
				);

				if (DISCORD_ENABLED) {
					embeds.push(createEmbed(eventData, 'x2y2'));
				}
				if (TWITTER_ENABLED) {
					await tweet(eventData);
				}
			}
			if (DISCORD_ENABLED) {
				sendEmbed(WEBHOOK_URLS, embeds);
			}
		} catch (error) {
			if (error.response) {
				console.error(error.response.data);
				console.error(error.response.status);
			} else {
				console.error(error.message);
			}
			console.log('X2Y2 listing API error');
			break;
		}
	} while (nextPage != null);
	return;
}

async function monitorX2Y2Listing() {
	const collectionName = await getX2Y2CollectionName(CONTRACT_ADDRESS);
	setInterval(async () => {
		const createdAfter = getEpochTimestamp() - 5;
		const floorPrice = await getX2Y2FloorPrice(CONTRACT_ADDRESS);
		const ethUsd = await getEthUsd();

		await get_listings(createdAfter, floorPrice, collectionName, ethUsd);
	}, INTERVAL);
}

export { monitorX2Y2Listing };
