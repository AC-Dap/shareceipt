import {ReceiptItemType} from "../screens/ReceiptSplitScreen";

export function calculateItemSplit(price: number, peoplePaying: boolean[]){
    const numPaying = peoplePaying.reduce((cumSum, val) => cumSum + ((val)? 1 : 0), 0);
    return price / numPaying;
}
