import React from "react";
import {
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Image,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { items, users, conversations } from "../constants/mockData";
import { Theme } from "../constants";
const { width } = Dimensions.get("screen");

const userId = users.u00001.userId;
const conversationList = Object.keys(conversations).map(
	(key) => conversations[key]
);

const renderConversation = (conversation, navigation) => {
	const subjectId =
		conversation.participants[0] == userId
			? conversation.participants[1]
			: conversation.participants[0];
	const subjectData = users[subjectId];
	const itemData = items[conversation.itemId];
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

	// Temp
	const chatPage = subjectId == "u00002" ? "Chat" : "Chat2";

	return (
		<TouchableOpacity
			onPress={() => navigation.navigate(chatPage)}
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

const MessageCenter = (props) => {
	const { navigation } = props;
	return (
		<Block flex center style={styles.home}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.articles}
			>
				<Block flex>
					<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
						{conversationList.map((conversation) => {
							return renderConversation(conversation, navigation);
						})}
					</Block>
				</Block>
			</ScrollView>
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
