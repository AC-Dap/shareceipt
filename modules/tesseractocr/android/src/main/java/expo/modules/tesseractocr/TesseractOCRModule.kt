package expo.modules.tesseractocr

import android.content.Context
import android.net.Uri
import android.util.Log
import android.graphics.BitmapFactory

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.googlecode.tesseract.android.TessBaseAPI

import java.io.IOException
import java.io.FileOutputStream
import java.io.OutputStream
import java.io.InputStream
import java.io.File


class TesseractOCRModule : Module() {

    // Our instance of the TessAPI
    // This is initialized via a call to initTessAPI()
    private var tessAPI: TessBaseAPI = TessBaseAPI();

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('TesseractOCR')` in JavaScript.
        Name("TesseractOCR")

        AsyncFunction("initTessAPI") {
            val success = initTessAPI()
            return@AsyncFunction success
        }

        Function("closeTessAPI") {
            tessAPI.recycle()
        }

        AsyncFunction("readImage") { uri: Uri ->
            val text = readImage(uri)
            return@AsyncFunction text
        }
    }

    fun initTessAPI(): Boolean {
        Log.d("TesseractOCR", "Initializing TesseractAPI")
        // Close previous tessAPI if it exists
        tessAPI.recycle()
        tessAPI = TessBaseAPI()
        val context: Context = appContext?.reactContext ?: return false

        // Directory where the trained datafile should be stored, creating it if its missing
        val codeCacheDir = context.getCodeCacheDir().getAbsolutePath()
        val tesseractDir = File(codeCacheDir, "tessdata")
        if (!tesseractDir.isDirectory()) {
            tesseractDir.mkdir()
        }

        // The trained data file
        val tesseractData = File(tesseractDir, "eng.traineddata")

        // Copy over the data file from assets to cache if needed
        if (!tesseractData.isFile()) {
            Log.d("TesseractOCR", "The traineddata file was not found, copying it over to " + tesseractData.getAbsolutePath())
            try {
                val ist = context.getAssets().open("tessdata/eng.traineddata")
                val ost = FileOutputStream(tesseractData)

                ist.use { input ->
                    ost.use { output ->
                        input.copyTo(output)
                    }
                }
            } catch (e: IOException) {
                Log.e("TesseractOCR", "Error copying traineddata file!", e)
                return false
            }
            Log.d("TesseractOCR", "Traineddata file copied successfully")
        }

        // Now we can initialize the TesseractAPI
        val success = tessAPI.init(codeCacheDir, "eng")
        if (!success) {
            Log.w("TesseractOCR", "Error initializing TesseractAPI")
            return false
        } else {
            tessAPI.setPageSegMode(TessBaseAPI.PageSegMode.PSM_SINGLE_BLOCK)
            Log.d("TesseractOCR", "TesseractAPI initialized successfully")
            return true
        }
    }

    fun readImage(uri: Uri): String? {
        Log.d("TesseractOCR", "Reading image from " + uri.toString())

        val context: Context = appContext?.reactContext ?: return null
        val inputStream: InputStream = context.getContentResolver().openInputStream(uri) ?: return null
        val bitmap = BitmapFactory.decodeStream(inputStream)

        tessAPI.setImage(bitmap)
        val text = tessAPI.getUTF8Text()

        Log.d("TesseractOCR", "Read text: " + text)
        return text
    }
}
