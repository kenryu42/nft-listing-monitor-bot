import { COLLECTION_SLUG } from './config/setup.js';
import { monitorX2Y2Listing } from './listing/x2y2.js';
import { monitorOpenseaListing } from './listing/opensea.js';
import { monitorLooksrareListing } from './listing/looksrare.js';

Promise.allSettled([
	monitorX2Y2Listing(),
	monitorOpenseaListing(),
	monitorLooksrareListing()
]).then(console.log(`Started monitoring ${COLLECTION_SLUG} listing events`));
