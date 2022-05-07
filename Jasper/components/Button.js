import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "galio-framework";
import Theme from "../constants/Theme";

function ArButton(props) {

  const colorStyle = props.color && Theme.COLORS[props.color.toUpperCase()];

	const buttonStyles = [
		props.small && styles.smallButton,
		props.color && { backgroundColor: colorStyle },
		!props.shadowless && styles.shadow,
		{ ...props.style },
	];

	return (
		<Button
			style={buttonStyles}
			shadowless
			textStyle={{ fontSize: 12, fontWeight: "700" }}
			{...props}
		>
			{props.children}
		</Button>
	);
}

const styles = StyleSheet.create({
	smallButton: {
		width: 75,
		height: 28,
	},
	shadow: {
		shadowColor: "black",
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 4,
		shadowOpacity: 0.1,
		elevation: 2,
	},
});

export default ArButton;
