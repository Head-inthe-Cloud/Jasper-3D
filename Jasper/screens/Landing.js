import React from "react";
import {
	ImageBackground,
	Image,
	StyleSheet,
	StatusBar,
	Dimensions,
} from "react-native";
import { Block, Button, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");

import Theme from "../constants/Theme";
import Images from "../constants/Images";

const Landing = (props) => {
	const { navigation } = props;

	return (
		<Block flex style={styles.container}>
			<StatusBar hidden />
			<Block flex center>
				<ImageBackground
					source={Images.Onboarding}
					style={{ height, width, zIndex: 1 }}
				/>
			</Block>
			<Block center>
				<Image source={Images.LogoOnboarding} style={styles.logo} />
			</Block>
			<Block flex space="between" style={styles.padded}>
				<Block flex space="around" style={{ zIndex: 2 }}>
					<Block center>
						<Button
							style={styles.button}
							color={Theme.COLORS.PRIMARY}
							onPress={() => navigation.navigate("Login")}
							textStyle={{ color: Theme.COLORS.WHITE }}
						>
							Get Started
						</Button>
					</Block>
					{/* Temperary Buttons for Development, delete afterwards */}
					{/* <Text>The following buttons are for development only</Text>
					<Block center>
						<Button
							style={styles.button}
							color={Theme.COLORS.SECONDARY}
							onPress={() => navigation.navigate("Elements")}
							textStyle={{ color: Theme.COLORS.WHITE}}
						>
							Elements Page
						</Button>
					</Block>
					<Block center>
						<Button
							style={styles.button}
							color={Theme.COLORS.SECONDARY}
							onPress={() => navigation.navigate("Articles")}
							textStyle={{ color: Theme.COLORS.WHITE}}
						>
							Articles Page
						</Button>
					</Block>
					<Block center>
						<Button
							style={styles.button}
							color={Theme.COLORS.SECONDARY}
							onPress={() => navigation.navigate("Profile")}
							textStyle={{ color: Theme.COLORS.WHITE}}
						>
							Profile Page
						</Button>
					</Block> */}
				</Block>
			</Block>
		</Block>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.COLORS.BLACK,
	},
	padded: {
		paddingHorizontal: theme.SIZES.BASE * 2,
		position: "relative",
		bottom: theme.SIZES.BASE,
		zIndex: 2,
	},
	button: {
		width: width - theme.SIZES.BASE * 4,
		height: theme.SIZES.BASE * 3,
		shadowRadius: 0,
		shadowOpacity: 0,
		borderRadius: 99,
	},
	logo: {
		width: 345,
		height: 120,
		zIndex: 2,
		position: "relative",
		marginTop: "-50%",
	},
	title: {
		marginTop: "-5%",
	},
	subTitle: {
		marginTop: 20,
	},
});

export default Landing;
