# EducaMais Mobile

Mobile client for the EducaMais platform (Expo / React Native).

## Requisitos
- Node.js (v18+ recommended)
- npm ou yarn
- Expo CLI (`npm i -g expo-cli`) opcional, mas útil

## Instalação

1. Instalar dependências

```bash
npm ci
# ou
npm install
```

2. Iniciar o Metro/Expo

```bash
npm run start
# Para Android
npm run android
# Para iOS
npm run ios
```

## Variáveis de ambiente
O app consome a API a partir da variável `EXPO_PUBLIC_API_URL`. Por padrão o código usa um IP local. Para apontar para sua API, exporte a variável antes de iniciar o Expo, por exemplo:

Windows (PowerShell):

```powershell
$env:EXPO_PUBLIC_API_URL = "http://192.168.0.100:3333"
npm run start
```

macOS / Linux:

```bash
export EXPO_PUBLIC_API_URL="http://192.168.0.100:3333"
npm run start
```

## Lint

```bash
npm run lint
```

## Observações
- O projeto é um cliente Expo; caso precise compilar para produção, siga a documentação do Expo.
- Backend não está incluído neste repositório. Se você tiver o backend local, assegure-se de que o `EXPO_PUBLIC_API_URL` aponte para ele.
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
