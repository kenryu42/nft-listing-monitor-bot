import { CONTRACT_ADDRESS, RARITY_ENABLED } from '../config/setup.js';
import { markets } from '../config/markets.js';
import { MessageEmbed, WebhookClient } from 'discord.js';

const createEmbed = (event, market) => {
	const isX2Y2 = market === 'x2y2' ? '/items' : '';
	const embed = new MessageEmbed()
		.setTitle(event.title)
		.addField('Price', `\`${event.price} ETH ($ ${event.usdPrice})\``, true)
		.addField('Floor', `\`${event.floorPrice} ETH\``, true)
		.addField(
			'Seller',
			`[${event.seller}](${markets[market].account_site}${event.sellerAddr}${isX2Y2})`
		)
		.setURL(event.url)
		.setImage(event.image)
		.setColor(markets[market].color)
		.setTimestamp()
		.setFooter({
			text: markets[market].name,
			iconURL: markets[market].iconURL
		});
	if (event.quantity > 1) {
		embed.addField('Quantity', `\`${event.quantity}\``, false);
	}

	if (RARITY_ENABLED && !event.is_bundle) {
		embed.setAuthor({
			name: `NFTGO Rarity Rank: #${event.rank || 'N/A'}`,
			iconURL:
				'https://pbs.twimg.com/profile_images/1475300585196777472/GYA3Y-EC_400x400.jpg',
			url: `https://nftgo.io/asset/ETH/${CONTRACT_ADDRESS}/${event.tokenId}`
		});
	}

	return embed;
};

const sendEmbed = (webhookURLS, embeds) => {
	if (embeds.length === 0) return;

	webhookURLS.forEach((webhookURL) => {
		if (webhookURL === undefined) return;
		const webhookClient = new WebhookClient({ url: webhookURL });

		webhookClient.send({
			embeds: embeds
		});
	});
};

export { createEmbed, sendEmbed };
