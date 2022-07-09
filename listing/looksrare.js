import axios from 'axios';
import { setTimeout } from 'timers/promises';
import {
	getEpochTimestamp,
	getEthUsd,
	getLooksRareFloorPrice
} from '../utils/api.js';
import {
	WEBHOOK_URLS,
	DISCORD_ENABLED,
	TWITTER_ENABLED,
	CONTRACT_ADDRESS
} from '../config/setup.js';
import { looksrareEvent } from '../parseEvent/looksrareEvent.js';
import { createEmbed, sendEmbed } from '../notify/discordEmbed.js';
import { tweet } from '../notify/twitter.js';

let lastSeen = getEpochTimestamp();

async function get_listings(floorPrice, ethUsd) {
	await setTimeout(3000);
	try {
		const first = 5;
		const embeds = [];
		const url = `https://api.looksrare.org/api/v1/events?collection=${CONTRACT_ADDRESS}&type=LIST&pagination[first]=${first}`;

		const response = await axios.get(url);
		const data = response.data;
		const events = data.data;

		let temp = null;
		for (const event of events) {
			const startTime = event.order.startTime;

			if (startTime > lastSeen) {
				if (!temp) temp = startTime;
				const eventData = await looksrareEvent(event, floorPrice, ethUsd);

				if (DISCORD_ENABLED) {
					embeds.push(createEmbed(eventData, 'looksrare'));
				}
				if (TWITTER_ENABLED) {
					await tweet(eventData);
				}
			}
		}
		lastSeen = temp ? temp : lastSeen;
		if (DISCORD_ENABLED) {
			sendEmbed(WEBHOOK_URLS, embeds);
		}
	} catch (err) {
		console.log('Looksrare API error');
	}
}

async function monitorLooksrareListing() {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const floorPrice = await getLooksRareFloorPrice(CONTRACT_ADDRESS);
		const ethUsd = await getEthUsd();

		await get_listings(floorPrice, ethUsd);
	}
}

export { monitorLooksrareListing };
