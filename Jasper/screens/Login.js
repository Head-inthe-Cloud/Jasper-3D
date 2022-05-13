import React, { useEffect, useState } from "react";
import { Dimensions, Text } from "react-native";
import { Block, theme } from "galio-framework";
import {
	getAuth,
	onAuthStateChanged,
	signInAnonymously,
	sendSignInLinkToEmail,
	signInWithEmailAndPassword,
} from "firebase/auth";

import { Icon, Input, Button } from "../components/";
import { Theme } from "../constants/";
import { StyleSheet, Image } from "react-native";
import { createURL } from "expo-linking";

const { width } = Dimensions.get("screen");

const Login = ({ navigation }) => {
	const [userId, setUserId] = useState("");
	const auth = getAuth();
	const email = "cyqpp@uw.edu";
	const password = "123456";

	// Ananymous Sign in
	// ****************************************************
	// const handleLogin = () => {
	// 	// navigation.navigate("App");
	// 	signInAnonymously(auth)
	// 		.then(() => {
	// 			console.warn("Signed In!");

	// 		})
	// 		.catch((error) => {
	// 			console.warn(error.message);
	// 		});
	// };
	// ****************************************************
	// Email Link Sign in

	// const actionCodeSettings = {
	// 	url: "exp://192.168.1.153:19000",
	// 	handleCodeInApp: true,
	// 	iOS: {
	// 		bundleId: "com.uwinfo.jasper",
	// 	},
	// 	dynamicLinkDomain: 'exp://192.168.1.153:19000'
	// };
	// const handleLogin = () => {
	// 	sendSignInLinkToEmail(auth, email, actionCodeSettings)
	// 		.then(() => {
	// 			window.localStorage.setItem("emailForSignIn", email);
	// 		})
	// 		.catch((error) => console.warn(error.message));
	// };
	// ****************************************************
	// Google Sign in
	// Web Client ID: 393140379927-13c591msicujfonqueupbp2h2plneb5r.apps.googleusercontent.com
	// Links:
	// https://docs.expo.dev/guides/authentication/#google
	// https://console.cloud.google.com/apis/credentials/domainverification?project=jasper-uw
	// https://docs.expo.dev/build/setup/
	// https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
	// ****************************************************
	// Email & Password Sign in
	const handleLogin = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.warn("Signed in as " + userCredential.user.uid);
				if(userCredential.user){
					navigation.navigate('App', {userId: userCredential.user,uid})
				}
			})
			.catch((error) => console.warn(error.message));
	};

	onAuthStateChanged(auth, (user) => {
		if (user) {
			setUserId(user.uid);
		} else {
			console.warn("User signed out");
		}
	});

	return (
		<Block style={styles.container}>
			<Image
				style={styles.logo}
				source={require("../assets/imgs/icon.png")}
			></Image>
			<Image
				source={require("../assets/imgs/login.png")}
				style={{ width: width, height: 320 }}
			></Image>
			<Text style={styles.textHeader}>Welcome Back!</Text>
			<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
				<Input
					placeholder="Email"
					placeholderTextColor="#6314AB"
					iconContent={
						<Icon
							size={11}
							style={{ marginRight: 10 }}
							color={Theme.COLORS.ICON}
							name="mail"
							family="Feather"
						/>
					}
					style={{ width: 300 }}
				/>
			</Block>
			<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
				<Input
					placeholder="Password"
					placeholderTextColor="#6314AB"
					secureTextEntry={true}
					iconContent={
						<Icon
							size={11}
							style={{ marginRight: 10 }}
							color={Theme.COLORS.ICON}
							name="login"
							family="Entypo"
						/>
					}
					style={{ width: 300 }}
				/>
			</Block>
			<Block style={styles.greyButtons}>
				<Text
					onPress={() => navigation.navigate("SignUp")}
					style={{ color: "grey", marginBottom: 10 }}
				>
					Create an Account
				</Text>
				<Text
					onPress={() => navigation.navigate("Recovery")}
					style={{ color: "grey" }}
				>
					Forgot password
				</Text>
			</Block>
			<Button
				onPress={() => handleLogin()}
				style={{
					width: width - theme.SIZES.BASE * 4,
					marginTop: 20,
					justifyContent: "center",
					alignItems: "center",
					borderRadius: 30,
				}}
				textStyle={{ fontSize: 15, fontWeight: "600" }}
			>
				Sign In
			</Button>
			<Block style={styles.greyBorder}></Block>
		</Block>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		width: 70,
		height: 70,
		position: "absolute",
		top: 50,
		left: 15,
	},
	textHeader: {
		fontWeight: "bold",
		fontSize: 30,
		paddingTop: 30,
		paddingBottom: 30,
	},
	signInButton: {
		paddingTop: 10,
	},
	greyButtons: {
		paddingTop: 15,
		alignItems: "center",
	},
});

export default Login;
