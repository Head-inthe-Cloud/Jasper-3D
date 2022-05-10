import React from "react";
import { withNavigation } from "@react-navigation/compat";
import {
	StyleSheet,
	Dimensions,
	Image,
	TouchableWithoutFeedback,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Theme } from "../constants";
import { Button } from ".";

function Card(props) {
	const navigation = props.navigation;
	const item = props.item;
	const horizontal = props.horizontal;
	const full = props.full;
	const style = props.style;
	const priceColor = props.priceColor;
	const imageStyle = props.imageStyle;

	const imageStyles = [
		full ? styles.fullImage : styles.horizontalImage,
		imageStyle,
	];
	const cardContainer = [styles.card, style];
	const imgContainer = [
		styles.imageContainer,
		horizontal ? styles.horizontalStyles : styles.verticalStyles,
		styles.shadow,
	];

	const handleUnlike = () => {
		console.warn("Unlike");
	};

	
	const UnlikeButton = () => {
		return (
			<Button
				onPress={() => handleUnlike()}
				onlyIcon
				color={theme.COLORS.WHITE}
				icon="heart"
				iconFamily="AntDesign"
				iconSize={25}
				iconColor={Theme.COLORS.ERROR}
				radius={100}
				style={styles.unlikeButton}
			/>
		);
	};
	return (
		<Block row={horizontal} card flex style={cardContainer}>
			<TouchableWithoutFeedback
				onPress={() => navigation.navigate("Detail", {itemId: item.itemId})}
			>
				<Block flex style={imgContainer}>
					<Image
						source={{ uri: item.images[0] }}
						style={imageStyles}
					/>
				</Block>
			</TouchableWithoutFeedback>
			<TouchableWithoutFeedback
				onPress={() => navigation.navigate("Detail",  {itemId: item.itemId})}
			>
				<Block flex style={styles.cardDescription}>
					<Text size={14} style={styles.cardTitle}>
						{item.title}
					</Text>
					<Text
						size={14}
						muted={!priceColor}
						color={priceColor || Theme.COLORS.SECONDARY}
						bold
					>
						{"$" + parseInt(item.price).toFixed(2)}
					</Text>
					{horizontal && UnlikeButton()}
				</Block>
			</TouchableWithoutFeedback>
		</Block>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: theme.COLORS.WHITE,
		marginVertical: theme.SIZES.BASE,
		borderWidth: 0,
		minHeight: 114,
		marginBottom: 16,
	},
	cardTitle: {
		flex: 1,
		flexWrap: "wrap",
		paddingBottom: 6,
	},
	cardDescription: {
		padding: theme.SIZES.BASE / 2,
	},
	imageContainer: {
		borderRadius: 3,
		elevation: 1,
		overflow: "hidden",
	},
	image: {
		// borderRadius: 3,
	},
	horizontalImage: {
		height: 134,
		width: "auto",
	},
	horizontalStyles: {
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
	},
	verticalStyles: {
		borderRadius: 30,
	},
	fullImage: {
		height: 215,
	},
	shadow: {
		shadowColor: theme.COLORS.BLACK,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.1,
		elevation: 2,
	},
	unlikeButton: {
		position: "absolute",
		top: 70,
		left: 130,
	},
});

export default withNavigation(Card);
