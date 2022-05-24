import { useState, useEffect } from "react";

//galio
import { Block, Text, theme } from "galio-framework";
import {
	Dimensions,
	ImageBackground,
	ScrollView,
	StyleSheet,
} from "react-native";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
//argon
import { Images, Theme } from "../constants";

import { Card } from "../components";
import { TouchableOpacity } from "react-native-gesture-handler";
import Loading from "./Loading";

const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

function Saved({ route, navigation }) {
	const { allItems, userId } = route.params;
	const [userData, setUserData] = useState();

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

	// Page protector
	if (!userData) {
		return <Loading />;
	}
	const savedItemIds = userData.savedItems;

	const renderSavedItems = () => {
		if (savedItemIds.length === 1 && savedItemIds[0] === "default") {
			<Text>
				Seems like you haven't save any item yet! Click the heart icon
				on the top right of the detail page to save your favorite items!
			</Text>;
		} else {
			return savedItemIds
				.filter(
					(id) =>
						id !== "default" && Object.keys(allItems).includes(id)
				)
				.map((itemId) => (
					<Card
						item={allItems[itemId]}
						horizontal
						key={"saved_" + itemId}
						userData={userData}
					/>
				));
		}
	};
	return (
		<Block flex center>
			<ScrollView>
				<Block flex style={styles.group}>
					<Block flex>
						<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
							{renderSavedItems()}
							<Block flex card shadow style={styles.category}>
								<ImageBackground
									source={Images.CherryBlossom}
									style={[
										styles.imageBlock,
										{
											width: width - theme.SIZES.BASE * 2,
											height: 252,
										},
									]}
									imageStyle={{
										width: width - theme.SIZES.BASE * 2,
										height: 252,
									}}
								>
									<TouchableOpacity
										onPress={() =>
											navigation.navigate("Home")
										}
										style={styles.categoryTitle}
									>
										<Text
											size={18}
											bold
											color={theme.COLORS.WHITE}
										>
											Explore More Items
										</Text>
									</TouchableOpacity>
								</ImageBackground>
							</Block>
						</Block>
					</Block>
				</Block>
			</ScrollView>
		</Block>
	);
}

const styles = StyleSheet.create({
	title: {
		paddingBottom: theme.SIZES.BASE,
		paddingHorizontal: theme.SIZES.BASE * 2,
		marginTop: 44,
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
	productPrice: {
		paddingTop: theme.SIZES.BASE,
		paddingBottom: theme.SIZES.BASE / 2,
	},
	productDescription: {
		paddingTop: theme.SIZES.BASE,
	},
});

export default Saved;
