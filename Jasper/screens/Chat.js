import { useState, useEffect, useDebugValue } from "react";
import {
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Image,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

// Database
import {
	getDatabase,
	ref as dbRef,
	set as firebaseSet,
} from "firebase/database";

import { Button, Input } from "../components";
import { users, conversations } from "../constants/mockData";
import { Theme, Images } from "../constants";
import Loading from "./Loading";
import StarRating from "react-native-star-rating";

const { width } = Dimensions.get("screen");

const Chat = ({ route, navigation }) => {
	const [rating, setRating] = useState(0.0);
	const [itemData, setItemData] = useState();
	const [inputBoxHeight, setInputBoxHeight] = useState(90);
	const [paymentToggled, setPaymentToggled] = useState(false);

	const { allItems, conversations, conversationId, userId, subjectId } =
		route.params;

	const conversation = conversations[conversationId];
	const userData = users[userId];
	const subjectData = users[subjectId];
	const itemId = conversation.itemId;

	useEffect(() => {
		setItemData(allItems[itemId]);
	}, []);

	const handleDeleteItem = (itemId) => {
		const db = getDatabase();
		const itemRef = dbRef(db, "allItems/" + itemId);
		firebaseSet(itemRef, null);
		setItemData(null);
		console.warn("Item Deleted");
	};

	const renderMessages = () => {
		const messages = conversation.messages;

		// const date = new Date(conversation.updatedAt);
		// const displayedDate = () => {
		// 	if (Date.now() - date.getMilliseconds() >= 86400000) {
		// 		return (
		// 			date.getFullYear() +
		// 			"-" +
		// 			date.getMonth() +
		// 			"-" +
		// 			date.getDate()
		// 		);
		// 	} else {
		// 		return date.getHours() + ":" + date.getMinutes();
		// 	}
		// };

		return messages.map((message, idx) => {
			const avatarUri = users[message.userId].avatar;
			const SELF = 0;
			const SUBJECT = 1;
			const speaker = message.userId == userId ? SELF : SUBJECT;
			const uw = users[message.userId].uw;
			const uw_horz_offset = speaker == SELF ? 48 : 38;
			const avatar = (
				<Block>
					<Image
						source={{ uri: avatarUri }}
						resizeMode="cover"
						style={[
							styles.avatar,
							speaker == SELF
								? { marginLeft: 10 }
								: { marginRight: 10 },
						]}
					/>
					{uw && (
						<Image
							source={require("../assets/imgs/uw.png")}
							style={{
								width: 25,
								height: 15,
								position: "absolute",
								left: uw_horz_offset,
								top: 43,
							}}
							resizeMode="cover"
						/>
					)}
				</Block>
			);

			const messageBubble = (speaker) => {
				const messageContent = () => {
					if (message.contentType === "text") {
						return <Text>{message.content}</Text>;
					} else if (
						message.contentType === "paymentInfo" ||
						message.contentType === "image"
					) {
						return (
							<Image
								source={require("../assets/imgs/venmo-QR.png")}
								style={{ height: 200, width: 200 }}
							/>
						);
					}
				};

				return (
					<Block flex>
						{speaker === SUBJECT && (
							<Text
								style={{
									left: 3,
									color: Theme.COLORS.GRAY,
								}}
							>
								{subjectData.userName}
							</Text>
						)}
						<Block
							style={[
								styles.textBox,
								styles.shadow,
								speaker == SELF
									? {
											backgroundColor: Theme.COLORS.LABEL,
											marginLeft: 50,
											alignSelf: "flex-end",
									  }
									: {
											backgroundColor: Theme.COLORS.BLOCK,
											marginRight: 50,
											alignSelf: "flex-start",
									  },
							]}
						>
							{messageContent()}
						</Block>
					</Block>
				);
			};

			if (speaker == SELF) {
				return (
					<Block
						row
						middle
						space="between"
						style={{ paddingTop: 7, marginVertical: 5 }}
						key={conversation.conversationId + "_" + idx}
					>
						{messageBubble(SELF)}
						{avatar}
					</Block>
				);
			} else {
				return (
					<Block
						row
						middle
						space="between"
						style={{ paddingTop: 7 }}
						key={conversation.conversationId + "_" + idx}
					>
						{avatar}
						{messageBubble(SUBJECT)}
					</Block>
				);
			}
		});
	};

	const togglePaymentOptions = (inputBoxHeight, setInputBoxHeight) => {
		const expandHeight = 280;
		if (inputBoxHeight === 90) {
			setInputBoxHeight(expandHeight);
		} else {
			setInputBoxHeight(90);
		}
	};

	const userInputBar = () => {
		const paymentButton = () => {
			if (paymentToggled) {
				return (
					<Button
						onlyIcon
						icon="keyboard-arrow-down"
						iconFamily="MeterialIcons"
						iconSize={20}
						iconColor={theme.COLORS.BLACK}
						color={"transparent"}
						style={{ width: 30, height: 30, borderWidth: 2 }}
						onPress={() => {
							setPaymentToggled(false);
							togglePaymentOptions(
								inputBoxHeight,
								setInputBoxHeight
							);
						}}
					/>
				);
			} else {
				return (
					<Button
						onlyIcon
						icon="payments"
						iconFamily="MeterialIcons"
						iconSize={20}
						iconColor={theme.COLORS.BLACK}
						color={"transparent"}
						style={{ width: 30, height: 30, borderWidth: 2 }}
						onPress={() => {
							setPaymentToggled(true);
							togglePaymentOptions(
								inputBoxHeight,
								setInputBoxHeight
							);
						}}
					/>
				);
			}
		};
		return (
			<Block
				style={[
					styles.inputBox,
					styles.shadow,
					{ height: inputBoxHeight },
				]}
			>
				<Block row top middle>
					<Block
						middle
						style={{ marginLeft: 10, marginVertical: 10 }}
					>
						{paymentButton()}
					</Block>
					<Input
						iconContent={<Block />}
						placeholder=""
						style={{
							width: (width / 6) * 4 - 20,
							marginHorizontal: 5,
						}}
					></Input>
					<Block style={{ marginVertical: 10 }}>
						<Button
							onlyIcon
							icon="tag-faces"
							iconFamily="MeterialIcons"
							iconSize={30}
							iconColor={theme.COLORS.BLACK}
							color={"transparent"}
							style={{ width: 30, height: 30 }}
						/>
					</Block>
					<Block style={{ marginRight: 1, marginVertical: 10 }}>
						<Button
							onlyIcon
							icon="add-circle-outline"
							iconFamily="MeterialIcons"
							iconSize={30}
							iconColor={theme.COLORS.BLACK}
							color={"transparent"}
							style={{ width: 30, height: 30 }}
						/>
					</Block>
				</Block>
				{paymentToggled && (
					<Block>
						<Text style={styles.title}>
							Send payment information
						</Text>
						<ScrollView
							horizontal={true}
							pagingEnabled={true}
							decelerationRate={0}
							scrollEventThrottle={16}
							snapToAlignment="center"
							showsHorizontalScrollIndicator={false}
							snapToInterval={width - theme.SIZES.BASE * 1.625}
							contentContainerStyle={{
								paddingHorizontal: theme.SIZES.BASE / 2,
							}}
							style={{
								marginBottom: theme.SIZES.BASE * 2,
							}}
						>
							{userData.paymentOptions.map((paymentOption) => (
								<TouchableOpacity
									style={{}}
									key={paymentOption}
								>
									<Image
										source={
											Images.PaymentOptionLogos[
												paymentOption
											]
										}
										style={{
											width: 130,
											height: 130,
											marginHorizontal: theme.SIZES.BASE,
											borderRadius: 15,
										}}
									/>
								</TouchableOpacity>
							))}
						</ScrollView>
					</Block>
				)}
			</Block>
		);
	};

	const ratingBar = (rating, setRating) => {
		if (itemData) {
			return (
				<Block flex style={[styles.rating, styles.shadow]}>
					<Text style={{ fontSize: 20 }}>
						How would you rate your experience?
					</Text>
					<StarRating
						rating={rating}
						starSize={40}
						starStyle={styles.stars}
						fullStarColor={"#FDCC0D"}
						selectedStar={(selectedRating) => {
							setRating(selectedRating);
						}}
					/>
					{rating != 0 && (
						<Text
							style={{
								color: Theme.COLORS.GRAY,
								fontSize: 20,
							}}
						>
							Thank you for your feedback!
						</Text>
					)}
					<Block style={{ marginVertical: 10 }}></Block>
					<Block>
						<Button
							style={styles.button}
							textStyle={{ fontSize: 20 }}
							onPress={() => handleRatingSubmission()}
						>
							Submit
						</Button>
					</Block>
					{userId === itemData.sellerId && (
						<Button
							style={styles.button}
							textStyle={{ fontSize: 20 }}
							color={Theme.COLORS.ERROR}
							onPress={() => {
								handleDeleteItem(itemId);
								handleRatingSubmission();
							}}
						>
							Submit and Delete this Post
						</Button>
					)}
					<Button
						style={styles.button}
						textStyle={{ fontSize: 20 }}
						color={Theme.COLORS.ERROR}
						onPress={() => navigation.navigate("Support")}
					>
						Report Issues
					</Button>
				</Block>
			);
		} else {
			return (
				<Block flex style={[styles.rating, styles.shadow]}>
					<Text
						style={{
							color: Theme.COLORS.GRAY,
							fontSize: 20,
						}}
					>
						Thank you for your feedback!
					</Text>
					<Text style={{ fontSize: 20 }}>
						This item has been deleted
					</Text>
				</Block>
			);
		}
	};

	return (
		<Block flex center style={styles.home}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.articles}
				style={{ overflow: "visible" }}
			>
				<Block
					flex
					style={[
						styles.shadow,
						{ paddingHorizontal: theme.SIZES.BASE / 2 },
					]}
				>
					{itemData && (
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("Detail-Chat", {
									itemId: itemId,
								})
							}
						>
							<Block
								row
								center
								style={[styles.topBox, styles.shadow]}
							>
								<Block
									style={{
										width: (width / 7) * 4.5,
										paddingHorizontal: 10,
									}}
								>
									<Text
										size={25}
										style={{ paddingHorizontal: 1 }}
									>
										{itemData.title}
									</Text>
									<Text
										size={20}
										color={Theme.COLORS.SECONDARY}
										bold
									>
										{"$" +
											parseFloat(itemData.price).toFixed(
												2
											)}
									</Text>
								</Block>
								<Block style={{ width: (width / 7) * 1.5 }}>
									<Image
										source={{ uri: itemData.images[0] }}
										resizeMode="cover"
										style={styles.thumb}
									/>
								</Block>
							</Block>
						</TouchableOpacity>
					)}
				</Block>
				<Block flex>
					<Block style={{ marginVertical: 10 }}>
						{renderMessages()}
					</Block>

					{conversation.tradeEnded && ratingBar(rating, setRating)}
				</Block>
			</ScrollView>
			{userInputBar()}
		</Block>
	);
};

const styles = StyleSheet.create({
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 40,
		borderWidth: 0,
	},
	button: {
		marginVertical: theme.SIZES.BASE,
		width: width - theme.SIZES.BASE * 6,
		height: theme.SIZES.BASE * 3,
		borderRadius: 30,
	},
	chatTitle: {
		position: "absolute",
		// bottom: 0,
		zIndex: 10,
	},
	payButton: {
		height: 30,
		width: 30,
		borderRadius: 20,
		borderColor: theme.COLORS.BLACK,
		borderWidth: 2,
	},
	home: {
		width: width,
		backgroundColor: theme.COLORS.WHITE,
	},
	articles: {
		width: width - theme.SIZES.BASE * 2,
		paddingVertical: theme.SIZES.BASE,
	},
	thumb: {
		borderRadius: 20,
		marginVertical: 4,
		width: 80,
		height: 80,
	},
	textBox: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderRadius: 20,
	},
	topBox: {
		backgroundColor: Theme.COLORS.WHITE,
		borderRadius: 20,
	},
	title: {
		fontWeight: "600",
		fontSize: 18,
		color: Theme.COLORS.HEADER,
		marginLeft: theme.SIZES.BASE,
		marginBottom: theme.SIZES.BASE,
	},
	rating: {
		marginHorizontal: 0,
		backgroundColor: Theme.COLORS.BLOCK,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 10,
	},
	shadow: {
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 3,
		shadowOpacity: 0.2,
		elevation: 3,
	},
	inputBox: {
		width: width + 2,
		borderTopColor: Theme.COLORS.BLOCK,
		borderWidth: 1,
		backgroundColor: theme.COLORS.WHITE,
	},
});

export default Chat;
