import React, { useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { sendPasswordReset } from "../firebase";
import { Theme } from "../constants";

const { width, height } = Dimensions.get("screen");

const Recovery = ({ navigation }) => {
	const [email, setEmail] = useState("");

	const handleSendEmail = () => {
		if(email.includes("@")){
			sendPasswordReset(email);
			navigation.navigate("Login");
		} else {
			alert("Please fill in your email and password");
		}
	};
	return (
		<View style={styles.container}>
			<Text>Send a password recovery email</Text>
			<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
				<Input
					placeholder="Account Email"
					placeholderTextColor="#6314AB"
					iconContent={<Block />}
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>
			</Block>
			<Button onPress={() => handleSendEmail()}>
				Send Recovery Email
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		width: width - theme.SIZES.BASE * 4,
		height: theme.SIZES.BASE * 3,
		shadowRadius: 0,
		shadowOpacity: 0,
		borderRadius: 99,
	},
});

export default Recovery;
