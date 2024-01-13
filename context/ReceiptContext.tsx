import {Person, Receipt, ReceiptItem} from "../types/ReceiptTypes.types";
import {createContext, Dispatch, ReactNode, Reducer, useReducer} from "react";

type AddActions = {
    type: "ADD_PERSON",
    payload: Person
} | {
    type: "ADD_ITEM",
    payload: ReceiptItem
}

type UpdateActions = {
    type: "UPDATE_PERSON",
    payload: {
        idx: number,
        person: Person
    }
} | {
    type: "UPDATE_ITEM",
    payload: {
        idx: number,
        item: ReceiptItem
    }
} | {
    type: "UPDATE_MATCH",
    payload: {
        personIdx: number,
        receiptItemIdx: number,
        match: boolean
    }
} | {
    type: "UPDATE_TAX",
    payload: number
} | {
    type: "UPDATE_TIP",
    payload: number
}

type RemoveActions = {
    type: "REMOVE_PERSON",
    payload: number
} | {
    type: "REMOVE_ITEM",
    payload: number
}

type SetActions = {
    type: "SET_PARTY",
    payload: Person[]
} | {
    type: "SET_RECEIPT",
    payload: ReceiptItem[]
}

export type ReceiptAction = AddActions | UpdateActions | RemoveActions | SetActions;

const reducer = (prevState: Receipt, action: ReceiptAction) => {
    switch (action.type) {
        case "ADD_PERSON": {
            const newParty = [...prevState.party, action.payload];
            prevState.matches.push(new Array(prevState.receipt.length).fill(false));

            return {
                ...prevState,
                party: newParty
            }
        }
        case "ADD_ITEM": {
            const newReceipt = [...prevState.receipt, action.payload];
            const newMatches = prevState.matches.map(match => {
                match.push(false);
                return match;
            });

            return {
                ...prevState,
                receipt: newReceipt,
                matches: newMatches
            }
        }
        case "UPDATE_PERSON": {
            const newParty = prevState.party.map((person, i) =>
                (i == action.payload.idx) ? action.payload.person : person);

            return {
                ...prevState,
                party: newParty
            }
        }
        case "UPDATE_ITEM": {
            const newReceipt = prevState.receipt.map((item, i) =>
                (i == action.payload.idx) ? action.payload.item : item);

            return {
                ...prevState,
                receipt: newReceipt
            }
        }
        case "UPDATE_MATCH": {
            // Sanity check given indices
            if (action.payload.personIdx < 0 || action.payload.personIdx >= prevState.party.length ||
                action.payload.receiptItemIdx < 0 || action.payload.receiptItemIdx >= prevState.receipt.length) {
                return prevState;
            }
            prevState.matches[action.payload.personIdx][action.payload.receiptItemIdx] = action.payload.match;

            return {
                ...prevState
            }
        }
        case "UPDATE_TAX":
            return {
                ...prevState,
                taxCents: action.payload
            }
        case "UPDATE_TIP":
            return {
                ...prevState,
                tipCents: action.payload
            }
        case "REMOVE_PERSON": {
            const newParty = prevState.party.filter((_, i) => i != action.payload);
            const newMatches = prevState.matches.filter((_, i) => i != action.payload);

            return {
                ...prevState,
                party: newParty,
                matches: newMatches
            }
        }
        case "REMOVE_ITEM": {
            const newReceipt = prevState.receipt.filter((_, i) => i != action.payload);
            const newMatches = prevState.matches.map(match => {
                match.splice(action.payload, 1);
                return match;
            });

            return {
                ...prevState,
                receipt: newReceipt,
                matches: newMatches
            }
        }
        case "SET_PARTY":
            return {
                ...prevState,
                party: action.payload,
                matches: action.payload.map(_ => new Array(prevState.receipt.length).fill(false))
            }
        case "SET_RECEIPT":
            return {
                ...prevState,
                receipt: action.payload,
                matches: prevState.party.map(_ => new Array(action.payload.length).fill(false))
            }
    }
}

type ReceiptContextType = [Receipt, Dispatch<ReceiptAction>]
export const ReceiptContext = createContext<ReceiptContextType>([
    {
        party: [],
        receipt: [],
        taxCents: 0,
        tipCents: 0,
        matches: []
    },
    () => {
    }
]);

export const ReceiptProvider = ({children}: { children: ReactNode }) => {
    const [state, dispatch] = useReducer<Reducer<Receipt, ReceiptAction>>(reducer, {
        party: [],
        receipt: [],
        taxCents: 0,
        tipCents: 0,
        matches: []
    });

    return <ReceiptContext.Provider value={[state, dispatch]}>
        {children}
    </ReceiptContext.Provider>
}