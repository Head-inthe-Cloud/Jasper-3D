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
	query,
	limitToLast,
	orderByChild,
} from "firebase/database";
import { Button, Card } from "../components";
import { tabs } from "../constants";
const { width } = Dimensions.get("screen");

// Database

const Home = ({ route, navigation }) => {
	const [allItems, setAllItems] = useState({});
	const [category, setCategory] = useState("All");
	const [searchText, setSearchText] = useState("");
	const [orderBy, setOrderBy] = useState(0);
	const [page, setPage] = useState(1);
	const { uw } = route.params;

	useEffect(() => {
		const db = getDatabase();
		// const allItemsRef = dbRef(db, "allItems/");
		const allItemsRef = query(
			dbRef(db, "allItems"),
			orderByChild("createDate"),
			limitToLast(page * 6)
		);

		const allItemsOffFunction = onValue(allItemsRef, (snapshot) => {
			const newAllItems = snapshot.val();
			setAllItems(newAllItems);
		});

		function cleanUp() {
			allItemsOffFunction();
		}

		return cleanUp;
	}, [page]);

	useEffect(() => {
		if (route.params.searchText) {
			setSearchText(route.params.searchText);
		}
	}, [route.params.searchText]);

	useEffect(() => {
		if (route.params.category) {
			setCategory(route.params.category);
		}
	}, [route.params.category]);

	// Need to add search functionality
	const allItemList = Object.keys(allItems).map((key) => allItems[key]);
	let items = allItemList;
	if (category !== "All") {
		items = allItemList.filter((item) => item.category === category);
	}

	if (searchText.length > 2) {
		items = items.filter(
			(item) =>
				item.title.toLowerCase().includes(searchText.toLowerCase()) ||
				item.description
					.toLowerCase()
					.includes(searchText.toLowerCase())
		);
	}

	// Filter UW Visibility
	if (!uw) {
		items = items.filter((item) => !item.UWvisibility);
	}

	// sort items
	switch (tabs.orderByChoices[orderBy].id) {
		case "latest":
			items = items.sort((first, second) => {
				return (
					Date.parse(second.createDate) - Date.parse(first.createDate)
				);
			});
			break;
		case "oldest":
			items = items.sort((first, second) => {
				return (
					Date.parse(first.createDate) - Date.parse(second.createDate)
				);
			});
			break;
		case "price_high":
			items = items.sort((first, second) => {
				return parseFloat(second.price) - parseFloat(first.price);
			});
			break;
		case "price_low":
			items = items.sort((first, second) => {
				return parseFloat(first.price) - parseFloat(second.price);
			});
			break;
	}

	const toggleChangeOrder = () => {
		setOrderBy((orderBy + 1) % tabs.orderByChoices.length);
	};

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

	const isCloseToBottom = (event) => {
		const paddingToBottom = 20;
		return (
			event.layoutMeasurement.height + event.contentOffset.y >=
			event.contentSize.height - paddingToBottom
		);
	};

	return (
		<Block flex center style={styles.home}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.articles}
				onScroll={(event) => {
					// Load more items as you get to the bottom
					if (isCloseToBottom(event.nativeEvent)) {
						setPage(page + 1);
					}
				}}
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
								<Text h4>
									{tabs.orderByChoices[orderBy].title}
								</Text>
								<Button
									onlyIcon
									icon="filter"
									iconFamily="AntDesign"
									iconSize={30}
									iconColor={theme.COLORS.BLACK}
									color={"transparent"}
									style={{
										width: 30,
										height: 30,
									}}
									onPress={() => toggleChangeOrder()}
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
});

export default Home;
