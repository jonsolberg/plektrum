/*
 * Plektrum – write a WebView's print output straight to a PDF file, without the print screen.
 * Copyright (C) 2026 Jon Solberg — GNU GPL v3 or later.
 *
 * Lives in android.print because the layout/write callbacks only have package-private
 * constructors. If this ever stops working on a device, the caller falls back to the
 * normal print screen (which also offers "Save as PDF").
 */
package android.print;

import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;

public final class PdfWriter {
    public interface Result {
        void done();
        void failed(String why);
    }

    private PdfWriter() { }

    public static void write(final PrintDocumentAdapter adapter, final PrintAttributes attrs,
                             final ParcelFileDescriptor out, final Result result) {
        adapter.onStart();
        adapter.onLayout(null, attrs, new CancellationSignal(), new PrintDocumentAdapter.LayoutResultCallback() {
            @Override
            public void onLayoutFinished(PrintDocumentInfo info, boolean changed) {
                adapter.onWrite(new PageRange[]{PageRange.ALL_PAGES}, out, new CancellationSignal(),
                        new PrintDocumentAdapter.WriteResultCallback() {
                            @Override
                            public void onWriteFinished(PageRange[] pages) {
                                adapter.onFinish();
                                result.done();
                            }

                            @Override
                            public void onWriteFailed(CharSequence error) {
                                adapter.onFinish();
                                result.failed(error == null ? "write failed" : error.toString());
                            }

                            @Override
                            public void onWriteCancelled() {
                                adapter.onFinish();
                                result.failed("cancelled");
                            }
                        });
            }

            @Override
            public void onLayoutFailed(CharSequence error) {
                adapter.onFinish();
                result.failed(error == null ? "layout failed" : error.toString());
            }

            @Override
            public void onLayoutCancelled() {
                adapter.onFinish();
                result.failed("cancelled");
            }
        }, null);
    }
}
