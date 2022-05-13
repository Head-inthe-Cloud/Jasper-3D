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

const { width, height } = Dimensions.get("screen");

// const provider = new GoogleAuthProvider();
const auth = getAuth();

const SignUp = ({ navigation }) => {
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");

	const initializeUserData = (userId) => {
		const db = getDatabase();
		const userRef = dbRef(db, "users/" + userId);
		const newUserData = {
			avatar: "https://cdn.vectorstock.com/i/1000x1000/32/12/default-avatar-profile-icon-vector-39013212.webp",
			email: email,
			intro: "Hi, I am a new user",
			location: "Seattle",
			PaymentOptions: {default: "default"},
			postedItems: ["default"],
			savedItems: ["default"],
			rating: 5,
			userId: userId,
			userName: userName,
			uw: email.includes("uw"),
		};
		firebaseSet(userRef, newUserData);
	};

	const checkCompletion = () => {
		return (
			email && password && userName && password2 && password === password2
		);
	};

	const handleSignUp = () => {
		if (!checkCompletion()) {
			return;
		}
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				if (userCredential.user) {
					const userId = userCredential.user.uid;
					initializeUserData(userId);
					navigation.navigate("App", { userId: userId });
				}
			})
			.catch((error) => console.warn(error.message));
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
		marginTop: 50,
		marginBottom: 400
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
