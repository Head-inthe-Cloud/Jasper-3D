import { useState } from "react";
import { StyleSheet, Image, Dimensions, View, ScrollView } from "react-native";
import { Block, Text, theme } from "galio-framework";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { Button, Icon, Input } from "../components";
import { Theme } from "../constants";
import {
	getDatabase,
	ref as dbRef,
	set as firebaseSet,
} from "firebase/database";

import { auth, logout, registerWithEmailAndPassword } from "../firebase";
import { onAuthStateChanged } from "@firebase/auth";

const { width, height } = Dimensions.get("screen");

// const provider = new GoogleAuthProvider();

const SignUp = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");

	const checkCompletion = () => {
		if(!email || !password || !password2 || !userName){
			alert("Information incomplete");
			return false;
		} else if(password !== password2) {
			alert("Confirm password must be the same as the password");
			return false;
		}
		else {
			return true;
		}
	};

	const handleSignUp = () => {
		if (checkCompletion()) {
		registerWithEmailAndPassword(userName, email, password);
		navigation.navigate("App");
		}
	};
	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.container}>
				<Image
					source={require("../assets/imgs/signUp.png")}
					style={{ width: width, height: 320 }}
				/>
				<Text style={styles.textHeader}>Create an Account</Text>
				<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
					<Input
						type="email-address"
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
						value={email}
						onChangeText={(text) => setEmail(text)}
					/>
				</Block>
				<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
					<Input
						placeholder="User Name"
						placeholderTextColor="#6314AB"
						iconContent={
							<Icon
								size={11}
								style={{ marginRight: 10 }}
								color={Theme.COLORS.ICON}
								name="person"
								family="MaterialIcon"
							/>
						}
						style={{ width: 300 }}
						value={userName}
						onChangeText={(text) => setUserName(text)}
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
						value={password}
						onChangeText={(text) => setPassword(text)}
					/>
				</Block>
				<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
					<Input
						placeholder="Confirm Password"
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
						value={password2}
						onChangeText={(text) => setPassword2(text)}
					/>
				</Block>
				<View style={styles.registButton}>
					<Button
						style={{ width: 220 }}
						onPress={() => handleSignUp()}
					>
						Sign Up
					</Button>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 400,
	},
	button: {
		width: width - theme.SIZES.BASE * 4,
		height: theme.SIZES.BASE * 3,
		shadowRadius: 0,
		shadowOpacity: 0,
		borderRadius: 99,
	},
	textHeader: {
		fontWeight: "bold",
		fontSize: 30,
		paddingBottom: 30,
	},
	registButton: {
		paddingTop: 30,
	},
});

export default SignUp;
