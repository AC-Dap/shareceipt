export type Person = string;
export type ReceiptItem = {
    name: string,
    priceCents: number
}

export type Receipt = {
    party: Person[]
    receipt: ReceiptItem[],
    taxCents: number,
    tipCents: number,
    matches: boolean[][]
}