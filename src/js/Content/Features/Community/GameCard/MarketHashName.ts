const MarketListingPath = "/market/listings/753/";
const CardSuffixes = [" (Foil Trading Card)", " (Trading Card)", " (Foil)"];

export function getCardMarketHashName(node: Element, appid: number, cardName: string): string {
    const href = node
        .querySelector<HTMLAnchorElement>(`a[href*="${MarketListingPath}"]`)
        ?.getAttribute("href");
    if (!href) {
        return `${appid}-${cardName}`;
    }

    const path = new URL(href, "https://steamcommunity.com").pathname;
    const marker = path.indexOf(MarketListingPath);
    if (marker < 0) {
        return `${appid}-${cardName}`;
    }

    try {
        const marketHashName = decodeURIComponent(path.slice(marker + MarketListingPath.length));
        for (const suffix of CardSuffixes) {
            if (marketHashName.endsWith(suffix)) {
                return marketHashName.slice(0, -suffix.length);
            }
        }
        return marketHashName;
    } catch {
        return `${appid}-${cardName}`;
    }
}
