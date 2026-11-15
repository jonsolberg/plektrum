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
        versionCode = 9
        versionName = "1.8"
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
