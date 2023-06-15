# Xendit Payment for React Native

This repository provides a React Native implementation of Xendit payment integration, allowing you to easily process payments within your React Native applications. The integration is written in TypeScript, ensuring type safety and providing a seamless development experience.

## Features

- Integration with Xendit API for seamless payment processing
- Support for 3D Secure method
- Card tokenization for future use
- Optional authentication skip for a smoother payment flow
- No native components required
- Custom server integration for sending API requests
- Payment token sent as the default, but the implementation can be customized as needed

## Requirements

- React Native
- TypeScript
- Xendit account (Sign up at [https://www.xendit.co/](https://www.xendit.co/))
- [axios](https://github.com/axios/axios)
- [expo-checkbox](https://docs.expo.io/versions/latest/sdk/checkbox/)

## Install dependencies:

```
cd your-repo
npm install
```

### Step to Create The Repo

1. use npx create-expo-app -t expo-template-blank-typescript this will init the project in typescript
2. use npx expo install react-native-webview
3. add xendit-js-node with yarn add xendit-js-node
4. add checkbox from npx expo install expo-checkbox
5. add axios from yarn add axios

## Usage

### Start the development server:

```
npm start

```

### Run the application on a device or emulator:

```
npm run android  # For Android
npm run ios      # For iOS
```
