import {useState, useEffect} from "react";
import {
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import {
	getDatabase,
	ref as dbRef,
	onValue,
	set as firebaseSet,
} from "firebase/database";
import { Card, Icon } from "../components";
const { width } = Dimensions.get("screen");

// Database

const Home = ({ route, navigation }) => {
	const [allItems, setAllItems] = useState({});

	useEffect(() => {
		const db = getDatabase();
		const allItemsRef = dbRef(db, "allItems");

		const allItemsOffFunction = onValue(allItemsRef, (snapshot) => {
			const newAllItems = snapshot.val();
			setAllItems(newAllItems);
		});

		function cleanUp() {
			allItemsOffFunction();
		}

		return cleanUp;
	}, []);

	// Need to add search functionality

	const items = allItems;


	// sort items by date
	let datePairs;
	if(items){
		datePairs = Object.keys(items).map((key) => [
			key,
			items[key].createDate,
		]);
		datePairs.sort((first, second) => {
			return second[1] - first[1];
		});
	}else{
		datePairs=[];
	}
	const sortedItemKeys = datePairs.map((pair) => pair[0]);

	const renderItems = () => {
		let result = [];
		for (let i = 0; i < Math.ceil(sortedItemKeys.length / 2); i++) {
			const card1 = () => {
				return (
					<Card
						item={items[sortedItemKeys[i * 2]]}
						style={{ marginRight: theme.SIZES.BASE }}
					/>
				);
			};

			const card2 = () => {
				if (i * 2 + 1 >= sortedItemKeys.length) {
					return null;
				} else {
					return <Card item={items[sortedItemKeys[i * 2 + 1]]} />;
				}
			};

			result.push(
				<Block flex row key={"Home_row_" + i}>
					{card1()}
					{card2()}
				</Block>
			);
		}
		return result;
	};

	return (
		<Block flex center style={styles.home}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.articles}
			>
				<Block flex>
					<Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
						<Block style={styles.rows}>
							<Block
								row
								middle
								space="between"
								style={{ paddingTop: 7 }}
							>
								<Text h4 style={styles.title}>
									Latest Posts
								</Text>
								<Icon
									name="chevron-right"
									family="entypo"
									style={{ paddingRight: 5 }}
								/>
							</Block>
						</Block>
					</Block>
					{renderItems()}
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
});

export default Home;
