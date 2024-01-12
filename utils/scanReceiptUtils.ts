import {closeTessAPI, initTessAPI, readImage} from "../modules/tesseractocr";
import {
    getPendingResultAsync,
    ImagePickerOptions,
    ImagePickerResult,
    launchCameraAsync,
    launchImageLibraryAsync,
    MediaTypeOptions
} from "expo-image-picker";
import {Receipt, ReceiptItem} from "../types/ReceiptTypes.types";
import {parsePriceString} from "./priceUtils";

const pictureOptions: ImagePickerOptions = {
    mediaTypes: MediaTypeOptions.Images,
    selectionLimit: 1,
    allowsEditing: true,
    quality: 1
};

export enum ScanResultStatus {
    Success,
    Failure,
    Cancelled
}

export type ScanResult = {
    status: ScanResultStatus,
    receipt?: Receipt
}

// (Num of orders) (Item name) $ (Price)
const receiptLineRegex = /^(\d*)(.+?)\$?(\d+(\.\d{1,2})?)$/;

export const scanReceiptFromCamera = async () => {
    const [initSuccessful, imageResults] = await Promise.all([
        initTessAPI(),
        launchCameraAsync(pictureOptions)
    ]);

    const results = await handleImageResults(initSuccessful, imageResults);
    closeTessAPI();
    return results;
}

export const scanReceiptFromGallery = async () => {
    const [initSuccessful, imageResults] = await Promise.all([
        initTessAPI(),
        launchImageLibraryAsync(pictureOptions)
    ]);

    const results = await handleImageResults(initSuccessful, imageResults);
    closeTessAPI();
    return results;}

const handleImageResults = async (tessAPIInitialized: boolean, imageResults: ImagePickerResult): Promise<ScanResult> => {
    const lostData = await getPendingResultAsync();
    const results = lostData?.length ? lostData[0] as ImagePickerResult : imageResults;

    if (imageResults.canceled) {
        return { status: ScanResultStatus.Cancelled };
    }
    if (!tessAPIInitialized || !results.assets) {
        return { status: ScanResultStatus.Failure };
    }

    const uri = imageResults.assets[0].uri;
    const receiptString = await readImage(uri);

    if (receiptString === null) {
        return { status: ScanResultStatus.Failure };
    }

    return {
        status: ScanResultStatus.Success,
        receipt: parseReceipt(receiptString)
    };
}

const parseReceipt = (receiptString: string): Receipt => {
    const lines = receiptString.split("\n");

    let receiptItems: ReceiptItem[] = [];
    let tip = 0;
    let tax = 0;

    lines.forEach((line) => {
        const match = line.match(receiptLineRegex);
        if(match){
            const num = (match[1] === "") ? 1 : parseInt(match[1]);
            const name = match[2].trim();
            const price = parsePriceString(match[3]);

            // Have different actions for special receipt lines
            const nameFilterRegex = /^(sub total|subtotal|total|tax|tip)(\s.*)?$/
            let nameMatch = name.toLowerCase().match(nameFilterRegex);
            if(nameMatch){
                if(nameMatch[1] === 'tax') tax = price;
                else if(nameMatch[1] === 'tip') tip = price;
                return;
            }

            for (let i = 0; i < num; i++) {
                receiptItems.push({
                    name: name,
                    priceCents: price
                });
            }
        }
    });

    return {
        party: [],
        receipt: receiptItems,
        taxCents: tax,
        tipCents: tip,
        matches: []
    };
}
