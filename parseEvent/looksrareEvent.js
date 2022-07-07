import _ from 'lodash';
import { ethers } from 'ethers';
import { RARITY_ENABLED, CONTRACT_ADDRESS } from '../config/setup.js';
import { markets } from '../config/markets.js';
import {
	shortenAddress,
	getNFTGORarity,
	getUsdPrice,
	getNftLastPrice
} from '../utils/api.js';

const looksrareEvent = async (event, floorPrice) => {
	let rank = null;
	let lastSale = null;
	const tokenId = _.get(event, ['token', 'tokenId']);
	const tokenName = _.get(event, ['token', 'name']);
	const image = _.get(event, ['token', 'imageURI']);
	const url = `${markets['looksrare'].site}${CONTRACT_ADDRESS}/${tokenId}`;
	const ethPrice = ethers.utils.formatEther(_.get(event, ['order', 'price']));
	const usdPrice = await getUsdPrice(ethPrice);
	const sellerAddr = _.get(event, ['order', 'signer']);
	const seller = shortenAddress(sellerAddr);
	const underFloor = ethPrice < floorPrice ? ' LOWER THAN FLOOR 🔥🔥🔥' : '';
	const title = `${tokenName} listed for ${ethPrice} ETH ($${usdPrice})${underFloor}`;

	if (RARITY_ENABLED) {
		const rarity = await getNFTGORarity(CONTRACT_ADDRESS, tokenId);
		const lastPrice = await getNftLastPrice(CONTRACT_ADDRESS, tokenId);
		lastSale = lastPrice
			? `\`${lastPrice.price_token} ${
					lastPrice.token_symbol
			  } ($ ${lastPrice.price_usd.toFixed(2)})\` <t:${lastPrice.time}:R>`
			: 'N/A';
		rank = _.get(rarity, 'rank');
		console.log(`NFTGO Rarity Rank: #${rank}`);
	}
	console.log(
		`${tokenName} listed for ${ethPrice} Ξ ($${usdPrice}) on LooksRare.\n`
	);

	return {
		rank: rank,
		tokenId: tokenId,
		title: title,
		quantity: 1,
		image: image,
		url: url,
		price: ethPrice,
		lastSale: lastSale,
		usdPrice: usdPrice,
		floorPrice: floorPrice,
		seller: seller,
		sellerAddr: sellerAddr,
		market: 'LooksRare 👀💎'
	};
};

export { looksrareEvent };
