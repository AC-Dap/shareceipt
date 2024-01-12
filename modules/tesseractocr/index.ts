// Import the native module. It will be resolved to TesseractOCR.ts
import TesseractOCRModule from './src/TesseractOCRModule';

export async function initTessAPI(): Promise<boolean> {
    return await TesseractOCRModule.initTessAPI();
}

export function closeTessAPI() {
    return TesseractOCRModule.closeTessAPI();
}

export async function readImage(uri: string): Promise<string | null> {
    return await TesseractOCRModule.readImage(uri);
}