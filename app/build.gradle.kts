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
        versionCode = 27
        versionName = "1.26"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
