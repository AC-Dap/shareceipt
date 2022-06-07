package com.acdap.shareceipt;

import android.content.Context;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.googlecode.tesseract.android.TessBaseAPI;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class TesseractOcrModule extends ReactContextBaseJavaModule {

    private TessBaseAPI tess = null;

    TesseractOcrModule(ReactApplicationContext context){
        super(context);
    }

    @ReactMethod
    public void init(Promise response){
        Log.d("TesseractOCR", "Initializing TesseractAPI");
        tess = new TessBaseAPI();
        Context context = getReactApplicationContext();

        // Directory where the trained datafile should be stored, creating it if its missing
        File tesseractDir = new File(context.getCodeCacheDir(), "tessdata");
        tesseractDir.mkdir();

        // The trained data file
        File tesseractData = new File(tesseractDir, "eng.traineddata");

        // Copy over the data file from assets to cache if needed
        if(!tesseractData.exists()){
            Log.d("TesseractOCR", "The traineddata file was not found, copying it over to " + tesseractData.getAbsolutePath());
            try{
                InputStream is = context.getAssets().open("tessdata/eng.traineddata");
                OutputStream os = new FileOutputStream(tesseractData);
                byte[] buff=new byte[1024];
                int len;
                while((len=is.read(buff))>0){
                    os.write(buff,0,len);
                }
                is.close();
                os.close();
            } catch (IOException e) {
                Log.e("TesseractOCR", "Error copying traineddata file!", e);
                response.resolve(false);
                return;
            }
            Log.d("TesseractOCR", "Traineddata file copied successfully");
        }

        boolean success = tess.init(context.getCodeCacheDir().getAbsolutePath(), "eng");
        if(!success){
            response.resolve(false);
            Log.w("TesseractOCR", "Error initializing TesseractAPI");
        }else{
            tess.setPageSegMode(TessBaseAPI.PageSegMode.PSM_SINGLE_BLOCK);
            response.resolve(true);
            Log.d("TesseractOCR", "TesseractAPI initialized successfully");
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "TesseractOCR";
    }

    @ReactMethod
    public void recognizeTextFromURI(String uri, Promise response){
        if(tess == null){
            response.reject("TesseractOCR was not initialized", "");
            Log.w("TesseractOCR", "TesseractAPI called before it was initialized");
            return;
        }

        File img = new File(Uri.parse(uri).getPath());
        try {
            Log.d("TesseractOCR", "Trying to read from " + img.getAbsolutePath());
            tess.setImage(img);
            String text = tess.getUTF8Text();
            Log.d("TesseractOCR", "Text read successfully");
            response.resolve(text);
        } catch (Exception e) {
            e.printStackTrace();
            response.reject("Error loading image to TesseractOCR", e);
            Log.e("TesseractOCR", "Error loading image to TesseractAPI", e);
        }
    }
}
