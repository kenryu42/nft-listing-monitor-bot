import _ from 'lodash';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, BLACK_LIST } from '../config/setup.js';
import { markets } from '../config/markets.js';
import { shortenAddress } from '../utils/api.js';

const looksrareEvent = async (event, floorPrice, ethUsd) => {
	const tokenId = _.get(event, ['token', 'tokenId']);
	const tokenName = _.get(event, ['token', 'name']);
	const image = _.get(event, ['token', 'imageURI']);
	const url = `${markets['looksrare'].site}${CONTRACT_ADDRESS}/${tokenId}`;
	const ethPrice = ethers.utils.formatEther(_.get(event, ['order', 'price']));
	const usdPrice = parseFloat(ethUsd * ethPrice).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	const sellerAddr = _.get(event, ['order', 'signer']);
	if (BLACK_LIST.includes(sellerAddr.toLowerCase())) {
		console.log(`Seller ${sellerAddr} is blacklisted, skipping...`);
		return null;
	}
	const seller = shortenAddress(sellerAddr);
	const underFloor =
		parseFloat(ethPrice) < parseFloat(floorPrice)
			? ' LOWER THAN FLOOR 🔥🔥🔥'
			: '';
	const title = `${tokenName} listed for ${ethPrice} ETH ($${usdPrice})${underFloor}`;

	console.log(
		`${tokenName} listed for ${ethPrice} Ξ ($${usdPrice}) on LooksRare.\n`
	);

	return {
		tokenId: tokenId,
		title: title,
		quantity: 1,
		image: image,
		url: url,
		price: ethPrice,
		usdPrice: usdPrice,
		floorPrice: floorPrice,
		seller: seller,
		sellerAddr: sellerAddr,
		market: 'LooksRare 👀💎'
	};
};

export { looksrareEvent };
