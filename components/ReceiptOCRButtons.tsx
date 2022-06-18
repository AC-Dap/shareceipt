import {IconButton} from "react-native-paper";
import OCRLibrary from "../modules/OCRLibrary";
import {ImagePickerOptions, launchCameraAsync, launchImageLibraryAsync, MediaTypeOptions} from "expo-image-picker";
import {nanoid} from "nanoid";
import {ReceiptItemType} from "../screens/ShareceiptScreen";
import {useState} from "react";

type ReceiptOCRButtonsType = {
    partySize: number,
    showErrorMessage: (msg: string) => void,
    setTipPercent: (percent: number) => void,
    setTaxPercent: (percent: number) => void,
    setReceiptItems: (items: ReceiptItemType[]) => void
}

export default function ReceiptOCRButtons({ partySize, showErrorMessage, setTipPercent, setTaxPercent, setReceiptItems }: ReceiptOCRButtonsType) {
    const pictureOptions: ImagePickerOptions = {
        allowsMultipleSelection: false,
        allowsEditing: true,
        mediaTypes: MediaTypeOptions.Images,
        quality: 1
    };

    const [initializedApi, setInitializedApi] = useState(false);

    const tryInitApi = async () => {
        if(initializedApi) return true;

        const success = await OCRLibrary.init();
        if(!success){
            showErrorMessage("Error initializing OCR library");
        }
        setInitializedApi(success);
        return success;
    }

    const recognizeFromCamera = async () => {
        // Get image from camera
        const image = await launchCameraAsync(pictureOptions);
        if(image.cancelled) return;

        try{
            await parseImage(image.uri);
        }catch (e) {
            showErrorMessage(e.message);
        }
    };

    const recognizeFromGallery = async () => {
        // Get image from gallery
        const image = await launchImageLibraryAsync(pictureOptions);
        if(image.cancelled) return;

        try{
            await parseImage(image.uri);
        }catch (e) {
            showErrorMessage(e.message);
        }
    }

    // Parse a given image of a receipt and attempt to read the list of items from it
    const parseImage = async (imageUri: string) => {
        if(!(await tryInitApi())) throw new Error("OCR Library failed to initialize");

        const text = await OCRLibrary.recognizeTextFromURI(imageUri);

        // Parse each line found separately assuming it's formatted like the regex below
        const lines = text.split("\n");
        // (Num of orders) (Item name) $ (Price)
        const receiptLineRegex = /^(\d*)(.+?)\$?(\d+(.\d{2})?)$/;

        let newReceipt: ReceiptItemType[] = [];
        let tip = -1;
        let tax = -1;
        let total = 0;
        lines.forEach((line) => {
            const match = line.match(receiptLineRegex);
            if(match){
                const num = (match[1] == "") ? 1 : parseInt(match[1]);
                const name = match[2].trim();
                const price = parseFloat(match[3]);

                // Have different actions for special receipt lines
                const nameFilterRegex = /^(sub total|subtotal|total|tax|tip)[:-]*$/
                let nameMatch = name.toLowerCase().match(nameFilterRegex);
                if(nameMatch){
                    if(nameMatch[1] === 'tax') tax = price;
                    else if(nameMatch[1] === 'tip') tip = price;
                    return;
                }

                for (let i = 0; i < num; i++) {
                    newReceipt.push({
                        id: nanoid(),
                        name: name,
                        price: price,
                        peoplePaying: new Array(partySize).fill(false)
                    });
                }
                total += num * price;
            }
        });
        if(tip != -1) setTipPercent(tip / total * 100);
        if(tax != -1) setTaxPercent(tax / total * 100);
        setReceiptItems(newReceipt);
    }

    return <>
        <IconButton icon={"image"} onPress={recognizeFromGallery}/>
        <IconButton icon={"camera"} onPress={recognizeFromCamera}/>
    </>;
}