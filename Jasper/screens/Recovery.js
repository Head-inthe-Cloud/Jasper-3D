import React from "react";
import {
	StyleSheet,
	Dimensions,
	View,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Theme } from "../constants";

const { width, height } = Dimensions.get("screen");

const Recovery = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<Text>Send a password recovery email</Text>
			<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
				<Input
					placeholder="Account Email"
					placeholderTextColor="#6314AB"
					iconContent={
						<Icon
							size={11}
							style={{ marginRight: 10 }}
							color={Theme.COLORS.ICON}
							name="search-zoom-in"
							family="ArgonExtra"
						/>
					}
				/>
			</Block>
			<Button onPress={() => navigation.navigate("Login")}>
				Recover Account
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
