import fetch from 'node-fetch';
import { setTimeout } from 'timers/promises';
import {
	getEthUsd,
	getEpochTimestamp,
	getOpenseaFloorPrice
} from '../utils/api.js';
import {
	WEBHOOK_URLS,
	DISCORD_ENABLED,
	TWITTER_ENABLED,
	OPENSEA_API_KEY,
	COLLECTION_SLUG
} from '../config/setup.js';
import { openseaEvent } from '../parseEvent/openseaEvent.js';
import { createEmbed, sendEmbed } from '../notify/discordEmbed.js';
import { tweet } from '../notify/twitter.js';

let lastSeen = null;
const INTERVAL = 5000;

async function get_listings(occurredAfter, floorPrice, ethUsd) {
	const options = {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'X-API-KEY': OPENSEA_API_KEY
		}
	};

	let nextPage = null;
	do {
		try {
			await setTimeout(300);

			const embeds = [];
			let url = `https://api.opensea.io/api/v1/events?collection_slug=${COLLECTION_SLUG}&event_type=created&occurred_after=${occurredAfter}`;

			if (nextPage != null) {
				url += '&cursor=' + nextPage;
			}
			const response = await fetch(url, options).then((r) => r.json());
			nextPage = response.next;

			for (const event of response.asset_events) {
				const created_date = new Date(event.created_date).valueOf();
				if (created_date <= lastSeen) continue;
				lastSeen = created_date;
				const eventData = await openseaEvent(event, floorPrice, ethUsd);

				if (DISCORD_ENABLED) {
					embeds.push(createEmbed(eventData, 'opensea'));
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
			console.log('Opensea Listing API error');
			break;
		}
	} while (nextPage != null);
	return;
}

async function monitorOpenseaListing() {
	setInterval(async () => {
		const occurredAfter = getEpochTimestamp() - 5;
		const floorPrice = await getOpenseaFloorPrice(COLLECTION_SLUG);
		const ethUsd = await getEthUsd();

		await get_listings(occurredAfter, floorPrice, ethUsd);
	}, INTERVAL);
}

export { monitorOpenseaListing };
