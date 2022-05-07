import React from "react";

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
import { Theme, } from "../constants/";
import { items } from "../constants/mockData";
import Tabs from "../components/Tabs";
import tabs from "../constants/tabs";

// Libraries
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

const Post = (props) => {
	const [negotiableSwitch, setNegotiableSwitch] = React.useState(false);
	const [dropOffSwitch, setDropOffSwitch] = React.useState(false);
	const [UWVisibleSwitch, setUWVisibleSwitch] = React.useState(false);
	const [descriptionInput, setDescriptionInput] = React.useState("");
	const [imgUris, setImgUris] = React.useState([]);
	const iconSize = 25;
	const iconBoxSize = 20;
	const { navigation } = props;
	const handleChoosePhoto = async () => {
		// console.warn("Choosing Photo");
		const options = {
			maxWidth: 300,
			maxHeight: 300,
			mediaType: "photo",
		};
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		setImgUris(imgUris.concat([result.uri]));
	};

	const categoryTabs = () => {
		const defaultTab = tabs && tabs.categories && tabs.categories[0].id;
		return (
			<Block flex alignItems={"center"}>
				<Tabs
					data={tabs.categories || []}
					initialIndex={defaultTab}
					// onChange={(id) => navigation.setParams({ tabId: id })}
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
					// onChange={(id) => navigation.setParams({ tabId: id })}
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
					// onChange={(id) => navigation.setParams({ tabId: id })}
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
							/>
						</Block>
						<Block>
							<Text style={styles.title}>Add Description</Text>
							<TextInput
								style={[styles.textInput, styles.shadow]}
								placeholder="    Describe your item "
								multiline={true}
								numberOfLines={6}
								maxLength={500}
								onChangeText={(text) =>
									setDescriptionInput(text)
								}
								value={descriptionInput}
							></TextInput>
						</Block>
						<Block style={styles.photoButton}>
							<Text style={styles.title}>Photos</Text>
							<Button onPress={() => handleChoosePhoto()}>
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
								{imgUris.map((imgUri) => (
									<Block
										flex
										row
										style={{ marginTop: 30 }}
										key={imgUri}
									>
										<Image
											source={{ uri: imgUri }}
											style={{
												width: 130,
												height: 130,
												marginHorizontal:
													theme.SIZES.BASE,
												borderRadius: 15,
											}}
										/>
										<TouchableOpacity
											onPress={() =>
												console.warn("Delete Image")
											}
											style={{
												position: "absolute",
												right: 5,
												bottom: 110,
											}}
										>
											<Icon
												name="closecircleo"
												family="AntDesign"
												size={30}
												color={Theme.COLORS.ERROR}
											></Icon>
										</TouchableOpacity>
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
								onValueChange={() => setNegotiableSwitch(true)}
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
								onValueChange={() => setDropOffSwitch(true)}
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
								onValueChange={() => setUWVisibleSwitch(true)}
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
							onPress={() => navigation.navigate("PostDone")}
						>
							Post Item
						</Button>
					</Block>
				</Block>
			</ScrollView>
		</Block>
	);
};

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
