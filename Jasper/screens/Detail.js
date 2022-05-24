import { useState, useEffect, useSyncExternalStore } from "react";
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
	get as firebaseGet,
	push as firebasePush,
	orderByChild,
	onValue,
	query,
	equalTo,
	Database,
	child,
	limitToFirst,
} from "firebase/database";

// Libraries
import StarRating from "react-native-star-rating";
import {
	getStorage,
	deleteObject,
	ref as storageRef,
	listAll,
} from "firebase/storage";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

function Detail({ route, navigation }) {
	const { conversationList, itemId, users, userId } = route.params;
	// const [allItems, setAllItems] = useState();

	// useEffect(() => {
	// 	const db = getDatabase();
	// 	const allItemsRef = dbRef(db, "allItems/");

	// 	const allItemsOffFunction = onValue(allItemsRef, (snapshot) => {
	// 		const newAllItems = snapshot.val();
	// 		setAllItems(newAllItems);
	// 	});

	// 	function cleanUp() {
	// 		allItemsOffFunction();
	// 	}

	// 	return cleanUp;
	// }, []);

	// if (!allItems) {
	// 	return <Loading />;
	// }
	// const item = allItems[itemId];

	// ********************************
	const [item, setItem] = useState();
	const [otherItems, setOtherItems] = useState([]);
	const db = getDatabase();

	useEffect(() => {
		const fetchData = async () => {
			const itemRef = dbRef(db, "allItems/" + itemId);
			let sellerId;
			await firebaseGet(itemRef).then((snapshot) => {
				setItem(snapshot.val());
				sellerId = snapshot.val().sellerId;
			});

			const otherItemRef = query(
				dbRef(db, "allItems"),
				orderByChild("sellerId"),
				equalTo(sellerId),
				limitToFirst(10)
			);
			onValue(otherItemRef, (snapshot) => {
				setOtherItems(
					Object.keys(snapshot.val())
						.filter((key) => key != itemId)
						.map((key) => snapshot.val()[key])
				);
			});
		};
		fetchData();
	}, []);

	// ******************************

	if (!item) {
		return <Loading />;
	}
	const sellerData = users[item.sellerId];

	const handleDeleteItem = async () => {
		const itemRef = dbRef(db, "allItems/" + itemId);

		const userRef = dbRef(db, "users/" + userId);
		let newUserData = { ...sellerData };
		const newPostedItems = newUserData.postedItems.filter(
			(id) => id !== itemId
		);
		newUserData.postedItems = newPostedItems;

		const storage = getStorage();
		const imgsRef = storageRef(storage, "itemImages/" + itemId);

		firebaseSet(userRef, newUserData);
		listAll(imgsRef).then((result) => {
			result.items.forEach((imgRef) => {
				deleteObject(imgRef);
			});
		});
		firebaseSet(itemRef, {});

		navigation.goBack();
		alert("Item Deleted");
	};

	const renderIntro = () => {
		if (sellerData.intro.length > 100) {
			return sellerData.intro.slice(0, 100) + "...";
		} else {
			return sellerData.intro;
		}
	};

	const renderImageCarousel = () => {
		const renderImages = () => {
			return item.images.map((imgUri) => (
				<TouchableWithoutFeedback
					style={{ zIndex: 3 }}
					key={`product-${imgUri}`}
				>
					<Block center style={styles.productItem}>
						<Image
							resizeMode="cover"
							style={styles.productImage}
							source={{ uri: imgUri }}
						/>
					</Block>
				</TouchableWithoutFeedback>
			));
		};
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
				{item && renderImages()}
			</ScrollView>
		);
	};

	const renderCards = () => {
		return otherItems.map((otherItem) => (
			<Card
				item={otherItem}
				style={styles.otherItems}
				key={"similar" + otherItem.itemId}
			/>
		));
	};

	const handleConversationStarter = () => {
		for (let i = 0; i < conversationList.length; i++) {
			// If the conversation already exists, navigate to that conversation
			if (
				conversationList[i].participants.includes(userId) &&
				conversationList[i].participants.includes(sellerData.userId) &&
				conversationList[i].itemId === itemId
			) {
				navigation.navigate("Chat", {
					conversationId: conversationList[i].conversationId,
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
							<Block flex>
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
								<Block flex row>
									<Text size={24} style={styles.productPrice}>
										{"$" +
											parseFloat(item.price).toFixed(2)}
									</Text>
									{!item.negotiable && (
										<Text
											size={15}
											style={{ left: 5, top: 20 }}
											color={Theme.COLORS.GRAY}
										>
											(Not Negotiable)
										</Text>
									)}
								</Block>
							</Block>
						</Block>
						{renderImageCarousel()}
						<Block style={styles.descriptionBox}>
							<Text
								size={18}
								color={theme.COLORS.BLACK}
								style={styles.title}
							>
								Seller Information:
							</Text>

							<TouchableOpacity
								onPress={() =>
									navigation.navigate("Profile-other", {
										userId: sellerData.userId,
										otherUser: true,
									})
								}
							>
								<Block
									flex
									row
									style={{
										top: 15,
										left: 10,
										marginBottom: 20,
									}}
								>
									<Image
										source={{
											uri: sellerData.avatar,
										}}
										style={styles.avatar}
									/>
									{sellerData.uw && (
										<Image
											source={require("../assets/imgs/uw.png")}
											style={{
												width: 25,
												height: 15,
												position: "absolute",
												top: 45,
												left: 40,
											}}
											resizeMode="cover"
										/>
									)}

									<Block>
										<Text size={14} style={styles.userName}>
											{sellerData.userName}
										</Text>
										<StarRating
											disabled
											rating={
												sellerData.rating.reduce(
													(a, b) => a + b
												) / sellerData.rating.length
											}
											starSize={18}
											starStyle={styles.stars}
											fullStarColor={"#FDCC0D"}
										/>
									</Block>
								</Block>
							</TouchableOpacity>

							<Block
								flex
								style={{ marginLeft: 3, marginBottom: 20 }}
							>
								<Text
									size={14}
									style={[styles.userName]}
									color={Theme.COLORS.GRAY}
								>
									{renderIntro()}
								</Text>
							</Block>
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
									onPress={() => handleConversationStarter()}
								>
									{"Chat with " + sellerData.userName}
								</Button>
							)}
							{userId === sellerData.userId && (
								<Button
									style={styles.button}
									textStyle={{ fontSize: 20 }}
									color={Theme.COLORS.ERROR}
									onPress={() => handleDeleteItem()}
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
							{otherItems && renderCards()}
						</ScrollView>
					</Block>
				</Block>
			</ScrollView>
		</Block>
	);
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
		marginRight: 10
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
