import _ from 'lodash';
import fetch from 'node-fetch';
import axios from 'axios';
import { ethers } from 'ethers';
import {
	X2Y2_API_KEY,
	OPENSEA_API_KEY,
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
		if (error.response) {
			console.error(error.response.data);
			console.error(error.response.status);
		} else {
			console.error(error.message);
		}

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
		if (error.response) {
			console.error(error.response.data);
			console.error(error.response.status);
		} else {
			console.error(error.message);
		}

		return null;
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
		if (error.response) {
			console.error(error.response.data);
			console.error(error.response.status);
		} else {
			console.error(error.message);
		}

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
		if (error.response) {
			console.error(error.response.data);
			console.error(error.response.status);
		} else {
			console.error(error.message);
		}
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
		if (error.response) {
			console.error(error.response.data);
			console.error(error.response.status);
		} else {
			console.error(error.message);
		}
		throw new Error('X2Y2 API error: getX2Y2CollectionName()');
	}
};

const getEpochTimestamp = (timestamp) => {
	// use a timestamp if it is given, else use the current time
	let date = timestamp ? new Date(timestamp) : new Date();
	return Math.floor(date.getTime() / 1000);
};

const openRarityHelper = (percentage) => {
	let result = '';

	if (percentage < 0.1) {
		result = 'Top 0.1% • ';
	} else if (percentage < 1) {
		result = 'Top 1% • ';
	} else if (percentage < 5) {
		result = 'Top 5% • ';
	} else if (percentage < 10) {
		result = 'Top 10% • ';
	} else if (percentage < 20) {
		result = 'Top 20% • ';
	} else if (percentage < 30) {
		result = 'Top 30% • ';
	} else if (percentage < 40) {
		result = 'Top 40% • ';
	} else if (percentage < 50) {
		result = 'Top 50% • ';
	}

	return result;
};

const getOpenRarity = async (contractAddress, tokenId) => {
	const url = `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`;

	try {
		const response = await axios.get(url, {
			headers: {
				'X-API-KEY': OPENSEA_API_KEY
			}
		});
		const rarityData = _.get(response, 'data.rarity_data');

		if (!rarityData) return null;

		const rank = _.get(rarityData, 'rank');
		const maxRank = _.get(rarityData, 'max_rank');
		const percentage = (parseInt(rank) / parseInt(maxRank)) * 100;

		return `${openRarityHelper(percentage)}${parseInt(rank).toLocaleString(
			'en-US'
		)} / ${parseInt(maxRank).toLocaleString('en-US')}`;
	} catch (error) {
		if (error.response) {
			console.error(error.response.data);
			console.error(error.response.status);
		} else {
			console.error(error.message);
		}

		return null;
	}
};

export {
	getEthUsd,
	shortenAddress,
	getEpochTimestamp,
	getX2Y2FloorPrice,
	getOpenseaFloorPrice,
	getX2Y2CollectionName,
	getLooksRareFloorPrice,
	getOpenRarity
};
