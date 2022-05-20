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
	onValue,
} from "firebase/database";
import {
	getDownloadURL,
	getStorage,
	ref as storageRef,
	uploadBytes,
} from "firebase/storage";

import { Button, Input } from "../components";
import { Theme, Images } from "../constants";
import Loading from "./Loading";
import StarRating from "react-native-star-rating";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("screen");

const Chat = ({ route, navigation }) => {
	const [rating, setRating] = useState(0.0);
	const [inputBoxHeight, setInputBoxHeight] = useState(90);
	const [paymentToggled, setPaymentToggled] = useState(false);
	const [textInput, setTextInput] = useState("");

	const { allItems, conversationId, users, userId, subjectId } = route.params;

	const [conversations, setConversations] = useState();
	const db = getDatabase();

	useEffect(() => {
		const conversationsRef = dbRef(db, "conversations");

		const conversationsOffFunction = onValue(
			conversationsRef,
			(snapshot) => {
				const newConversations = snapshot.val();
				setConversations(newConversations);
			}
		);

		function cleanUp() {
			conversationsOffFunction();
		}

		return cleanUp;
	}, []);

	if (conversations) {
		const conversation = conversations[conversationId];
		const userData = users[userId];
		const subjectData = users[subjectId];
		const itemId = conversation.itemId;
		const db = getDatabase();
		const conversationRef = dbRef(db, "conversations/" + conversationId);

		let itemData = allItems[itemId];

		const handleDeleteItem = (itemId) => {
			const itemRef = dbRef(db, "allItems/" + itemId);
			firebaseSet(itemRef, null);
			itemData = null;
			console.warn("Item Deleted");
		};

		const togglePaymentOptions = () => {
			const expandHeight = 280;
			if (inputBoxHeight === 90) {
				setInputBoxHeight(expandHeight);
			} else {
				setInputBoxHeight(90);
			}
		};

		const toggleTextInput = (action) => {
			const expandHeight = 400;
			if (action === "up") {
				setInputBoxHeight(expandHeight);
			} else if (action === "down") {
				setInputBoxHeight(90);
			}
		};

		const handleSentMessage = async (type, content) => {
			if (!content) {
				return;
			}
			const conversationRef = dbRef(
				db,
				"conversations/" + conversationId
			);
			let newConversation = { ...conversation };
			let newMessages = newConversation.messages;
			let today = new Date(Date.now());
			let newMessage = {
				time: today.toISOString(),
				contentType: null,
				content: null,
				userId: userId,
			};

			switch (type) {
				case "text":
					newMessage.content = content;
					newMessage.contentType = "text";
					break;
				case "image":
					const storage = getStorage();
					const uriSplit = content.split("/");
					const imgName = uriSplit[uriSplit.length - 1];
					const itemImgRef = storageRef(
						storage,
						"conversationData/" + conversationId + "/" + imgName
					);
					const response = await fetch(content);
					const blob = await response.blob();
					await uploadBytes(itemImgRef, blob).catch((error) => {
						console.warn(error);
					});
					const remoteUrl = await getDownloadURL(itemImgRef);
					newMessage.content = remoteUrl;
					newMessage.contentType = "image";
					break;
				case "paymentInfo":
					newMessage.content = content;
					if (content.includes("firebasestorage")) {
						newMessage.contentType = "image";
					} else {
						newMessage.contentType = "text";
					}
					break;
				default:
					break;
			}

			newMessages.push(newMessage);
			newConversation.messages = newMessages;
			newConversation.updatedAt = today.toISOString();

			firebaseSet(conversationRef, newConversation);
			setTextInput("");
		};

		const handleChooseImage = async () => {
			const options = {
				maxWidth: 300,
				maxHeight: 300,
				mediaType: "photo",
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0,
				base64: true,
			};
			const result = await ImagePicker.launchImageLibraryAsync(options);
			if (!result.uri) {
				return;
			}
			handleSentMessage("image", result.uri);
		};

		const handleRatingSubmission = () => {
			const subjectData = users[subjectId];
			let newSubjectData = { ...subjectData };
			let newRating = [...newSubjectData.rating, rating];
			newSubjectData.rating = newRating;

			const subjectRef = dbRef(db, "users/" + subjectId);
			firebaseSet(subjectRef, newSubjectData);

			let newConversation = { ...conversation };
			newConversation.rated = true;
			const conversationRef = dbRef(
				db,
				"conversations/" + conversationId
			);
			firebaseSet(conversationRef, newConversation);
		};

		const renderMessages = () => {
			const messages = conversation.messages;

			return messages.map((message, idx) => {
				const avatarUri = users[message.userId].avatar;
				const SELF = 0;
				const SUBJECT = 1;
				const speaker = message.userId == userId ? SELF : SUBJECT;
				const uw = users[message.userId].uw;
				const uw_horz_offset = speaker == SELF ? 48 : 38;
				const avatar = (
					<TouchableOpacity
						onPress={() => {
							if(speaker === SUBJECT){
								navigation.navigate("Profile-other", {
									userId: subjectId,
									otherUser: true,
								});
							}
						}}
					>
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
					</TouchableOpacity>
				);

				const messageBubble = (speaker) => {
					const messageContent = () => {
						if (message.contentType === "text") {
							return <Text>{message.content}</Text>;
						} else if (message.contentType === "image") {
							return (
								<Image
									source={{ uri: message.content }}
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
												backgroundColor:
													Theme.COLORS.LABEL,
												marginLeft: 50,
												alignSelf: "flex-end",
										  }
										: {
												backgroundColor:
													Theme.COLORS.BLOCK,
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
							style={{
								width: 30,
								height: 30,
								borderWidth: 2,
								bottom: 5,
							}}
							onPress={() => {
								setPaymentToggled(false);
								togglePaymentOptions();
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
							style={{
								width: 30,
								height: 30,
								borderWidth: 2,
								bottom: 5,
							}}
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
							value={textInput}
							onFocus={() => toggleTextInput("up")}
							onBlur={() => toggleTextInput("down")}
							onChangeText={(text) => setTextInput(text)}
						></Input>
						<Block style={{ marginRight: 1, marginVertical: 10 }}>
							<Button
								onlyIcon
								icon="add-circle-outline"
								iconFamily="MeterialIcons"
								iconSize={34}
								iconColor={theme.COLORS.BLACK}
								color={"transparent"}
								style={{ width: 30, height: 30, bottom: 5 }}
								onPress={() => handleChooseImage()}
							/>
						</Block>
						<Block style={{ marginVertical: 10 }}>
							<Button
								onlyIcon
								icon="chevron-right"
								iconFamily="Entypo"
								iconSize={25}
								iconColor={theme.COLORS.BLACK}
								color={"transparent"}
								style={{
									width: 29,
									height: 29,
									borderWidth: 3,
									right: 2,
									bottom: 3,
								}}
								onPress={() =>
									handleSentMessage("text", textInput)
								}
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
								snapToInterval={
									width - theme.SIZES.BASE * 1.625
								}
								contentContainerStyle={{
									paddingHorizontal: theme.SIZES.BASE / 2,
								}}
								style={{
									marginBottom: theme.SIZES.BASE * 2,
								}}
							>
								{renderPaymentOptions()}
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
						{!conversation.rated && (
							<Block flex style={styles.rating}>
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
							</Block>
						)}
						{conversation.rated && (
									<Text
										style={{
											color: Theme.COLORS.GRAY,
											fontSize: 20,
										}}
									>
										Thank you for your feedback!
									</Text>
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

		const endConversation = () => {
			const newConversation = { ...conversation };
			newConversation.tradeEnded = true;
			firebaseSet(conversationRef, newConversation);
		};

		const renderPaymentOptions = () => {
			if (!userData.paymentOptions) {
				return;
			}
			return Object.keys(userData.paymentOptions).map((paymentOption) => (
				<TouchableOpacity
					style={{}}
					key={"chat-" + paymentOption}
					onPress={() => {
						handleSentMessage(
							"paymentInfo",
							userData.paymentOptions[paymentOption]
						);
						endConversation();
					}}
				>
					<Image
						source={Images.PaymentOptionLogos[paymentOption]}
						style={{
							width: 130,
							height: 130,
							marginHorizontal: theme.SIZES.BASE,
							borderRadius: 15,
						}}
					/>
				</TouchableOpacity>
			));
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
												parseFloat(
													itemData.price
												).toFixed(2)}
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

						{conversation.tradeEnded &&
							ratingBar(rating, setRating)}
					</Block>
				</ScrollView>
				{userInputBar()}
			</Block>
		);
	} else {
		return <Loading />;
	}
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
