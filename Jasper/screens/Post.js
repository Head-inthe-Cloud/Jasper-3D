import { useEffect, useState } from "react";

//galio
import { Block, Text, theme } from "galio-framework";
import {
	Dimensions,
	Image,
	View,
	ScrollView,
	StyleSheet,
	TextInput,
} from "react-native";

// Components & Constants
import { Button, Icon, Input, Switch } from "../components/";
import { Theme } from "../constants/";
import { items } from "../constants/mockData";
import Tabs from "../components/Tabs";
import tabs from "../constants/tabs";

// Database
// import {
// 	ref as storageRef,
// 	getStorage,
// 	uploadBytes,
// 	getDownloadURL,
// } from "firebase/storage";
import {
	ref as dbRef,
	getDatabase,
	push as firebasePush,
	get as firebaseGet,
	set as firebaseSet,
} from "firebase/database";

import {
	getDownloadURL,
	getStorage,
	ref as storageRef,
	uploadBytes,
} from "firebase/storage";

// Libraries
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { async } from "@firebase/util";

const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

function Post({ route, navigation }) {
	const { userId } = route.params;

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [mediaData, setMediaData] = useState([]);
	const [category, setCategory] = useState(tabs.categories[0].id);
	const [condition, setCondition] = useState(tabs.conditions[0].id);
	const [location, setLocation] = useState(tabs.pickUpLocations[0].id);
	const [negotiableSwitch, setNegotiableSwitch] = useState(false);
	const [dropOffSwitch, setDropOffSwitch] = useState(false);
	const [UWVisibleSwitch, setUWVisibleSwitch] = useState(false);
	const iconSize = 25;
	const iconBoxSize = 20;

	const toggleSwitch = (switchName) => {
		switch (switchName) {
			case "dropOff":
				setDropOffSwitch(!dropOffSwitch);
				break;
			case "negotiable":
				setNegotiableSwitch(!negotiableSwitch);
				break;
			case "uw":
				setUWVisibleSwitch(!UWVisibleSwitch);
				break;
			default:
				break;
		}
	};

	const handleChooseImage = async () => {
		const options = {
			maxWidth: 300,
			maxHeight: 300,
			mediaType: "photo",
			base64: true,
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		};
		const result = await ImagePicker.launchImageLibraryAsync(options);

		setMediaData(
			mediaData.concat([
				{
					uri: result.uri,
					data: "data:image/jpeg;base64," + result.base64,
				},
			])
		);
	};

	const handleDeletePhoto = (idx) => {
		let newMediaData = [...mediaData].filter((element, i) => i !== idx);
		setMediaData(newMediaData);
	};

	const checkCompletion = () => {
		if (title !== "" && description !== "" && price !== "") {
			return true;
		} else {
			return false;
		}
	};

	const handleSubmit = async () => {
		if (checkCompletion()) {
			let today = new Date(Date.now());
			let newItem = {
				itemId: "",
				sellerId: userId,
				createDate: today.toISOString().slice(0, -14),
				condition: condition,
				category: category,
				title: title,
				description: description,
				images: mediaData[0].data,
				price: price,
				pickUpLocation: location,
				dropOff: dropOffSwitch,
				UWvisibility: UWVisibleSwitch,
				negotiable: negotiableSwitch,
			};

			const db = getDatabase();
			const allItemsRef = dbRef(db, "allItems");
			const itemId = firebasePush(allItemsRef, newItem).key;

			// The following code attempts to store data at firebase storage
			// ****************************************************
			const storage = getStorage();
			const remoteUrls = await Promise.all(
				mediaData.map(async (data) => {
					const uriSplit = data.uri.split("/");
					const imgName = uriSplit[uriSplit.length - 1];
					const itemImgRef = storageRef(
						storage,
						"itemImages/" + itemId + "/" + imgName
					);
					const response = await fetch(data.uri);
					const blob = await response.blob();
					await uploadBytes(itemImgRef, blob).catch((error) => {
						console.warn(error);
					});
					const remoteUrl = await getDownloadURL(itemImgRef);
					return remoteUrl;
				})
			).catch((error) => {
				console.warn(error);
			});

			// Update item info
			newItem.images = remoteUrls;
			// ****************************************************
			newItem.itemId = itemId;
			const itemRef = dbRef(db, "allItems/" + itemId);
			firebaseSet(itemRef, newItem);

			const userRef = dbRef(db, "users/" + userId);
			firebaseGet(userRef).then((snapshot) => {
				if (snapshot.exists()) {
					let newUserData = snapshot.val();
					const newPostedItems = [...newUserData.postedItems, itemId];
					newUserData.postedItems = newPostedItems;
					firebaseSet(userRef, newUserData);
				}
			});
			
			navigation.navigate("PostDone");
			console.warn("Upload success");
		} else {
			// Temp
			console.warn("Information incomplete");
		}
	};

	const categoryTabs = () => {
		const defaultTab = tabs && tabs.categories && tabs.categories[0].id;
		return (
			<Block flex alignItems={"center"}>
				<Tabs
					data={tabs.categories || []}
					initialIndex={defaultTab}
					onChange={(id) => setCategory(id)}
				/>
			</Block>
		);
	};

	const conditionTabs = () => {
		const defaultTab = tabs && tabs.conditions && tabs.conditions[0].id;
		return (
			<Block flex alignItems={"center"}>
				<Tabs
					data={tabs.conditions || []}
					initialIndex={defaultTab}
					onChange={(id) => setCondition(id)}
				/>
			</Block>
		);
	};

	const locationTabs = () => {
		const defaultTab =
			tabs && tabs.pickUpLocations && tabs.pickUpLocations[0].id;
		return (
			<Block flex alignItems={"center"}>
				<Tabs
					data={tabs.pickUpLocations || []}
					initialIndex={defaultTab}
					onChange={(id) => setLocation(id)}
				/>
			</Block>
		);
	};

	return (
		<Block flex>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Block flex style={styles.group}>
					<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
						<Block>
							<Text style={styles.title}>Add Title</Text>
							<Input
								placeholder="Name of your item"
								iconContent={<Block />}
								style={{ marginBottom: 10 }}
								onChangeText={(text) => setTitle(text)}
							/>
						</Block>
						<Block>
							<Text style={styles.title}>Add Description</Text>
							<Block style={[styles.textInput, styles.shadow]}>
								<TextInput
									style={{ color: Theme.COLORS.HEADER }}
									placeholder="Describe your item "
									multiline={true}
									numberOfLines={6}
									maxLength={500}
									onChangeText={(text) =>
										setDescription(text)
									}
									value={description}
								></TextInput>
							</Block>
						</Block>
						<Block style={styles.photoButton}>
							<Text style={styles.title}>Photos</Text>
							<Button onPress={() => handleChooseImage()}>
								Choose Photo
							</Button>
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
							>
								{mediaData.map((data, idx) => (
									<Block
										flex
										row
										style={{ marginTop: 30 }}
										key={data.uri}
									>
										<Image
											source={{ uri: data.uri }}
											style={{
												width: 130,
												height: 130,
												marginHorizontal:
													theme.SIZES.BASE,
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
												handleDeletePhoto(idx);
											}}
										/>
									</Block>
								))}
							</ScrollView>
						</Block>
					</Block>
					<View style={styles.separation}></View>
					<Block
						style={{
							paddingTop: 20,
							paddingHorizontal: theme.SIZES.BASE,
						}}
					>
						<Block flex>
							<Block flex row style={styles.tags}>
								<Icon
									name="category"
									family="MaterialIcons"
									size={iconSize - 7}
									style={{ right: 3 }}
								/>
								<Text style={styles.rightItem}>Category</Text>
							</Block>
							{categoryTabs()}
						</Block>
						<Block flex>
							<Block flex row style={styles.tags}>
								<Icon
									name="tool"
									family="AntDesign"
									size={iconSize - 7}
									style={{ right: 3 }}
								/>
								<Text style={styles.rightItem}>Condition</Text>
							</Block>
							{conditionTabs()}
						</Block>
						<Block flex>
							<Block flex row style={styles.tags}>
								<Icon
									name="location-pin"
									family="Entypo"
									size={iconSize - 7}
									style={{ right: 3 }}
								/>
								<Text style={styles.rightItem}>
									Pick up location
								</Text>
							</Block>

							{locationTabs()}
						</Block>
					</Block>
					<Block
						style={{
							paddingHorizontal: theme.SIZES.BASE,
							marginBottom: theme.SIZES.BASE,
						}}
					>
						<Block
							style={styles.horizRow}
							flex
							row
							alignItems={"center"}
						>
							<Block flex row alignItems={"center"}>
								<Block width={iconBoxSize}>
									<Icon
										name="dollar"
										family="Foundation"
										size={iconSize}
									/>
								</Block>
								<Text style={styles.rightItem}>{"Price"}</Text>
							</Block>
							<Input
								left
								type={"numeric"}
								rounded={true}
								borderless={false}
								placeholder={""}
								iconContent={
									<Icon
										name="dollar"
										family="Foundation"
										size={iconSize}
										color={Theme.COLORS.GRAY}
									/>
								}
								style={{ width: 100 }}
								fontSize={15}
								fontWeight={"600"}
								onChangeText={(text) => setPrice(text)}
							/>
						</Block>
						<Block
							style={styles.horizRow}
							flex
							row
							alignItems={"center"}
						>
							<Block flex row alignItems={"center"}>
								<Block width={iconBoxSize}>
									<Icon
										name="creative-commons-noncommercial-us"
										family="Entypo"
										size={iconSize - 5}
										style={{ right: 5 }}
									/>
								</Block>
								<Text style={styles.rightItem}>
									{"Make price non-negotiable"}
								</Text>
							</Block>
							<Switch
								value={negotiableSwitch}
								onValueChange={() => toggleSwitch("negotiable")}
							/>
						</Block>

						<Block
							style={styles.horizRow}
							flex
							row
							alignItems={"center"}
						>
							<Block flex row alignItems={"center"}>
								<Block width={iconBoxSize}>
									<Icon
										name="truck"
										family="Feather"
										size={iconSize - 7}
										style={{ right: 3 }}
									/>
								</Block>
								<Text style={styles.rightItem}>
									{"Drop off"}
								</Text>
							</Block>
							<Switch
								value={dropOffSwitch}
								onValueChange={() => toggleSwitch("dropOff")}
							/>
						</Block>
						<Block
							style={styles.horizRow}
							flex
							row
							alignItems={"center"}
						>
							<Block flex row alignItems={"center"}>
								<Block width={iconBoxSize}>
									<Image
										source={require("../assets/imgs/uw.png")}
										style={{
											width: 18,
											height: 10,
											right: 4,
										}}
									/>
								</Block>
								<Text style={styles.rightItem}>
									{"Only visible to UW users"}
								</Text>
							</Block>
							<Switch
								value={UWVisibleSwitch}
								onValueChange={() => toggleSwitch("uw")}
							/>
						</Block>
					</Block>
					<Block flex center style={{ marginBottom: 50 }}>
						<Button
							textStyle={{ fontSize: 15, fontWeight: "600" }}
							style={{
								width: width - theme.SIZES.BASE * 2,
								borderRadius: 30,
							}}
							onPress={() => handleSubmit()}
						>
							Post Item
						</Button>
					</Block>
				</Block>
			</ScrollView>
		</Block>
	);
}

const styles = StyleSheet.create({
	title: {
		fontWeight: "600",
		fontSize: 18,
		color: Theme.COLORS.HEADER,
	},
	group: {
		paddingTop: theme.SIZES.BASE,
	},
	albumThumb: {
		borderRadius: 4,
		marginVertical: 4,
		alignSelf: "center",
		width: thumbMeasure,
		height: thumbMeasure,
	},
	buttonRow: {
		paddingBottom: 10,
	},
	tags: {
		paddingTop: 5,
		paddingBottom: 10,
		marginTop: 10,
	},
	horizRow: {
		paddingBottom: 10,
		height: 70,
		justifyContent: "space-around",
	},
	imageBlock: {
		overflow: "hidden",
		borderRadius: 4,
	},
	oneRow: {
		paddingBottom: 10,
	},
	photoButton: {
		paddingVertical: 15,
	},
	productImage: {
		width: cardWidth - theme.SIZES.BASE,
		height: cardWidth - theme.SIZES.BASE,
		borderRadius: 3,
	},
	productPrice: {
		paddingTop: theme.SIZES.BASE,
		paddingBottom: theme.SIZES.BASE / 2,
	},
	productDescription: {
		paddingTop: theme.SIZES.BASE,
		// paddingBottom: theme.SIZES.BASE * 2,
	},
	rightItem: {
		paddingRight: 25,
		fontSize: 17,
		fontWeight: "600",
	},
	separation: {
		borderBottomColor: "#D3D3D3",
		borderBottomWidth: 2,
		paddingTop: 10,
	},
	submitButtons: {
		borderRadius: 30,
	},
	textInput: {
		fontSize: 15,
		color: Theme.COLORS.HEADER,
		marginVertical: theme.SIZES.BASE / 2,
		backgroundColor: theme.COLORS.WHITE,
		borderRadius: 4,
		borderColor: Theme.COLORS.BORDER,
		height: 100,
		paddingHorizontal: 15,
	},
	shadow: {
		shadowColor: Theme.COLORS.BLACK,
		shadowOffset: { width: 0, height: 1 },
		shadowRadius: 2,
		shadowOpacity: 0.2,
		elevation: 0,
	},
});

export default Post;
