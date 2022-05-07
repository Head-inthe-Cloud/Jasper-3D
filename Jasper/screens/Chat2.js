import React from "react";
import {
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Image,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button, Input } from "../components";
import { items, users, conversations } from "../constants/mockData";
import { Theme, Images } from "../constants";
import StarRating from "react-native-star-rating";

const { width } = Dimensions.get("screen");

// Set to constant for presentation
const conversationList = Object.keys(conversations).map(
	(key) => conversations[key]
);
const conversation = conversationList[1];
const itemData = items[conversation.itemId];
const userId = users.u00001.userId;
const userData = users[userId];
const subjectId =
	conversation.participants[0] == userId
		? conversation.participants[1]
		: conversation.participants[0];
const subjectData = users[subjectId];
const userRole = subjectId === "u00002" ? "seller" : "buyer";

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

		const messageContent = () => {
			if (message.contentType === "text") {
				return (
					<Block flex>
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
							<Text>{message.content}</Text>
						</Block>
					</Block>
				);
			} else if (message.contentType === "paymentInfo") {
				return (
					<Block flex>
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
							<Image
								source={require("../assets/imgs/venmo-QR.png")}
								style={{ height: 200, width: 200 }}
							/>
						</Block>
					</Block>
				);
			}
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
					{messageContent()}
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
					{messageContent()}
				</Block>
			);
		}
	});
};

const ratingBar = (rating, setRating) => {
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
		</Block>
	);
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
	const [inputBoxHeight, setInputBoxHeight] = React.useState(90);
	const [paymentToggled, setPaymentToggled] = React.useState(false);

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
						togglePaymentOptions(inputBoxHeight, setInputBoxHeight);
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
						togglePaymentOptions(inputBoxHeight, setInputBoxHeight);
					}}
				/>
			);
		}
	};
	return (
		<Block
			style={[styles.inputBox, styles.shadow, { height: inputBoxHeight }]}
		>
			<Block row top middle>
				<Block middle style={[styles.button, { marginLeft: 10 }]}>
					{paymentButton()}
				</Block>
				<Input
					iconContent={<Block />}
					placeholder=""
					style={{ width: (width / 6) * 4 - 20, marginHorizontal: 5 }}
				></Input>
				<Block style={styles.button}>
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
				<Block style={[styles.button, { marginRight: 10 }]}>
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
					<Text style={styles.title}>Send payment information</Text>
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
							<TouchableOpacity style={{}} key={paymentOption}>
								<Image
									source={
										Images.PaymentOptionLogos[paymentOption]
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

const Chat2 = (props) => {
	const [rating, setRating] = React.useState(0.0);
	const { navigation } = props;
	return (
		<Block flex center style={styles.home}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.articles}
				style={{ overflow: "visible" }}
			>
				<Block flex>
					<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
						{/* <TouchableOpacity
							onPress={() =>
								navigation.navigate("Message Center")
							}
						>
							<Block flex row style={styles.ratingButton}>
								<Block width={(width / 7) * 4}>
									<Text style={{ fontWeight: "600" }}>
										Click here to rate your trading
										experiecne when you're done!
									</Text>
								</Block>
								<Image
									source={{ uri: itemData.images[0] }}
									resizeMode="cover"
									style={styles.thumb}
								/>
							</Block>
						</TouchableOpacity> */}
					</Block>
					<Block style={{ marginVertical: 10 }}>
						{renderMessages()}
					</Block>

					{/* {userRole == "buyer" && (
						<Block center>
							<Button
								onPress={() => handlePayment()}
								style={styles.button}
								textStyle={{ fontSize: 15, fontWeight: "600" }}
							>
								Pay the Seller
							</Button>
						</Block>
					)} */}
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
		marginVertical: 10,
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
		alignSelf: "center",
		width: 80,
		height: 80,
	},
	textBox: {
		paddingHorizontal: 10,
		paddingVertical: 10,
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
	},
});

export default Chat2;
