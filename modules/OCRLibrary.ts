
import {NativeModules} from "react-native";
const { TesseractOCR } = NativeModules;

interface OCRLibraryInterface {
    init: () => Promise<boolean>
    recognizeTextFromURI: (uri: string) => Promise<string>
}

const OCRLibrary = TesseractOCR as OCRLibraryInterface;
export default OCRLibrary;