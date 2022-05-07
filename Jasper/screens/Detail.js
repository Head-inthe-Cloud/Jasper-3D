import React from "react";
//galio
import { Block, Text, theme } from "galio-framework";
import {
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native";
//argon
import { Theme } from "../constants/";
import { items, users } from "../constants/mockData";

import { Button, Card, Icon } from "../components/";

// Libraries
import StarRating from "react-native-star-rating";

const { width } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

class Detail extends React.Component {
	renderImage = (imgUri) => {
		const { navigation } = this.props;

		return (
			<TouchableWithoutFeedback
				style={{ zIndex: 3 }}
				key={`product-${imgUri}`}
				// onPress={() => navigation.navigate("Pro", { product: item })}
			>
				<Block center style={styles.productItem}>
					<Image
						resizeMode="cover"
						style={styles.productImage}
						source={{ uri: imgUri }}
					/>
				</Block>
			</TouchableWithoutFeedback>
		);
	};

	renderImageCarousel = (item) => {
		return (
			<ScrollView
				horizontal={true}
				pagingEnabled={true}
				decelerationRate={0}
				scrollEventThrottle={16}
				snapToAlignment="center"
				showsHorizontalScrollIndicator={false}
				snapToInterval={cardWidth + theme.SIZES.BASE * 0.375}
				contentContainerStyle={{
					paddingHorizontal: theme.SIZES.BASE / 2,
				}}
			>
				{items && item.images.map((image) => this.renderImage(image))}
			</ScrollView>
		);
	};

	renderCard = (item) => {
		return (
			<Card
				item={item}
				style={styles.similarItems}
				key={"similar" + item.itemId}
			/>
		);
	};

	render() {
		const item = items.i00001;
		const similarItems = Object.keys(items).map((key) => items[key]);
		const sellerData = users[item.sellerId];
		return (
			<Block flex center>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Block flex style={styles.group}>
						<Block flex style={{ marginTop: theme.SIZES.BASE / 2 }}>
							<Block
								flex
								row
								style={{
									paddingHorizontal: theme.SIZES.BASE,
									paddingBottom: theme.SIZES.BASE,
								}}
							>
								<Block width={(width / 7) * 4}>
									<Text
										size={16}
										color={Theme.COLORS.PRIMARY}
										style={styles.productPrice}
									>
										{item.condition}
									</Text>
									<Text
										size={34}
										style={{ paddingHorizontal: 1 }}
									>
										{item.title}
									</Text>
								</Block>
								<Block>
									<Block flex row style={{ top: 15 }}>
										<Image
											source={{
												uri: sellerData.avatar,
											}}
											style={styles.avatar}
										/>
										<Block>
											<Text
												size={14}
												style={styles.userName}
											>
												{sellerData.userName}
											</Text>
											<StarRating
												disabled
												rating={sellerData.rating}
												starSize={18}
												starStyle={styles.stars}
												fullStarColor={"#FDCC0D"}
											/>
										</Block>
									</Block>
									<Block>
										<Text
											size={24}
											style={styles.productPrice}
										>
											{"$" + item.price.toFixed(2)}
										</Text>
									</Block>
								</Block>
							</Block>
							{this.renderImageCarousel(item)}
							<Block style={styles.descriptionBox}>
								<Text
									size={18}
									color={theme.COLORS.BLACK}
									style={styles.title}
								>
									Description:
								</Text>
								<Block>
									<Text
										size={16}
										color={theme.COLORS.BLACK}
										style={styles.productDescription}
									>
										{item.description}
									</Text>
								</Block>
								<Block
									flex
									row
									style={{
										marginVertical: theme.SIZES.BASE,
										left: theme.SIZES.BASE,
									}}
								>
									<Icon
										name="location-pin"
										family="MaterialIcons"
										size={25}
										color={Theme.COLORS.HEADER}
									></Icon>
									<Text
										size={18}
										style={{
											fontWeight: "bold",
											color: Theme.COLORS.HEADER,
										}}
									>
										{" Pick Up: "}
									</Text>
									<Text
										size={18}
										style={{
											color: Theme.COLORS.HEADER,
										}}
									>
										{item.pickUpLocation}
									</Text>
								</Block>
								<Block
									flex
									row
									style={{
										left: theme.SIZES.BASE,
									}}
								>
									<Icon
										name="truck"
										family="Feather"
										size={25}
										color={Theme.COLORS.HEADER}
									></Icon>
									<Text
										size={18}
										style={{
											fontWeight: "bold",
											color: Theme.COLORS.HEADER,
										}}
									>
										{" Drop off: "}
									</Text>
									<Text
										size={18}
										style={{
											color: Theme.COLORS.HEADER,
										}}
									>
										{item.dropOff ? "Yes" : "No"}
									</Text>
								</Block>
							</Block>
							<Block
								center
								style={{
									marginVertical: theme.SIZES.BASE,
									bottom: theme.SIZES.BASE,
								}}
							>
								<Button
									style={styles.button}
									textStyle={{ fontSize: 20 }}
								>
									{"Chat with " + sellerData.userName}
								</Button>
							</Block>
							<Block style={styles.descriptionBox}>
								<Text
									size={18}
									color={theme.COLORS.BLACK}
									style={styles.title}
								>
									Similar Items:
								</Text>
							</Block>
							<ScrollView
								horizontal={true}
								pagingEnabled={true}
								decelerationRate={0}
								scrollEventThrottle={16}
								snapToAlignment="center"
								showsHorizontalScrollIndicator={false}
								snapToInterval={
									cardWidth + theme.SIZES.BASE * 0.375
								}
								contentContainerStyle={{
									paddingHorizontal: theme.SIZES.BASE / 2,
								}}
								style={{
									backgroundColor: theme.COLORS.WHITE,
									marginBottom: theme.SIZES.BASE * 2,
								}}
							>
								{similarItems &&
									similarItems.map((similarItem) =>
										this.renderCard(similarItem)
									)}
							</ScrollView>
						</Block>
					</Block>
				</ScrollView>
			</Block>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		fontWeight: "bold",
		paddingTop: 20,
		color: Theme.COLORS.HEADER,
	},
	group: {
		paddingTop: theme.SIZES.BASE,
	},
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 0,
	},
	albumThumb: {
		borderRadius: 4,
		marginVertical: 4,
		alignSelf: "center",
		width: thumbMeasure,
		height: thumbMeasure,
	},
	button: {
		marginBottom: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 2,
		height: theme.SIZES.BASE * 3,
		borderRadius: 30,
	},
	category: {
		backgroundColor: theme.COLORS.WHITE,
		marginVertical: theme.SIZES.BASE / 2,
		borderWidth: 0,
	},
	categoryTitle: {
		height: "100%",
		paddingHorizontal: theme.SIZES.BASE,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	imageBlock: {
		overflow: "hidden",
		borderRadius: 4,
	},
	productItem: {
		width: cardWidth - theme.SIZES.BASE * 2,
		marginHorizontal: theme.SIZES.BASE,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 7 },
		shadowRadius: 10,
		shadowOpacity: 0.2,
	},
	productImage: {
		width: cardWidth - theme.SIZES.BASE,
		height: cardWidth - theme.SIZES.BASE,
		borderRadius: 3,
	},
	productTitle: {
		paddingTop: theme.SIZES.BASE,
		paddingBottom: theme.SIZES.BASE / 2,
	},
	productPrice: {
		paddingTop: theme.SIZES.BASE,
		paddingBottom: theme.SIZES.BASE / 2,
		color: Theme.COLORS.PRIMARY,
		fontWeight: "bold",
	},
	productDescription: {
		paddingVertical: theme.SIZES.BASE,
		color: Theme.COLORS.HEADER,
		left: 10,
	},
	descriptionBox: {
		marginHorizontal: theme.SIZES.BASE,
		marginBottom: theme.SIZES.BASE,
		// borderRadius: 5,
		// backgroundColor: theme.COLORS.WHITE,
		// shadowColor: "black",
		// shadowOffset: { width: 0, height: 2 },
		// shadowRadius: 3,
		// shadowOpacity: 0.2,
		// elevation: 3,
	},
	userName: {
		top: 15,
		left: 5,
		fontWeight: "600",
		fontSize: 15,
	},
	stars: {
		top: 20,
		left: 3,
	},
	similarItems: {
		width: 150,
		marginRight: theme.SIZES.BASE,
	},
});

export default Detail;
