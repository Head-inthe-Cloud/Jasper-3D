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
	const { allItems, userId } = route.params;

	const [userData, setUserData] = useState();
	const [editInfoField, setEditInfoField] = useState(false);

	const inputBoxRef = useRef(null);

	useEffect(() => {
		const db = getDatabase();
		const userDataRef = dbRef(db, "users/" + userId);

		// Upload temp data to database
		// ***************************f**********
		// firebaseSet(usersRef, users);
		// firebaseSet(allItemsRef, items);

		// *************************************

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
	const userDataRef = dbRef(db, "users/" + userId);

	const handleEditInfo = (field) => {
		setEditInfoField(field);
	};

	const setInfo = (text) => {
		let newUserData = { ...userData };
		newUserData[editInfoField] = text;
		firebaseSet(userDataRef, newUserData);
	};

	const handleChoosePhoto = async () => {
		// console.warn("Choosing Photo");
		const options = {
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
			base64: true,
		};
		const result = await ImagePicker.launchImageLibraryAsync(options);
		let newUserData = { ...userData };
		newUserData.avatar = "data:image/jpeg;base64," + result.base64;
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
						style={{ width, marginTop: "25%" }}
					>
						<Block flex style={styles.profileCard}>
							<Block middle style={styles.avatarContainer}>
								<TouchableOpacity
									onPress={() => handleChoosePhoto()}
								>
									<Image
										source={{ uri: userData.avatar }}
										style={styles.avatar}
									/>
								</TouchableOpacity>
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
										rating={parseFloat(userData.rating)}
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
											{userData.postedItems.length}
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
											{userData.savedItems.length}
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
												flexWrap: "warp",
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
										<Icon
											name="edit"
											family="AntDesing"
											size={20}
											style={{ top: 18 }}
										/>
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
										<Icon
											name="edit"
											family="AntDesing"
											size={20}
											style={{ top: 10 }}
										/>
									</Block>
								</Block>
								<Block
									middle
									style={{
										marginTop: 30,
										marginBottom: 16,
									}}
								>
									<Block style={styles.divider} />
								</Block>
								<Block middle>
									<Text
										size={16}
										color="#525F7F"
										style={{ textAlign: "center" }}
									>
										{renderIntro()}
									</Text>
									<Button
										color="transparent"
										textStyle={{
											color: "#5E72E4",
											fontWeight: "500",
											fontSize: 15,
										}}
										style={{ marginBottom: 0, height: 20 }}
										onPress={() => handleEditInfo("intro")}
									>
										Edit
									</Button>
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
											navigation.navigate("SavedTab")
										}
									>
										View all
									</Button>
								</Block>
								<Block
									style={{
										paddingBottom: -HeaderHeight * 2,
									}}
								>
									<Block
										row
										space="between"
										style={{ flexWrap: "wrap" }}
									>
										{userData.savedItems
											.slice(0, 3)
											.map((itemId, idx) => (
												<Image
													source={{
														uri: allItems[itemId]
															.images[0],
													}}
													key={`viewed-${idx}`}
													resizeMode="cover"
													style={styles.thumb}
												/>
											))}
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
								<Block
									style={{
										paddingBottom: HeaderHeight * 2,
									}}
								>
									<ScrollView
										horizontal={true}
										pagingEnabled={true}
										decelerationRate={0}
										scrollEventThrottle={16}
										snapToAlignment="center"
										showsHorizontalScrollIndicator={false}
										snapToInterval={
											130 + theme.SIZES.BASE * 0.375
										}
										contentContainerStyle={{
											paddingHorizontal:
												theme.SIZES.BASE / 2,
										}}
									>
										{userData.postedItems.map(
											(itemId, idx) => (
												<Block
													flex
													row
													key={"posted-" + idx}
												>
													{/* <Image
														source={{
															uri: allItems[
																itemId
															].images[0],
														}}
														style={{
															width: 130,
															height: 130,
															marginHorizontal:
																theme.SIZES
																	.BASE,
															borderRadius: 15,
														}}
													/> */}
													<Card
														item={allItems[itemId]}
														style={{
															width: 150,
															marginHorizontal:
																theme.SIZES
																	.BASE,
														}}
													/>
												</Block>
											)
										)}
									</ScrollView>
								</Block>
							</Block>
						</Block>
					</ScrollView>
					{editInfoField && (
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
									value={userData[editInfoField]}
									ref={inputBoxRef}
								></TextInput>
							</Block>
						</Block>
					)}
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
		height: height / 2,
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
