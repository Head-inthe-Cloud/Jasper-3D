import React, { useEffect, useState } from "react";
import { withNavigation } from "@react-navigation/compat";
import {
	TouchableOpacity,
	StyleSheet,
	Platform,
	Dimensions,
} from "react-native";
import { Button, Block, NavBar, Text, theme } from "galio-framework";
import {
	getDatabase,
	ref as dbRef,
	set as firebaseSet,
} from "firebase/database";

import Icon from "./Icon";
import Input from "./Input";
import Tabs from "./Tabs";
import Theme from "../constants/Theme";

const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
	Platform.OS === "ios" &&
	(height === 812 || width === 812 || height === 896 || width === 896);

function Header(props) {

	let initSaved = false;
	if (props.title == "Detail") {
		const { route, userData } = props;
		const itemId = route.params.itemId;
		initSaved = userData.savedItems.includes(itemId);
	}

	const [saved, setSaved] = useState(initSaved);

	const ChatButton = ({ isWhite, style, navigation }) => (
		<TouchableOpacity
			style={[styles.button, style]}
			onPress={() => navigation.navigate("Pro")}
		>
			<Icon
				family="MaterialIcons"
				size={16}
				name="chat-bubble"
				color={Theme.COLORS[isWhite ? "WHITE" : "ICON"]}
			/>
			<Block middle style={styles.notify} />
		</TouchableOpacity>
	);

	const HeartButton = ({ isWhite, style, navigation, saved }) => (
		<TouchableOpacity
			style={[styles.button, style]}
			onPress={() => toggleSaveButton()}
		>
			<Icon
				family="AntDesign"
				size={18}
				name="heart"
				color={
					Theme.COLORS[saved ? "ERROR" : isWhite ? "WHITE" : "ICON"]
				}
			/>
		</TouchableOpacity>
	);
	const handleLeftPress = () => {
		const { back, navigation } = props;
		return back ? navigation.goBack() : null;
	};

	const toggleSaveButton = () => {
		const { route, userData } = props;
		const itemId = route.params.itemId;
		const userId = route.params.userId;

		const db = getDatabase();
		const userRef = dbRef(db, "users/" + userId);

		let newUserData = userData;
		if (saved) {
			newUserData.savedItems = newUserData.savedItems.filter(
				(savedItemId) => savedItemId != itemId
			);
			setSaved(false);
		} else {
			newUserData.savedItems.push(itemId);
			setSaved(true);
		}
		firebaseSet(userRef, newUserData);
	};

	const renderRight = () => {
		const { white, title, navigation } = props;

		if (title === "Title") {
			return [
				<ChatButton
					key="chat-title"
					navigation={navigation}
					isWhite={white}
				/>,
				<HeartButton
					key="basket-title"
					navigation={navigation}
					isWhite={white}
				/>,
			];
		}

		switch (title) {
			case "Detail":
				return [
					<HeartButton
						key="basket-categories"
						navigation={navigation}
						saved={saved}
					/>,
				];
			default:
				break;
		}
	};

	const renderSearch = () => {
		const { title } = props;
		const searchPlaceHolder = () => {
			if (title == "Message Center") {
				return "Search for chat history";
			} else {
				return "What are you looking for?";
			}
		};
		const { navigation } = props;
		
		return (
			<Input
				right
				color="black"
				style={styles.search}
				placeholder={searchPlaceHolder()}
				placeholderTextColor={"#8898AA"}
				iconContent={
					<Icon
						size={16}
						color={theme.COLORS.MUTED}
						name="search-zoom-in"
						family="ArgonExtra"
					/>
				}
				onChangeText={(newText) => navigation.navigate({name:'Home', params: {searchText: newText}, merge: true})}
			/>
		);
	};
	const renderOptions = () => {
		const { navigation, optionLeft, optionRight } = props;

		return (
			<Block row style={styles.options}>
				<Button
					shadowless
					style={[styles.tab, styles.divider]}
					onPress={() => navigation.navigate("Pro")}
				>
					<Block row middle>
						<Icon
							name="diamond"
							family="ArgonExtra"
							style={{ paddingRight: 8 }}
							color={Theme.COLORS.ICON}
						/>
						<Text size={16} style={styles.tabTitle}>
							{optionLeft || "Beauty"}
						</Text>
					</Block>
				</Button>
				<Button
					shadowless
					style={styles.tab}
					onPress={() => navigation.navigate("Pro")}
				>
					<Block row middle>
						<Icon
							size={16}
							name="bag-17"
							family="ArgonExtra"
							style={{ paddingRight: 8 }}
							color={Theme.COLORS.ICON}
						/>
						<Text size={16} style={styles.tabTitle}>
							{optionRight || "Fashion"}
						</Text>
					</Block>
				</Button>
			</Block>
		);
	};
	const renderTabs = () => {
		const { tabs, tabIndex, navigation } = props;
		const defaultTab = tabs && tabs[0] && tabs[0].id;

		if (!tabs) return null;

		return (
			<Tabs
				data={tabs || []}
				initialIndex={tabIndex || defaultTab}
				onChange={(id) =>  navigation.navigate({name:'Home', params: {category: id}, merge: true})}
			/>
		);
	};
	const renderHeader = () => {
		const { search, options, tabs } = props;
		if (search || tabs || options) {
			return (
				<Block center>
					{search ? renderSearch() : null}
					{options ? renderOptions() : null}
					{tabs ? renderTabs() : null}
				</Block>
			);
		}
	};
	const {
		back,
		title,
		white,
		transparent,
		bgColor,
		iconColor,
		titleColor,
		navigation,
		...extraProps
	} = props;

	const noShadow = [
		"Search",
		"Categories",
		"Deals",
		"Pro",
		"Profile",
	].includes(title);
	const headerStyles = [
		!noShadow ? styles.shadow : null,
		transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
	];

	const navbarStyles = [
		styles.navbar,
		bgColor && { backgroundColor: bgColor },
	];

	const navbar = () => {
		if (title == "Home") {
			return (
				<Block style={{ paddingVertical: theme.SIZES.BASE * 1.5 }} />
			);
		} else {
			return (
				<NavBar
					back={false}
					title={title}
					style={navbarStyles}
					transparent={transparent}
					right={renderRight()}
					rightStyle={{ alignItems: "center" }}
					left={
						<Icon
							name={back ? "chevron-left" : null}
							family="entypo"
							size={20}
							onPress={handleLeftPress}
							color={
								iconColor ||
								(white ? Theme.COLORS.WHITE : Theme.COLORS.ICON)
							}
							style={{ marginTop: 2 }}
						/>
					}
					leftStyle={{ paddingVertical: 12, flex: 0.2 }}
					titleStyle={[
						styles.title,
						{
							color: Theme.COLORS[white ? "WHITE" : "HEADER"],
						},
						titleColor && { color: titleColor },
					]}
					{...extraProps}
				/>
			);
		}
	};
	return (
		<Block style={headerStyles}>
			{navbar()}
			{renderHeader()}
		</Block>
	);
}

const styles = StyleSheet.create({
	button: {
		padding: 12,
		position: "relative",
	},
	title: {
		width: "100%",
		fontSize: 16,
		fontWeight: "bold",
	},
	navbar: {
		// paddingVertical: 0,
		paddingBottom: theme.SIZES.BASE * 1.5,
		paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
		zIndex: 5,
	},
	shadow: {
		backgroundColor: theme.COLORS.WHITE,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 3,
		shadowOpacity: 0.2,
		elevation: 3,
	},
	notify: {
		backgroundColor: Theme.COLORS.LABEL,
		borderRadius: 4,
		height: theme.SIZES.BASE / 2,
		width: theme.SIZES.BASE / 2,
		position: "absolute",
		top: 9,
		right: 12,
	},
	header: {
		backgroundColor: theme.COLORS.WHITE,
	},
	divider: {
		borderRightWidth: 0.3,
		borderRightColor: theme.COLORS.ICON,
	},
	search: {
		height: 48,
		width: width - 32,
		marginHorizontal: 16,
		borderWidth: 1,
		borderRadius: 3,
		borderColor: Theme.COLORS.BORDER,
	},
	options: {
		marginBottom: 24,
		marginTop: 10,
		elevation: 4,
	},
	tab: {
		backgroundColor: theme.COLORS.TRANSPARENT,
		width: width * 0.35,
		borderRadius: 0,
		borderWidth: 0,
		height: 24,
		elevation: 0,
	},
	tabTitle: {
		lineHeight: 19,
		fontWeight: "400",
		color: Theme.COLORS.HEADER,
	},
});

export default withNavigation(Header);
