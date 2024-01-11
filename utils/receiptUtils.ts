import {Receipt} from "../types/ReceiptTypes";

export const getReceiptSubtotal = (receipt: Receipt) => {
    return receipt.receipt.reduce((total, item) => total + item.priceCents, 0);
}

export const getReceiptTotal = (receipt: Receipt) => {
    return getReceiptSubtotal(receipt) + receipt.taxCents + receipt.tipCents;
}