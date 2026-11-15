plugins {
    id("com.android.application")
}

android {
    namespace = "se.jonsolberg.plektrum"
    compileSdk = 35

    defaultConfig {
        applicationId = "se.jonsolberg.plektrum"
        minSdk = 26
        targetSdk = 35
        versionCode = 31
        versionName = "1.30"
    }

    // Release signing: the keystore comes from GitHub secrets (see .github/workflows/build.yml).
    // Without them the release build is left unsigned and the workflow falls back to the debug APK.
    val ksFile = System.getenv("PLEKTRUM_KEYSTORE")
    signingConfigs {
        if (ksFile != null && file(ksFile).exists()) {
            create("release") {
                storeFile = file(ksFile)
                storePassword = System.getenv("PLEKTRUM_KEYSTORE_PASSWORD")
                keyAlias = System.getenv("PLEKTRUM_KEY_ALIAS")
                keyPassword = System.getenv("PLEKTRUM_KEY_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfigs.findByName("release")?.let { signingConfig = it }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
