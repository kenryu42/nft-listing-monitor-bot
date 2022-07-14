import 'dotenv/config';

// Required settings
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
const X2Y2_API_KEY = process.env.X2Y2_API_KEY;
const COLLECTION_SLUG = process.env.COLLECTION_SLUG;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
	? process.env.CONTRACT_ADDRESS.toLowerCase()
	: null;
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
const requiredSettings = {
	X2Y2_API_KEY: X2Y2_API_KEY,
	OPENSEA_API_KEY: OPENSEA_API_KEY,
	COLLECTION_SLUG: COLLECTION_SLUG,
	CONTRACT_ADDRESS: CONTRACT_ADDRESS,
	ETHERSCAN_API_KEY: ETHERSCAN_API_KEY
};

const twitterSettings = {
	TWITTER_API_KEY: TWITTER_API_KEY,
	TWITTER_API_SECRET: TWITTER_API_SECRET,
	TWITTER_ACCESS_TOKEN: TWITTER_ACCESS_TOKEN,
	TWITTER_ACCESS_SECRET: TWITTER_ACCESS_SECRET
};

let requirementsNotMatched = false;

for (const setting in requiredSettings) {
	if (!requiredSettings[setting]) {
		console.log(
			`Please make sure you enter a valid ${setting} at (file:./.env)`
		);
		requirementsNotMatched = true;
	}
}
if (DISCORD_ENABLED && WEBHOOK_URLS.length === 0) {
	console.log(
		`Please make sure you enter a valid WEBHOOK_URL at (file:./.env)`
	);
	requirementsNotMatched = true;
}
if (NFTGO_ENABLED && !NFTGO_API_KEY) {
	console.log(
		`Please make sure you enter a valid NFTGO_API_KEY at (file:./.env)`
	);
	requirementsNotMatched = true;
}
for (const setting in twitterSettings) {
	if (TWITTER_ENABLED && !twitterSettings[setting]) {
		console.log(
			`Please make sure you enter a valid ${setting} at (file:./.env)`
		);
		requirementsNotMatched = true;
	}
}
if (requirementsNotMatched) process.exit(1);

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
