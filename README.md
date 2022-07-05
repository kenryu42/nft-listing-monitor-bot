## NFT Listing Monitor Bot

NFT listing monitor bot of the marketplace.

[![GitHub license](https://img.shields.io/github/license/kenryu42/ethereum-nft-sales-bot)](https://github.com/kenryu42/opensea-nft-listing-bot/blob/main/LICENSE)

## Market Coverage

- [Opensea](https://opensea.io/)
  <img src="https://pbs.twimg.com/profile_images/1533843334946508806/kleAruEh_400x400.png" width="13"/>

- [Looksrare](https://looksrare.org/)
  <img src="https://pbs.twimg.com/profile_images/1493172984240308225/Nt6RFdmb_400x400.jpg" width="13"/>

- [X2Y2](https://x2y2.io/)
  <img src="https://pbs.twimg.com/profile_images/1482386069891198978/mMFwXNj8_400x400.jpg" width="13"/>

## Prerequisites

- Opensea API Key - [apply here](https://docs.opensea.io/reference/request-an-api-key)
- X2Y2 API Key - [apply here](https://docs.x2y2.io/developers/api)
- Etherscan API Key - [apply here](https://etherscan.io/register)

## Notify Method

- Twitter

- Discord

Notification is optional. You can turn it on in the `./.env` file.

For example:

```
TWITTER_ENABLED=1
DISCORD_ENABLED=1
```

## Twitter Guide

1. Register Twitter developer account with Elevated access. [🔗 Link](https://developer.twitter.com/en/portal/petition/essential/basic-info)
2. Create a development app with OAuth 1.0a read-write permissions. [🔗 Link](https://developer.twitter.com/en/docs/apps/app-permissions)
3. Install [Twurl](https://github.com/twitter/twurl) and run following command:

   ```
   twurl authorize --consumer-key <your-app-key> --consumer-secret <your-app-secret>
   ```

   This will return an URL that you should open up in your browser. Authenticate to Twitter, and then enter the returned PIN back into the terminal.

   This should create a file called `.twurlrc` in your home directory with all the necessary information.

## Discord Guide

1. Open the Discord channel you want to receive sales event notifications.
2. From the channel menu, select **Edit channel**.
3. Select **Integrations**.
4. Select **Create Webhook**.
5. Enter the name of the bot that will post the message.
6. Copy the URL from the **WEBHOOK URL** field.
7. Click **Save**.

## Configuration

> Create an `.env` file in the root directory of the project with the following contents:

**Do not commit/include your .env file in your repository.**

```
COLLECTION_SLUG=
CONTRACT_ADDRESS=
X2Y2_API_KEY=
OPENSEA_API_KEY=
ETHERSCAN_API_KEY=
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=
WEBHOOK_URL=
```

To find the collection slug, visit the collection page on Opensea. You will see the collection slug in the URL.

`https://opensea.io/collection/<collection-slug>`

## Installation

```bash
npm install
```

## Usage

Run the following command to start the bot:

```bash
node app.js
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## LICENSE

This project is [MIT](https://github.com/kenryu42/opensea-nft-listing-bot/blob/main/LICENSE) licensed.
