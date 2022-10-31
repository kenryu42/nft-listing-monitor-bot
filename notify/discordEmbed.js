import { markets } from '../config/markets.js';
import { MessageEmbed, WebhookClient } from 'discord.js';

const createEmbed = (event, market) => {
	const isX2Y2 = market === 'x2y2' ? '/items' : '';
	const embed = new MessageEmbed()
		.setTitle(event.title)
		.addField(
			'Price',
			`\`${event.price} ETH ($ ${event.usdPrice || '-'})\``,
			true
		)
		.addField('Floor', `\`${event.floorPrice || '-'} ETH\``, true)
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
	if (event.openRarity) {
		embed.setAuthor({
			name: `Rarity Rank: ${event.openRarity}`,
			iconURL:
				'https://pbs.twimg.com/profile_images/1565548199221362694/_sX_URXO_400x400.jpg'
		});
	}
	embed.addField(
		'Seller',
		`[${event.seller}](${markets[market].account_site}${event.sellerAddr}${isX2Y2})`
	);

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
