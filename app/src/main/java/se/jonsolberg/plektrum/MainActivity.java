/*
 * Plektrum – a toolbox for guitarists.
 * Copyright (C) 2026 Jon Solberg
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details. You should have received a copy of it along with this
 * program. If not, see <https://www.gnu.org/licenses/>.
 */
package se.jonsolberg.plektrum;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;
import android.print.PdfWriter;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

/**
 * Hosts the bundled, fully offline Plektrum page (assets/index.html) in a WebView.
 * The app has no INTERNET permission. The microphone is only opened by the tuner, and only
 * after the user has allowed it.
 */
public class MainActivity extends Activity {

    private static final int REQ_MIC = 1;
    private WebView web;
    private PermissionRequest pendingMic;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        web.setBackgroundColor(getColor(R.color.bg));
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);                   // favourites, progressions, settings (localStorage)
        s.setAllowContentAccess(false);
        s.setMediaPlaybackRequiresUserGesture(false);   // chord playback and metronome (Web Audio)
        s.setBlockNetworkLoads(true);                   // belt and braces: never touch the network
        s.setTextZoom(100);
        s.setSupportZoom(false);                        // no pinch zoom
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);   // no stretch/glow at the ends – feels native
        web.setVerticalScrollBarEnabled(false);          // no scroll bars
        web.setHorizontalScrollBarEnabled(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if ("file".equals(u.getScheme())) return false;   // only the bundled page loads inside
                openExternal(u);
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(() -> handleMicRequest(request));
            }
        });
        web.addJavascriptInterface(new Bridge(), "Android");

        if (savedInstanceState != null) {
            web.restoreState(savedInstanceState);
        } else {
            web.loadUrl("file:///android_asset/index.html");
        }
    }

    /** The page asks for the microphone (tuner): grant it once Android permission is in place. */
    private void handleMicRequest(PermissionRequest request) {
        boolean wantsMic = false;
        for (String r : request.getResources()) {
            if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r)) wantsMic = true;
        }
        if (!wantsMic) {
            request.deny();
            return;
        }
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
            request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
        } else {
            if (pendingMic != null) pendingMic.deny();
            pendingMic = request;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != REQ_MIC || pendingMic == null) return;
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            pendingMic.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
        } else {
            pendingMic.deny();
            Toast.makeText(this, R.string.mic_needed, Toast.LENGTH_LONG).show();
        }
        pendingMic = null;
    }

    private void openExternal(Uri u) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, u));
        } catch (ActivityNotFoundException ignored) {
            // no browser installed – nothing to do
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();   // closes an open panel
        else super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();
        // let go of the microphone as soon as the app leaves the screen
        web.evaluateJavascript("window.onAppPause&&onAppPause()", null);
    }

    private boolean systemDark() {
        return (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK)
                == Configuration.UI_MODE_NIGHT_YES;
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        boolean dark = (newConfig.uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
        web.evaluateJavascript("window.onSystemTheme&&onSystemTheme(" + dark + ")", null);
    }

    @Override
    protected void onDestroy() {
        web.destroy();
        super.onDestroy();
    }

    private void applyBars(boolean dark) {
        int color = getColor(dark ? R.color.bg_dark : R.color.bg_light);
        getWindow().setStatusBarColor(color);
        getWindow().setNavigationBarColor(color);
        web.setBackgroundColor(color);
        WindowInsetsController c = getWindow().getInsetsController();
        if (c != null) {
            int mask = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                    | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
            c.setSystemBarsAppearance(dark ? 0 : mask, mask);
        } else {
            View d = getWindow().getDecorView();
            int f = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            d.setSystemUiVisibility(dark ? (d.getSystemUiVisibility() & ~f) : (d.getSystemUiVisibility() | f));
        }
    }

    /** Called from JavaScript as window.Android.* */
    /** Kept alive until the next print job – the print framework reads from it while the dialog is open. */
    private WebView printView;

    private static PrintAttributes a4() {
        return new PrintAttributes.Builder()
                .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                .setResolution(new PrintAttributes.Resolution("pdf", "pdf", 600, 600))
                .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                .build();
    }

    /** A fresh, invisible WebView attached behind the app (a detached one may never finish its layout). */
    private WebView newPrintView() {
        if (printView != null) {
            ViewGroup parent = (ViewGroup) printView.getParent();
            if (parent != null) parent.removeView(printView);
            printView.destroy();
        }
        WebView pv = new WebView(this);
        pv.setVisibility(View.INVISIBLE);
        pv.getSettings().setJavaScriptEnabled(false);
        addContentView(pv, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        web.bringToFront();
        printView = pv;
        return pv;
    }

    private void toast(String msg) {
        if (msg != null && !msg.isEmpty()) Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
    }

    /**
     * Render the HTML off screen and write it as a PDF to Downloads, then open it.
     * Falls back to the system print screen if that is not possible on this device.
     */
    private void savePdf(String title, String fileName, String html, String busy, String done, String failed) {
        toast(busy);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) { printDocument(title, html); return; }
        WebView pv = newPrintView();
        pv.setWebViewClient(new WebViewClient() {
            private boolean started;
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return true;
            }
            @Override
            public void onPageFinished(WebView view, String url) {
                if (started) return;
                started = true;
                // give the layout a moment to settle before printing
                view.postDelayed(() -> writePdf(view, title, fileName, html, done, failed), 400);
            }
        });
        pv.loadDataWithBaseURL("file:///android_asset/", html, "text/html", "utf-8", null);
    }

    private void writePdf(WebView view, String title, String fileName, String html, String done, String failed) {
        final ContentResolver cr = getContentResolver();
        Uri uri = null;
        try {
            ContentValues v = new ContentValues();
            v.put(MediaStore.MediaColumns.DISPLAY_NAME, fileName);
            v.put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf");
            v.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
            v.put(MediaStore.MediaColumns.IS_PENDING, 1);
            uri = cr.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
            if (uri == null) throw new IllegalStateException("no Downloads folder");
            final Uri target = uri;
            final ParcelFileDescriptor pfd = cr.openFileDescriptor(target, "w");
            if (pfd == null) throw new IllegalStateException("cannot open file");
            PrintDocumentAdapter adapter = view.createPrintDocumentAdapter(title);
            PdfWriter.write(adapter, a4(), pfd, new PdfWriter.Result() {
                @Override
                public void done() {
                    runOnUiThread(() -> {
                        try { pfd.close(); } catch (Exception ignored) { }
                        ContentValues fin = new ContentValues();
                        fin.put(MediaStore.MediaColumns.IS_PENDING, 0);
                        cr.update(target, fin, null, null);
                        toast(done);
                        Intent open = new Intent(Intent.ACTION_VIEW)
                                .setDataAndType(target, "application/pdf")
                                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                        try { startActivity(Intent.createChooser(open, title)); } catch (Exception ignored) { /* no PDF viewer: the file is in Downloads */ }
                    });
                }
                @Override
                public void failed(String why) {
                    runOnUiThread(() -> {
                        try { pfd.close(); } catch (Exception ignored) { }
                        try { cr.delete(target, null, null); } catch (Exception ignored) { }
                        toast(failed + " (" + why + ")");
                        printDocument(title, html);
                    });
                }
            });
        } catch (Throwable t) {
            if (uri != null) { try { cr.delete(uri, null, null); } catch (Exception ignored) { } }
            toast(failed + " (" + t.getClass().getSimpleName() + ")");
            printDocument(title, html);
        }
    }

    private void printDocument(String title, String html) {
        WebView pv = newPrintView();
        pv.setWebViewClient(new WebViewClient() {
            private boolean started;
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return true;
            }
            @Override
            public void onPageFinished(WebView view, String url) {
                if (started) return;
                started = true;
                try {
                    PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                    if (pm == null) { toast("Printing is not available on this device"); return; }
                    pm.print(title, view.createPrintDocumentAdapter(title), a4());
                } catch (Throwable t) {
                    toast("Printing failed: " + t.getMessage());
                }
            }
        });
        pv.loadDataWithBaseURL("file:///android_asset/", html, "text/html", "utf-8", null);
    }

    private class Bridge {
        @JavascriptInterface
        public void keepAwake(boolean on) {
            runOnUiThread(() -> {
                if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            });
        }

        @JavascriptInterface
        public boolean isSystemDark() {
            return systemDark();
        }

        @JavascriptInterface
        public void setDark(boolean dark) {
            runOnUiThread(() -> applyBars(dark));
        }

        /** Save an HTML document as an A4 PDF in Downloads and open it. */
        @JavascriptInterface
        public void savePdf(String title, String fileName, String html, String busy, String done, String failed) {
            if (html == null) return;
            runOnUiThread(() -> MainActivity.this.savePdf(title == null ? "Plektrum" : title,
                    fileName == null ? "Plektrum.pdf" : fileName, html, busy, done, failed));
        }

        /** Print an HTML document (A4) – Android's print screen also offers "Save as PDF". */
        @JavascriptInterface
        public void printHtml(String title, String html) {
            if (html == null) return;
            runOnUiThread(() -> printDocument(title == null ? "Plektrum" : title, html));
        }

        @JavascriptInterface
        public void openUrl(String url) {
            if (url != null && url.startsWith("https://")) runOnUiThread(() -> openExternal(Uri.parse(url)));
        }
    }
}
