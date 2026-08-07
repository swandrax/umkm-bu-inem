package com.ibuinem.pos.barcode;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

import java.awt.image.BufferedImage;

public class BarcodeGenerator {

    /**
     * Generate Barcode Code 128 as BufferedImage
     */
    public static BufferedImage generateBarcode(String text, int width, int height) {
        try {
            BitMatrix bitMatrix = new MultiFormatWriter().encode(text, BarcodeFormat.CODE_128, width, height);
            return MatrixToImageWriter.toBufferedImage(bitMatrix);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Generate QR Code as BufferedImage
     */
    public static BufferedImage generateQRCode(String text, int width, int height) {
        try {
            BitMatrix bitMatrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, width, height);
            return MatrixToImageWriter.toBufferedImage(bitMatrix);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
