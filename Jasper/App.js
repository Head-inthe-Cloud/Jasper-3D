import { useState, useEffect } from "react";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from 'expo-linking';

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

// Firebase
import { initializeApp } from 'firebase/app';
import Screens from "./Screens";
import Loading from "./screens/Loading";
import { Images, Theme } from "./constants";

const firebaseConfig = {
    apiKey: "AIzaSyDoO-15TP38J4Gzz4BlI3rFucgYkymFs04",
    authDomain: "uwjasper.firebaseapp.com",
    databaseURL: "https://uwjasper-default-rtdb.firebaseio.com",
    projectId: "uwjasper",
    storageBucket: "uwjasper.appspot.com",
    messagingSenderId: "393140379927",
    appId: "1:393140379927:web:09b62a59258415ffcad752",
    measurementId: "G-VQBW4GV8Z1"
};
const app = initializeApp(firebaseConfig);

const prefix = Linking.createURL('/');

function App(props) {
	const linking = {prefixes: [prefix]}
	return (
		<NavigationContainer linking={linking}>
			<GalioProvider theme={Theme}>
				<Block flex>
					<Screens />
				</Block>
			</GalioProvider>
		</NavigationContainer>
	);
}

export default App;
