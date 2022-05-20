import { Block, Text } from "galio-framework";
import { StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import AnimatedLoader from "react-native-animated-loader";
import { Theme } from "../constants";

export default function Loading() {
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		setInterval(() => {
			setVisible(!visible);
		}, 2000);
	}, []);
	return (
		// <Block flex middle>
		//     <Text size={30}>
		//         Loading ...
		//     </Text>
		// </Block>
		<AnimatedLoader
            source={require("../assets/97111-loading-spinner-dots.json")}
			visible={visible}
			overlayColor={Theme.COLORS.WHITE}
			animationStyle={styles.lottie}
			speed={1}
		>
			<Text size={30}>Loading ...</Text>
		</AnimatedLoader>
	);
}
const styles = StyleSheet.create({
	lottie: {
		width: 100,
		height: 100,
	},
});
