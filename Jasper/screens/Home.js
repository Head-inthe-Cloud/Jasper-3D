import { useState, useEffect } from "react";
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
	const [category, setCategory] = useState("All");
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		const db = getDatabase();
		const allItemsRef = dbRef(db, "allItems/");

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
	const allItemList = Object.keys(allItems).map((key) => allItems[key]);
	let items = allItemList;
	if (category !== "All") {
		items = allItemList.filter((item) => item.category === category);
	}
	items = items.filter(
		(item) =>
			item.title.toLowerCase().includes(searchText.toLowerCase()) ||
			item.description.toLowerCase().includes(searchText.toLowerCase())
	);

	// sort items by date
	items = items.sort((first, second) => {
		return second.createDate - first.createDate;
	});

	const renderItems = () => {
		let result = [];
		for (let i = 0; i < Math.ceil(items.length / 2); i++) {
			const card1 = () => {
				return (
					<Card
						item={items[i * 2]}
						style={{ marginRight: theme.SIZES.BASE }}
					/>
				);
			};

			const card2 = () => {
				if (i * 2 + 1 >= items.length) {
					return null;
				} else {
					return <Card item={items[i * 2 + 1]} />;
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
								style={{ paddingTop: 7, right: 10 }}
							>
								<Text h4>Latest Posts</Text>
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
});

export default Home;
