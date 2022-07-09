import _ from 'lodash';
import fetch from 'node-fetch';
import axios from 'axios';
import { ethers } from 'ethers';
import {
	NFTGO_ENABLED,
	X2Y2_API_KEY,
	OPENSEA_API_KEY,
	NFTGO_API_KEY,
	ETHERSCAN_API_KEY
} from '../config/setup.js';

const shortenAddress = (address) => {
	return (
		address.substring(0, 6) + '...' + address.substring(address.length - 4)
	);
};

const getEthUsd = async () => {
	const url = `
https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}
`;
	try {
		const response = await axios.get(url);
		const result = _.get(response, ['data', 'result']);
		const ethUsd = _.get(result, 'ethusd');

		return ethUsd;
	} catch (error) {
		console.log('getEthUsd API error: ', error);

		return null;
	}
};

const getOpenseaFloorPrice = async (collection_slug) => {
	const options = {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'X-API-KEY': OPENSEA_API_KEY
		}
	};

	try {
		let url = `https://api.opensea.io/api/v1/collection/${collection_slug}/stats`;
		const res = await fetch(url, options).then((r) => r.json());

		return _.get(res, ['stats', 'floor_price']);
	} catch (error) {
		console.log(error);
	}
};

const getLooksRareFloorPrice = async (contractAddress) => {
	const url = `https://api.looksrare.org/api/v1/collections/stats?address=${contractAddress}`;

	try {
		const response = await axios.get(url);
		const data = _.get(response, 'data');
		const success = _.get(data, 'success');

		if (success) {
			const floorPrice = ethers.utils.formatEther(
				_.get(data, ['data', 'floorPrice'])
			);

			return floorPrice;
		}

		return null;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const getX2Y2FloorPrice = async (contractAddress) => {
	const url = `https://api.x2y2.org/v1/contracts/${contractAddress}/stats`;

	try {
		const response = await axios.get(url, {
			headers: {
				'X-API-KEY': X2Y2_API_KEY
			}
		});
		const floorPrice = ethers.utils.formatEther(
			_.get(response, ['data', 'data', 'floor_price'])
		);

		return floorPrice;
	} catch (error) {
		console.log('X2Y2 API error: getX2Y2FloorPrice()');
		return null;
	}
};

const getX2Y2CollectionName = async (contractAddress) => {
	const url = `https://api.x2y2.org/v1/contracts/${contractAddress}`;

	try {
		const response = await axios.get(url, {
			headers: {
				'X-API-KEY': X2Y2_API_KEY
			}
		});
		const collectionName = _.get(response, ['data', 'data', 'name']);

		return collectionName;
	} catch (error) {
		throw new Error('X2Y2 API error: getX2Y2CollectionName()');
	}
};

const getEpochTimestamp = (timestamp) => {
	// use a timestamp if it is given, else use the current time
	let date = timestamp ? new Date(timestamp) : new Date();
	return Math.floor(date.getTime() / 1000);
};

const getNFTGORarity = async (contractAddress, tokenId) => {
	const baseURL = `https://api.nftgo.dev/eth/v1/nft/${contractAddress}/${tokenId}/rarity`;

	try {
		const response = await axios.get(baseURL, {
			headers: {
				'X-API-KEY': NFTGO_API_KEY
			}
		});

		const data = _.get(response, 'data');

		return data;
	} catch (error) {
		if (error.response) {
			console.log(error.response.data);
			console.log(error.response.status);
		} else {
			console.error(error.message);
		}
		return null;
	}
};

const getNftLastPrice = async (contractAddress, tokenId) => {
	const url = `https://api.nftgo.dev/eth/v1/nft/${contractAddress}/${tokenId}/metrics`;

	try {
		const response = await axios.get(url, {
			headers: {
				'X-API-KEY': NFTGO_API_KEY
			}
		});

		const lastPrice = _.get(response, ['data', 'last_price']);

		return lastPrice;
	} catch (error) {
		console.log('API error: ', error);

		return null;
	}
};

const getRankAndLastSale = async (contractAddress, tokenId) => {
	if (!NFTGO_ENABLED) {
		return {
			rank: null,
			lastSale: null
		};
	}
	const rarity = await getNFTGORarity(contractAddress, tokenId);
	const lastPrice = await getNftLastPrice(contractAddress, tokenId);
	const price_usd = lastPrice
		? parseFloat(_.get(lastPrice, 'price_usd')).toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
		  })
		: null;
	const lastSale = lastPrice
		? `\`${lastPrice.price_token} ${lastPrice.token_symbol} ($ ${price_usd})\` <t:${lastPrice.time}:R>`
		: 'N/A';
	const rank = _.get(rarity, 'rank');
	console.log(`NFTGO Rarity Rank: #${rank}`);

	return {
		rank: rank,
		lastSale: lastSale
	};
};

export {
	getEthUsd,
	shortenAddress,
	getEpochTimestamp,
	getX2Y2FloorPrice,
	getRankAndLastSale,
	getOpenseaFloorPrice,
	getX2Y2CollectionName,
	getLooksRareFloorPrice
};
