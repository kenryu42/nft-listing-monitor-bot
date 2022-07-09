import 'dotenv/config';

// Required settings
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
const X2Y2_API_KEY = process.env.X2Y2_API_KEY;
const COLLECTION_SLUG = process.env.COLLECTION_SLUG;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS.toLowerCase();
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// Discord setting if enable (optional)
const DISCORD_ENABLED = process.env.DISCORD_ENABLED;
const WEBHOOK_1 = process.env.WEBHOOK_URL;
const WEBHOOK_URLS = [WEBHOOK_1].filter((url) => url !== undefined);

// Twitter api setting if enable (optional)
const TWITTER_ENABLED = process.env.TWITTER_ENABLED;
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET;

// NFTGO rarity setting if enable (optional)
const NFTGO_ENABLED = process.env.NFTGO_ENABLED;
const NFTGO_API_KEY = process.env.NFTGO_API_KEY;

// Error checking for required settings
if (X2Y2_API_KEY === undefined) {
	console.log(
		'Please make sure you enter a valid X2Y2_API_KEY at (file:./.env)'
	);
	process.exit(1);
} else if (OPENSEA_API_KEY === undefined) {
	console.log(
		'Please make sure you enter a valid OPENSEA_API_KEY at (file:./.env)'
	);
	process.exit(1);
} else if (ETHERSCAN_API_KEY === undefined) {
	console.log(
		'Please make sure you enter a valid ETHERSCAN_API_KEY at (file:./.env)'
	);
	process.exit(1);
} else if (COLLECTION_SLUG === undefined) {
	console.log(
		'Please make sure you enter a valid COLLECTION_SLUG at (file:./.env)'
	);
	console.log('https://github.com/kenryu42/opensea-nft-listing-bot#usage');
	process.exit(1);
} else if (NFTGO_ENABLED && NFTGO_API_KEY === undefined) {
	console.log('NFTGO_ENABLED is true, but NFTGO_API_KEY is not set');
	console.log(
		'Please make sure you enter a valid NFTGO_API_KEY at (file:./.env)'
	);
	process.exit(1);
} else if (DISCORD_ENABLED && WEBHOOK_URLS.length === 0) {
	console.log('DISCORD_ENABLED is true, but WEBHOOK_URLS is empty');
	console.log(
		'Please make sure you enter a valid WEBHOOK_URL at (file:./.env)'
	);
	process.exit(1);
}

export {
	WEBHOOK_URLS,
	COLLECTION_SLUG,
	CONTRACT_ADDRESS,
	X2Y2_API_KEY,
	OPENSEA_API_KEY,
	ETHERSCAN_API_KEY,
	NFTGO_API_KEY,
	NFTGO_ENABLED,
	DISCORD_ENABLED,
	TWITTER_ENABLED,
	TWITTER_API_KEY,
	TWITTER_API_SECRET,
	TWITTER_ACCESS_TOKEN,
	TWITTER_ACCESS_SECRET
};
