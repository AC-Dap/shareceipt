export const formatPrice = (priceCents: number) => {
    const price = priceCents / 100;
    return price.toFixed(2);
}

export const parsePriceString = (priceString: string) => {
    if (priceString === "") return 0;

    const price = parseFloat(priceString);
    return Math.round(price * 100);
}