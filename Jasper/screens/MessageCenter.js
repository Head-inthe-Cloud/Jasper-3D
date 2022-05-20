import { useState, useEffect } from "react";
import {
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Image,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { getDatabase, ref, onValue } from "firebase/database";

import { Theme } from "../constants";
const { height, width } = Dimensions.get("screen");

const MessageCenter = ({ route, navigation }) => {
	const { allItems, users, userId } = route.params;

	// Fetch data from database
	const [conversations, setConversations] = useState({});
	useEffect(() => {
		const db = getDatabase();
		const conversationsRef = ref(db, "conversations");

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

	const conversationList = Object.keys(conversations)
		.map((key) => conversations[key])
		.filter((conversation) => conversation.participants.includes(userId))
		.sort(
			(first, second) =>
				Date.parse(second.createdAt) - Date.parse(first.createdAt)
		);

	const renderConversation = (conversation, navigation, userId) => {
		const subjectId =
			conversation.participants[0] == userId
				? conversation.participants[1]
				: conversation.participants[0];
		const subjectData = users[subjectId];
		const itemData = allItems[conversation.itemId];
		const latestMessage =
			conversation.messages[conversation.messages.length - 1];
		const displayedMessage = () => {
			const content =
				latestMessage.contentType === "text"
					? latestMessage.content
					: "[" +
					  latestMessage.contentType.charAt(0).toUpperCase() +
					  latestMessage.contentType.slice(1) +
					  "]";
			if (content.length > 20) {
				return content.slice(0, 23) + "...";
			} else {
				return content;
			}
		};
		const date = new Date(conversation.updatedAt);
		const displayedDate = () => {
			if (Date.now() - date.getMilliseconds() >= 86400000) {
				return (
					date.getFullYear() +
					"-" +
					date.getMonth() +
					"-" +
					date.getDate()
				);
			} else {
				return date.getHours() + ":" + date.getMinutes();
			}
		};

		return (
			<TouchableOpacity
				onPress={() =>
					navigation.navigate("Chat", {
						conversationId: conversation.conversationId,
						userId: userId,
						subjectId: subjectId,
					})
				}
				key={conversation.conversationId}
			>
				<Block row middle space="between" style={{ paddingTop: 7 }}>
					<Image
						source={{ uri: subjectData.avatar }}
						key={`viewed-${subjectData.avatar}`}
						resizeMode="cover"
						style={styles.avatar}
					/>
					{subjectData.uw && (
						<Image
							source={require("../assets/imgs/uw.png")}
							style={{
								width: 25,
								height: 15,
								position: "absolute",
								left: 40,
								top: 70,
							}}
							resizeMode="cover"
						/>
					)}
					<Block flex>
						<Text style={{ fontWeight: "bold", fontSize: 20 }}>
							{subjectData.userName}
						</Text>
						<Text>{displayedMessage()}</Text>
						<Text style={{ color: Theme.COLORS.GRAY }}>
							{displayedDate()}
						</Text>
					</Block>
					<Image
						source={{ uri: itemData.images[0] }}
						key={`viewed-${itemData.images[0]}`}
						resizeMode="cover"
						style={styles.thumb}
					/>
				</Block>
			</TouchableOpacity>
		);
	};

	return (
		<Block flex center style={styles.home}>
			{conversationList.length === 0 && (
				<Block flex center>
					<Image
						source={require("../assets/imgs/chat.png")}
						style={{
							resizeMode: "cover",
							height: height / 2 + theme.SIZES.BASE * 3,
							width: width,
							marginTop: 20,
						}}
					/>
					<Text size={25} style={{ textAlign: "center" }}>
						{
							"Seems Like you haven't\nstarted any conversation yet!"
						}
					</Text>
				</Block>
			)}
			{conversationList.length !== 0 && (
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.articles}
				>
					<Block flex>
						<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
							{conversationList.map((conversation) => {
								return renderConversation(
									conversation,
									navigation,
									userId
								);
							})}
						</Block>
					</Block>
				</ScrollView>
			)}
		</Block>
	);
};

const styles = StyleSheet.create({
	home: {
		width: width,
		backgroundColor: theme.COLORS.WHITE,
	},
	articles: {
		width: width - theme.SIZES.BASE * 2,
		paddingVertical: theme.SIZES.BASE,
	},
	title: {
		textDecorationLine: "underline",
	},
	avatar: {
		width: 70,
		height: 70,
		borderRadius: 40,
		borderWidth: 0,
		marginRight: 10,
	},
	thumb: {
		borderRadius: 20,
		marginVertical: 4,
		alignSelf: "center",
		width: 80,
		height: 80,
	},
});

export default MessageCenter;
