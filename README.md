# About this Project
This app is a real-time music sharing & location tracking app similar to Pokémon GO. The app is called SongTrax. And it has both web client and mobile application.
Below are the expected user experiences for the app:
<img width="1372" alt="image" src="https://github.com/user-attachments/assets/6ab82611-2b96-4ebc-9708-18661e2a89bf" />

## Technical Specification
Additionally, this mobile app also allows you to...
1. create your own profile with avtar and nickname
2. rate and play any songs currently at your location
3. see other users that are also at your location
4. real-time song and location tracking map
   
### For Web App - react.js
1. Created a React Web project using “create-react-app” and built a distributable bundle for deployment.
2. Built React Web components in a nested & modular fashion (across multiple files), enabling routing (via React Router) for multiple, linked pages.
3. Used JSX to combine HTML elements, React Web components & JavaScript logic together in an appropriate manner.
4. Used states & hooks in React Web to read & transform data, including reading & saving to the provided web API.
5. Used the Tone.js framework (and by extension, the Web Audio API behind the scenes) to generate layered sounds.

### For Mobile App - React Native
1. Created a React Native project and running it via the iOS simulator.
2. Built React Native components in a nested & modular fashion (across multiple files), enabling navigation/routing (via React Navigation) for multiple, linked screens.
3. Used JSX to combine React Native components & JavaScript logic together in an appropriate manner.
4. Used states & hooks in React Native to read & transform data, including reading, writing to and filtering data from a RESTFul API.
5. Integrated a native map with location markers and the user’s current location.
5. Integrated a controllable webview to play sounds via Tone.js in a webpage.
6. Integrated device APIs to get a photo from the device’s image picker.
