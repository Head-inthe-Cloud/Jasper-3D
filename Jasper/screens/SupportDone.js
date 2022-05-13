import React from "react";
import { Dimensions, Text } from "react-native";
import { Block, theme } from "galio-framework";
//import { ShoppingHome } from "../assets/imgs";

import { Button } from "../components/";
import { Theme } from "../constants/";
import { StyleSheet, Image } from "react-native";

const { width } = Dimensions.get("screen");

const SupportDone = ({ navigation }) => {
	return (
		<Block style={styles.container}>
			<Image
				style={styles.logo}
				source={require("../assets/imgs/icon.png")}
			></Image>
			<Image
				source={require("../assets/imgs/post-done.png")}
				style={{ width: 200, height: 320 }}
			></Image>
			<Block>
			<Text style={styles.title}>Thank you for contacting us!</Text>
			<Text style={styles.subtitle}>We have received your support request, we will reach back to you shortly.</Text>
			<Button
				onPress={() => navigation.navigate("Home")}
				style={{
					width: width - theme.SIZES.BASE * 4,
					marginTop: 20,
					justifyContent: "center",
					alignItems: "center",
					borderRadius: 30,
				}}
				textStyle={{ fontSize: 15, fontWeight: "600" }}
			>
				Back to Home
			</Button></Block>
		</Block>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: theme.SIZES.BASE * 2
	},
	logo: {
		width: 70,
		height: 70,
		position: "absolute",
		top: 50,
		left: 15,
	},
	title: {
		fontWeight: "bold",
		fontSize: 25,
		paddingTop: 30,
		paddingBottom: 30,
	},
	subtitle: {
		fontSize: 15,
		paddingBottom: 30,
		color: Theme.COLORS.GRAY,
	},
	signInButton: {
		paddingTop: 10,
	},
	greyButtons: {
		paddingTop: 15,
		alignItems: "center",
	},
});

export default SupportDone;
