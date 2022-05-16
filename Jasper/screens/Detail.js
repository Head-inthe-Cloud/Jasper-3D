import { useState, useEffect } from "react";
//galio
import { Block, Text, theme } from "galio-framework";
import {
	BackHandler,
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native";
//argon
import { Theme } from "../constants/";
// import { conversations, users } from "../constants/mockData";

import { Button, Card, Icon } from "../components/";
import Loading from "./Loading";

// database
import {
	getDatabase,
	ref as dbRef,
	set as firebaseSet,
	push as firebasePush,
	onValue,
} from "firebase/database";

// Libraries
import StarRating from "react-native-star-rating";

const { width } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

function Detail({ route, navigation }) {
	const { conversationsOverview, itemId, users, userId } = route.params;
	const [allItems, setAllItems] = useState({});

	useEffect(() => {
		const db = getDatabase();
		const allItemsRef = dbRef(db, "allItems");

		const allItemsOffFunction = onValue(allItemsRef, (snapshot) => {
			const newAllItems = snapshot.val();
			setAllItems(newAllItems);
		});

		function cleanUp() {
			allItemsOffFunction();
		}

		return cleanUp;
	}, []);

	const handleDeleteItem = (itemId) => {
		const db = getDatabase();
		const itemRef = dbRef(db, "allItems/" + itemId);
		firebaseSet(itemRef, null);
		navigation.goBack();
		console.warn("Item Deleted");
	};

	const renderImage = (imgUri) => {
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

	const renderImageCarousel = (item) => {
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
				{allItems && item.images.map((image) => renderImage(image))}
			</ScrollView>
		);
	};

	const renderCard = (otherItem) => {
		return (
			<Card
				item={otherItem}
				style={styles.otherItems}
				key={"similar" + otherItem.itemId}
			/>
		);
	};



	const item = allItems[itemId];

	if (item) {
		const sellerData = users[item.sellerId];
		const otherItems = sellerData.postedItems
			.filter((key) => key != itemId)
			.map((key) => allItems[key]);

		const handleConversationStarter = async () => {
			for (let i = 0; i < conversationsOverview.length; i++) {
				// If the conversation already exists, navigate to that conversation
				if (
					conversationsOverview[i][1].includes(userId) &&
					conversationsOverview[i][1].includes(sellerData.userId)
				) {
					navigation.navigate("Chat", {
						conversationId: conversationsOverview[i][0],
						userId: userId,
						subjectId: sellerData.userId,
					});
					return;
				}
			}

			// If the conversation does not exist, create a new conversation
			let today = new Date(Date.now());
			let newConversation = {
				conversationId: null,
				createdAt: today.toISOString(),
				itemId: itemId,
				messages: [
					{
						content: "Hi " + sellerData.userName + "!",
						contentType: "text",
						time: today.toISOString(),
						userId: userId,
					},
				],
				participants: [userId, sellerData.userId],
				tradeEnded: false,
				updatedAt: today.toISOString(),
			};

			const db = getDatabase();
			const conversationRef = dbRef(db, "conversations");
			const newConversationId = firebasePush(
				conversationRef,
				newConversation
			).key;
			newConversation.conversationId = newConversationId;

			const newConversationRef = dbRef(
				db,
				"conversations/" + newConversationId
			);
			firebaseSet(newConversationRef, newConversation);
			setTimeout(() => {
				navigation.navigate("Chat", {
					conversationId: newConversationId,
					userId: userId,
					subjectId: sellerData.userId,
				});
			}, 800);
		};

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
											{"$" +
												parseFloat(item.price).toFixed(2)}
										</Text>
									</Block>
								</Block>
							</Block>
							{renderImageCarousel(item)}
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
								{userId !== sellerData.userId && (
									<Button
										style={styles.button}
										textStyle={{ fontSize: 20 }}
										onPress={() =>
											handleConversationStarter()
										}
									>
										{"Chat with " + sellerData.userName}
									</Button>
								)}
								{userId === sellerData.userId && (
									<Button
										style={styles.button}
										textStyle={{ fontSize: 20 }}
										color={Theme.COLORS.ERROR}
										onPress={() =>
											handleDeleteItem(itemId)
										}
									>
										Delete This Post
									</Button>
								)}
							</Block>
							<Block style={styles.descriptionBox}>
								<Text
									size={18}
									color={theme.COLORS.BLACK}
									style={styles.title}
								>
									Other Items posted by this Seller:
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
								{otherItems &&
									otherItems.map((otherItem) =>
										renderCard(otherItem)
									)}
							</ScrollView>
						</Block>
					</Block>
				</ScrollView>
			</Block>
		);
	} else {
		return <Loading />;
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
	otherItems: {
		width: 150,
		marginRight: theme.SIZES.BASE,
	},
});

export default Detail;
