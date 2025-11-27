This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# การ Patch Package Third-Party Library
ในกรณีที่เราใช้ Third-Party Library ที่มีบั๊ก หรือต้องการแก้ไขโค้ดภายใน Library นั้น ๆ เราสามารถใช้เครื่องมือที่ชื่อว่า `patch-package` เพื่อทำการแก้ไขโค้ดเหล่านั้นได้ โดยไม่ต้องรอให้เจ้าของ Library แก้ไขและปล่อยเวอร์ชันใหม่ วิธีการใช้งาน `patch-package` มีดังนี้:
1. แก้ไขโค้ดใน Library ที่ต้องการ:
   ไปที่โฟลเดอร์ `node_modules` และแก้ไขไฟล์ที่ต้องการใน Library นั้น ๆ ตามที่ต้องการ
2. สร้างไฟล์แพตช์:
   หลังจากที่แก้ไขโค้ดเสร็จแล้ว ให้รันคำสั่งต่อไปนี้เพื่อสร้างไฟล์แพตช์:
   ```bash
   npx patch-package <package-name>
   ```
    โดยที่ `<package-name>` คือชื่อของ Library ที่เราแก้ไข
3. ไฟล์ patchs จะถูก generate ออกมาในโฟลเดอร์ patches เช่น
   ```
   patches/
   └── rn-fetch-blob+0.12.0.patch
   ```
4. ใช้แพตช์เมื่อทำการติดตั้งแพ็กเกจ:
   เมื่อเราทำการติดตั้งแพ็กเกจใหม่หรือรันคำสั่ง `npm install` หรือ `yarn install` ไฟล์แพตช์จะถูกนำมาใช้โดยอัตโนมัติ จาก script ที่เราเพิ่มไว้ใน `package.json`:
   ```json
   "scripts": {
     "postinstall": "patch-package"
   }
   ```