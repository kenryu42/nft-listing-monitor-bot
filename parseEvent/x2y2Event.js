import _ from 'lodash';
import { ethers } from 'ethers';
import { RARITY_ENABLED, CONTRACT_ADDRESS } from '../config/setup.js';
import { shortenAddress, getNFTGORarity, getUsdPrice } from '../utils/api.js';

const x2y2Event = async (event, floorPrice, collectionName) => {
	let rank = null;
	const tokenId = _.get(event, ['token', 'token_id']);
	const tokenName = `${collectionName} ${tokenId}`;
	const image = `https://img.x2y2.io/v2/1/${CONTRACT_ADDRESS}/${tokenId}/1440/image.jpg`;
	const url = `https://x2y2.io/eth/${CONTRACT_ADDRESS}/${tokenId}`;
	const ethPrice = ethers.utils.formatEther(_.get(event, ['order', 'price']));
	const usdPrice = await getUsdPrice(ethPrice);
	const sellerAddr = _.get(event, 'from_address');
	const seller = shortenAddress(sellerAddr);
	const underFloor = ethPrice < floorPrice ? ' LOWER THAN FLOOR 🔥🔥🔥' : '';
	const title = `${tokenName} listed for ${ethPrice} ETH ($${usdPrice})${underFloor}`;

	if (RARITY_ENABLED) {
		const rarity = await getNFTGORarity(CONTRACT_ADDRESS, tokenId);
		rank = _.get(rarity, 'rank');
		console.log(`NFTGO Rarity Rank: #${rank}`);
	}
	console.log(`${tokenName} listed for ${ethPrice} Ξ ($${usdPrice}) on x2y2\n`);

	return {
		rank: rank,
		tokenId: tokenId,
		quantity: 1,
		title: title,
		image: image,
		url: url,
		price: ethPrice,
		usdPrice: usdPrice,
		floorPrice: floorPrice,
		seller: seller,
		sellerAddr: sellerAddr,
		is_bundle: false,
		market: 'X2Y2 ⭕️'
	};
};

export { x2y2Event };
