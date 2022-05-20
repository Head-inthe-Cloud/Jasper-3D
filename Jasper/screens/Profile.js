import { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	Dimensions,
	ScrollView,
	Image,
	ImageBackground,
	Platform,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import {
	getDatabase,
	ref as dbRef,
	set as firebaseSet,
	onValue,
} from "firebase/database";
import {
	getStorage,
	ref as storageRef,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { logout } from "../firebase.js";

import { Button, Card, Icon } from "../components";
import { Images, Theme } from "../constants";
import { HeaderHeight } from "../constants/utils";

import StarRating from "react-native-star-rating";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

import Loading from "./Loading";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

function Profile({ route, navigation }) {
	const { allItems, userId, otherUser } = route.params;

	const [userData, setUserData] = useState();
	const [editInfoField, setEditInfoField] = useState(false);

	const [displayedPaymentOption, setDisplayedPaymentOption] = useState([]);

	const inputBoxRef = useRef(null);

	useEffect(() => {
		const db = getDatabase();
		const userDataRef = dbRef(db, "users/" + userId);

		const userDataOffFunction = onValue(userDataRef, (snapshot) => {
			const newUserData = snapshot.val();
			setUserData(newUserData);
		});

		function cleanUp() {
			userDataOffFunction();
		}

		return cleanUp;
	}, []);

	useEffect(() => {
		if (editInfoField) {
			inputBoxRef.current.focus();
		}
	}, [editInfoField]);

	// Page protector
	if (!userData) {
		return <Loading />;
	}

	const db = getDatabase();
	const storage = getStorage();
	const userDataRef = dbRef(db, "users/" + userId);

	const handleEditInfo = (field) => {
		setEditInfoField(field);
	};

	const setInfo = (text) => {
		let newUserData = { ...userData };
		if (editInfoField.includes("/")) {
			const fields = editInfoField.split("/");
			if (newUserData[fields[0]]) {
				newUserData[fields[0]][fields[1]] = text;
			} else {
				newUserData[fields[0]] = {};
				newUserData[fields[0]][fields[1]] = text;
			}
		} else {
			newUserData[editInfoField] = text;
		}
		firebaseSet(userDataRef, newUserData);
	};

	const handleDeletePaymentInfo = (paymentOption) => {
		const newUserData = { ...userData };
		newUserData.paymentOptions[paymentOption] = null;
		firebaseSet(userDataRef, newUserData);
		const imgPath =
			"userData/" +
			userId +
			"/" +
			"paymentOptions/" +
			paymentOption +
			".jpg";
		const imgRef = storageRef(storage, imgPath);
		deleteObject(imgRef);
	};

	const handleChoosePhoto = async (imageField) => {
		const options = {
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 0,
			base64: true,
		};
		const result = await ImagePicker.launchImageLibraryAsync(options);
		let imgPath = "userData/" + userId + "/" + imageField + ".jpg";
		const imgRef = storageRef(storage, imgPath);
		const response = await fetch(result.uri);
		const blob = await response.blob();
		await uploadBytes(imgRef, blob).catch((error) => {
			console.warn(error.message);
		});
		const remoteUrl = await getDownloadURL(imgRef);
		let newUserData = { ...userData };

		if (imageField.includes("/")) {
			const fields = imageField.split("/");
			if (newUserData[fields[0]]) {
				newUserData[fields[0]][fields[1]] = remoteUrl;
			} else {
				newUserData[fields[0]] = {};
				newUserData[fields[0]][fields[1]] = remoteUrl;
			}
		} else {
			newUserData[imageField] = remoteUrl;
		}
		firebaseSet(userDataRef, newUserData);
	};

	const renderLocation = () => {
		if (userData.location) {
			return userData.location;
		} else {
			return "Where are you located?";
		}
	};

	const renderIntro = () => {
		if (userData.intro) {
			return userData.intro;
		} else {
			return "Tell others somethings about you";
		}
	};

	const renderUserName = () => {
		if (userData.userName) {
			return userData.userName;
		} else {
			return "Anonymous User";
		}
	};

	const renderPostedItems = () => {
		if (
			userData.postedItems.length === 1 &&
			userData.postedItems[0] === "default"
		) {
			return (
				<Text style={{ marginVertical: 10 }} size={15}>
					Seems like you haven't posted any item yet
				</Text>
			);
		} else {
			return userData.postedItems
				.filter((id) => id !== "default")
				.map((itemId, idx) => {
					const itemData = allItems[itemId];
					if (!itemData) {
						return null;
					}
					return (
						<Block flex row key={"posted-" + idx}>
							<Card
								item={itemData}
								style={{
									width: 150,
									marginHorizontal: theme.SIZES.BASE,
								}}
							/>
						</Block>
					);
				})
				.filter((block) => block !== null);
		}
	};

	const renderSavedItems = () => {
		if (
			userData.savedItems.length === 1 &&
			userData.savedItems[0] === "default"
		) {
			return (
				<Text style={{ marginVertical: 10, marginLeft: 7 }} size={15}>
					Seems like you haven't saved any item yet{" "}
				</Text>
			);
		} else {
			return userData.savedItems
				.filter((id) => id !== "default")
				.slice(0, 3)
				.map((itemId, idx) => (
					<Image
						source={{
							uri: allItems[itemId].images[0],
						}}
						key={`viewed-${idx}`}
						resizeMode="cover"
						style={styles.thumb}
					/>
				));
		}
	};

	const textInputBox = () => {
		let displayedTextValue;
		if (editInfoField.includes("/")) {
			const fields = editInfoField.split("/");
			if (userData[fields[0]]) {
				displayedTextValue = userData[fields[0]][fields[1]];
			} else {
				displayedTextValue = "";
			}
		} else {
			displayedTextValue = userData[editInfoField];
		}

		return (
			<Block style={[styles.textInput, styles.shadow]}>
				<Block
					style={{
						borderWidth: 2,
						borderRadius: 15,
						padding: 10,
						borderColor: Theme.COLORS.BLOCK,
					}}
				>
					<TextInput
						style={{
							color: Theme.COLORS.HEADER,
							height: 110,
						}}
						placeholder="Describe your item "
						multiline={true}
						numberOfLines={6}
						maxLength={500}
						onChangeText={(text) => setInfo(text)}
						onBlur={() => setEditInfoField(false)}
						value={displayedTextValue}
						ref={inputBoxRef}
					></TextInput>
				</Block>
			</Block>
		);
	};

	const renderPaymentInformation = () => {
		let paymentOptions = ["PayPal", "Venmo", "WeChat", "Zelle"];
		let existingPaymentOptions = [];
		if (userData.paymentOptions) {
			existingPaymentOptions = Object.keys(
				userData.paymentOptions
			).filter((key) => key !== "default");

			paymentOptions = existingPaymentOptions.concat(
				paymentOptions.filter(
					(option) => !existingPaymentOptions.includes(option)
				)
			);
		}

		const toggleDisplayPaymentOption = (paymentOption) => {
			if (displayedPaymentOption.includes(paymentOption)) {
				const newDisplayedPaymentOption = displayedPaymentOption.filter(
					(option) => option != paymentOption
				);
				setDisplayedPaymentOption(newDisplayedPaymentOption);
			} else {
				const newDisplayedPaymentOption = displayedPaymentOption.concat(
					[paymentOption]
				);
				setDisplayedPaymentOption(newDisplayedPaymentOption);
			}
		};

		const renderPaymentOption = (paymentOption) => {
			if (
				userData.paymentOptions &&
				Object.keys(userData.paymentOptions).includes(paymentOption)
			) {
				const paymentData = userData.paymentOptions[paymentOption];
				let dataType;
				if (paymentData.includes("firebasestorage")) {
					dataType = "image";
				} else {
					dataType = "text";
				}

				return (
					<Block flex key={"Payment-" + paymentOption}>
						<TouchableOpacity
							onPress={() =>
								toggleDisplayPaymentOption(paymentOption)
							}
						>
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
						{displayedPaymentOption.includes(paymentOption) &&
							dataType === "image" && (
								<Block>
									<Image
										source={{ uri: paymentData }}
										style={{
											width: 130,
											height: 130,
											marginHorizontal: theme.SIZES.BASE,
											borderRadius: 15,
										}}
									/>
									<Button
										onlyIcon
										icon="closecircleo"
										iconFamily="AntDesign"
										iconSize={30}
										iconColor={Theme.COLORS.ERROR}
										color={Theme.COLORS.WHITE}
										style={{
											position: "absolute",
											right: 110,
											bottom: 95,
											width: 40,
											height: 40,
										}}
										onPress={() => {
											handleDeletePaymentInfo(
												paymentOption
											);
										}}
									/>
								</Block>
							)}
						{displayedPaymentOption.includes(paymentOption) &&
							dataType === "text" && (
								<Block>
									<TouchableOpacity
										onPress={() =>
											handleEditInfo(
												"paymentOptions/" +
													paymentOption
											)
										}
									>
										<Block
											flex
											middle
											style={{
												backgroundColor:
													Theme.COLORS.BLOCK,
												width: 130,
												height: 130,
												marginHorizontal:
													theme.SIZES.BASE,
												borderRadius: 25,
											}}
										>
											<Text>{paymentData}</Text>
										</Block>
									</TouchableOpacity>
									<Button
										onlyIcon
										icon="closecircleo"
										iconFamily="AntDesign"
										iconSize={30}
										iconColor={Theme.COLORS.ERROR}
										color={Theme.COLORS.WHITE}
										style={{
											position: "absolute",
											right: 110,
											bottom: 95,
											width: 40,
											height: 40,
										}}
										onPress={() => {
											handleDeletePaymentInfo(
												paymentOption
											);
										}}
									/>
								</Block>
							)}
					</Block>
				);
			} else {
				return (
					<Block flex key={"Payment-" + paymentOption}>
						<TouchableOpacity
							onPress={() =>
								toggleDisplayPaymentOption(paymentOption)
							}
						>
							<Image
								source={
									Images.PaymentOptionLogos[paymentOption]
								}
								style={{
									width: 130,
									height: 130,
									marginHorizontal: theme.SIZES.BASE,
									borderRadius: 15,
									opacity: 0.5,
								}}
							/>
						</TouchableOpacity>
						{displayedPaymentOption.includes(paymentOption) && (
							<Block>
								<Button
									color={Theme.COLORS.SECONDARY}
									style={{
										width: 130,
										marginHorizontal: theme.SIZES.BASE,
									}}
									onPress={() =>
										handleEditInfo(
											"paymentOptions/" + paymentOption
										)
									}
								>
									Upload Text
								</Button>
								<Button
									color={Theme.COLORS.SECONDARY}
									style={{
										width: 130,
										marginHorizontal: theme.SIZES.BASE,
									}}
									onPress={() =>
										handleChoosePhoto(
											"paymentOptions/" + paymentOption
										)
									}
								>
									Upload Image
								</Button>
							</Block>
						)}
					</Block>
				);
			}
		};

		return (
			<Block
				style={{
					paddingBottom: HeaderHeight,
				}}
			>
				<ScrollView
					horizontal={true}
					pagingEnabled={true}
					decelerationRate={0}
					scrollEventThrottle={16}
					snapToAlignment="center"
					showsHorizontalScrollIndicator={false}
					snapToInterval={130 + theme.SIZES.BASE * 0.375}
					contentContainerStyle={{
						paddingHorizontal: theme.SIZES.BASE / 2,
					}}
				>
					{paymentOptions.map((paymentOption) =>
						renderPaymentOption(paymentOption)
					)}
				</ScrollView>
			</Block>
		);
	};

	return (
		<Block flex style={styles.profile}>
			<Block flex>
				<ImageBackground
					source={Images.profileBackground}
					style={styles.profileContainer}
					imageStyle={styles.profileBackground}
				>
					<ScrollView
						showsVerticalScrollIndicator={false}
						style={{ width, marginTop: "15%" }}
					>
						<Block flex style={styles.profileCard}>
							<Block middle style={styles.avatarContainer}>
								<TouchableOpacity
									onPress={() => handleChoosePhoto("avatar")}
								>
									<Image
										source={{ uri: userData.avatar }}
										style={styles.avatar}
									/>
								</TouchableOpacity>

								{userData.uw && (
									<Image
										source={require("../assets/imgs/uw.png")}
										style={{
											width: 40,
											height: 25,
											position: "absolute",
											top: 100,
											left: 200,
										}}
										resizeMode="cover"
									/>
								)}
							</Block>
							<Block style={styles.info}>
								<Block
									middle
									row
									space="evenly"
									style={{
										marginTop: 20,
										paddingBottom: 24,
									}}
								>
									<StarRating
										disabled
										rating={parseFloat(
											userData.rating.reduce(
												(a, b) => a + b
											) / userData.rating.length
										)}
										starSize={25}
										starStyle={styles.stars}
										fullStarColor={"#FDCC0D"}
									/>
								</Block>
								<Block row space="between">
									<Block middle>
										<Text
											bold
											size={18}
											color="#525F7F"
											style={{ marginBottom: 4 }}
										>
											{
												userData.postedItems.filter(
													(id) => id !== "default"
												).length
											}
										</Text>
										<Text
											size={12}
											color={Theme.COLORS.TEXT}
										>
											Posted Items
										</Text>
									</Block>
									<Block middle>
										<Text
											bold
											color="#525F7F"
											size={18}
											style={{ marginBottom: 4 }}
										>
											{
												userData.savedItems.filter(
													(id) => id !== "default"
												).length
											}
										</Text>
										<Text
											size={12}
											color={Theme.COLORS.TEXT}
										>
											Saved Items
										</Text>
									</Block>
									<Block middle>
										<Text
											bold
											color="#525F7F"
											size={18}
											style={{ marginBottom: 4 }}
										>
											{parseFloat(
												userData.rating
											).toFixed(1)}
										</Text>
										<Text
											size={12}
											color={Theme.COLORS.TEXT}
										>
											Average Rating
										</Text>
									</Block>
								</Block>
							</Block>
							<Block flex>
								<Block middle style={styles.nameInfo}>
									<Block row>
										<Button
											color="transparent"
											textStyle={{
												color: "#32325D",
												fontWeight: "bold",
												fontSize: 28,
											}}
											style={{
												marginBottom: 0,
												height: 40,
												width: Math.min(
													renderUserName().length *
														18,
													300
												),
											}}
											onPress={() =>
												handleEditInfo("userName")
											}
										>
											{renderUserName()}
										</Button>
										{!otherUser && (
											<Icon
												name="edit"
												family="AntDesing"
												size={20}
												style={{ top: 18 }}
											/>
										)}
									</Block>
									<Block row>
										<Button
											color="transparent"
											textStyle={{
												color: "#32325D",
												fontSize: 16,
												marginTop: 10,
												flexWrap: "wrap",
												flex: 1,
											}}
											style={{
												marginTop: 0,
												height: 30,
												width: Math.min(
													renderLocation().length *
														10,
													300
												),
											}}
											onPress={() =>
												handleEditInfo("location")
											}
										>
											{renderLocation()}
										</Button>
										{!otherUser && (
											<Icon
												name="edit"
												family="AntDesing"
												size={20}
												style={{ top: 10 }}
											/>
										)}
									</Block>
								</Block>
								<Block middle style={{ marginTop: 20 }}>
									<Text
										size={16}
										color="#525F7F"
										style={{ textAlign: "center" }}
									>
										{renderIntro()}
									</Text>
									{!otherUser && (
										<Button
											color="transparent"
											textStyle={{
												color: "#5E72E4",
												fontWeight: "500",
												fontSize: 15,
											}}
											style={{
												marginBottom: 0,
												height: 20,
											}}
											onPress={() =>
												handleEditInfo("intro")
											}
										>
											Edit
										</Button>
									)}
								</Block>
								{!otherUser && (
									<Block>
										<Block
											middle
											style={{
												marginTop: 30,
												marginBottom: 16,
											}}
										>
											<Block style={styles.divider} />
										</Block>
										<Block row space="between">
											<Text
												bold
												size={16}
												color="#525F7F"
												style={{ marginTop: 12 }}
											>
												Saved Items
											</Text>
											<Button
												small
												color="transparent"
												textStyle={{
													color: "#5E72E4",
													fontSize: 12,
													marginLeft: 24,
												}}
												onPress={() =>
													navigation.navigate(
														"SavedTab"
													)
												}
											>
												View all
											</Button>
										</Block>
										<Block
											style={{
												paddingBottom:
													-HeaderHeight * 2,
											}}
										>
											<Block
												row
												space="between"
												style={{ flexWrap: "wrap" }}
											>
												{renderSavedItems()}
											</Block>
										</Block>
										<Block row space="between">
											<Text
												bold
												size={16}
												color="#525F7F"
												style={{ marginTop: 12 }}
											>
												Posted Items
											</Text>
										</Block>
										<Block>
											<ScrollView
												horizontal={true}
												pagingEnabled={true}
												decelerationRate={0}
												scrollEventThrottle={16}
												snapToAlignment="center"
												showsHorizontalScrollIndicator={
													false
												}
												snapToInterval={
													130 +
													theme.SIZES.BASE * 0.375
												}
												contentContainerStyle={{
													paddingHorizontal:
														theme.SIZES.BASE / 2,
												}}
											>
												{renderPostedItems()}
											</ScrollView>
										</Block>
										<Block space="between">
											<Text
												bold
												size={16}
												color="#525F7F"
												style={{ marginTop: 12 }}
											>
												Payment Information
											</Text>
										</Block>
										{renderPaymentInformation()}
										<Block
											center
											style={{
												paddingBottom: HeaderHeight * 2,
											}}
										>
											<Button
												style={{
													width:
														width -
														theme.SIZES.BASE * 6,
													marginTop: 20,
													justifyContent: "center",
													alignItems: "center",
													borderRadius: 30,
												}}
												textStyle={{
													fontSize: 15,
													fontWeight: "600",
												}}
												onPress={async () => {
													logout();
													navigation.navigate(
														"Login"
													);
													alert(
														"You have Logged out"
													);
												}}
											>
												Log Out
											</Button>
										</Block>
									</Block>
								)}
							</Block>
						</Block>
					</ScrollView>
					{editInfoField && textInputBox()}
				</ImageBackground>
			</Block>
		</Block>
	);
}

const styles = StyleSheet.create({
	profile: {
		marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
		// marginBottom: -HeaderHeight * 2,
		flex: 1,
	},
	profileContainer: {
		width: width,
		height: height,
		padding: 0,
		zIndex: 1,
	},
	profileBackground: {
		width: width,
	},
	profileCard: {
		// position: "relative",
		padding: theme.SIZES.BASE,
		marginHorizontal: theme.SIZES.BASE,
		marginTop: 65,
		borderTopLeftRadius: 6,
		borderTopRightRadius: 6,
		backgroundColor: theme.COLORS.WHITE,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 0 },
		shadowRadius: 8,
		shadowOpacity: 0.2,
		zIndex: 2,
	},
	info: {
		paddingHorizontal: 40,
	},
	avatarContainer: {
		position: "relative",
		marginTop: -80,
	},
	avatar: {
		width: 124,
		height: 124,
		borderRadius: 62,
		borderWidth: 0,
		resizeMode: "cover",
	},
	nameInfo: {
		marginTop: 20,
	},
	divider: {
		width: "90%",
		borderWidth: 1,
		borderColor: "#E9ECEF",
	},
	thumb: {
		borderRadius: 4,
		marginVertical: 4,
		alignSelf: "center",
		width: thumbMeasure,
		height: thumbMeasure,
	},
	textInput: {
		fontSize: 15,
		color: Theme.COLORS.HEADER,
		marginVertical: theme.SIZES.BASE / 2,
		backgroundColor: theme.COLORS.WHITE,
		borderRadius: 4,
		borderColor: Theme.COLORS.BORDER,
		height: 150,
		paddingHorizontal: 15,
		bottom: 340,
		paddingVertical: 10,
	},
	shadow: {
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 3,
		shadowOpacity: 0.2,
		elevation: 3,
	},
});

export default Profile;
