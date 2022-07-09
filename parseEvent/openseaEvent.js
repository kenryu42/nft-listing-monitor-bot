import _ from 'lodash';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../config/setup.js';
import { shortenAddress, getRankAndLastSale } from '../utils/api.js';

const openseaEvent = async (event, floorPrice, ethUsd) => {
	let url;
	let image;
	let tokenName;
	const quantity = _.get(event, 'quantity');
	const asset_bundle = _.get(event, 'asset_bundle');
	const is_bundle = asset_bundle !== null;
	const tokenId = _.get(event, ['asset', 'token_id']);
	const ethPrice = ethers.utils.formatEther(_.get(event, 'ending_price'));
	const usdPrice = parseFloat(ethUsd * ethPrice).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	const sellerAddr = _.get(event, ['seller', 'address']);
	const seller =
		_.get(event, ['seller', 'user', 'username']) || shortenAddress(sellerAddr);
	const underFloor =
		parseFloat(ethPrice) < parseFloat(floorPrice)
			? ' LOWER THAN FLOOR 🔥🔥🔥'
			: '';

	if (asset_bundle) {
		const assets = _.get(asset_bundle, 'assets');
		image = _.get(assets[0], 'image_url');
		url = _.get(asset_bundle, 'permalink');
		const collectionName = _.get(asset_bundle, [
			'asset_contract',
			'collection',
			'name'
		]);
		tokenName = `${quantity} ${collectionName}`;
	} else {
		image = _.get(event, ['asset', 'image_url']);
		tokenName = _.get(event, ['asset', 'name']);
		url = _.get(event, ['asset', 'permalink']);
	}

	const title = `${tokenName} listed for ${ethPrice} ETH ($${usdPrice})${underFloor}`;
	const { rank, lastSale } = await getRankAndLastSale(
		CONTRACT_ADDRESS,
		tokenId
	);

	console.log(`ethUSd: ${ethUsd}`);
	console.log(
		`${tokenName} listed for ${ethPrice} Ξ ($${usdPrice}) on opensea\n`
	);

	return {
		rank: rank,
		tokenId: tokenId,
		quantity: quantity,
		is_bundle: is_bundle,
		title: title,
		image: image,
		url: url,
		price: ethPrice,
		lastSale: lastSale,
		usdPrice: usdPrice,
		floorPrice: floorPrice,
		seller: seller,
		sellerAddr: sellerAddr,
		market: 'OpenSea 🌊'
	};
};

export { openseaEvent };
