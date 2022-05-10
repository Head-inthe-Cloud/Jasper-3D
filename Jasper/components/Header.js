import React from "react";
import { withNavigation } from "@react-navigation/compat";
import {
	TouchableOpacity,
	StyleSheet,
	Platform,
	Dimensions,
} from "react-native";
import { Button, Block, NavBar, Text, theme } from "galio-framework";

import Icon from "./Icon";
import Input from "./Input";
import Tabs from "./Tabs";
import Theme from "../constants/Theme";

const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
	Platform.OS === "ios" &&
	(height === 812 || width === 812 || height === 896 || width === 896);

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

const HeartButton = ({ isWhite, style, navigation }) => (
	<TouchableOpacity
		style={[styles.button, style]}
		onPress={() => navigation.navigate("Pro")}
	>
		<Icon
			family="AntDesign"
			size={18}
			name="heart"
			color={Theme.COLORS[isWhite ? "WHITE" : "ICON"]}
		/>
	</TouchableOpacity>
);

const SearchButton = ({ isWhite, style, navigation }) => (
	<TouchableOpacity
		style={[styles.button, style]}
		onPress={() => navigation.navigate("Pro")}
	>
		<Icon
			size={16}
			family="Galio"
			name="search-zoom-in"
			color={theme.COLORS[isWhite ? "WHITE" : "ICON"]}
		/>
	</TouchableOpacity>
);

class Header extends React.Component {
	handleLeftPress = () => {
		const { back, navigation } = this.props;
		return back ? navigation.goBack() : null;
	};
	renderRight = () => {
		const { white, title, navigation } = this.props;

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
			case "Home":
				// return ([
				//   <ChatButton key='chat-home' navigation={navigation} isWhite={white} />,
				//   <HeartButton key='basket-home' navigation={navigation} isWhite={white} />
				// ]);
				return;
			case "Detail":
				return [
					<ChatButton
						key="chat-categories"
						navigation={navigation}
					/>,
					<HeartButton
						key="basket-categories"
						navigation={navigation}
					/>,
				];

			case "Saved":
				return;

			case "Categories":
				return [
					<ChatButton
						key="chat-categories"
						navigation={navigation}
						isWhite={white}
					/>,
					<HeartButton
						key="basket-categories"
						navigation={navigation}
						isWhite={white}
					/>,
				];
			case "Category":
				return [
					<ChatButton
						key="chat-deals"
						navigation={navigation}
						isWhite={white}
					/>,
					<HeartButton
						key="basket-deals"
						navigation={navigation}
						isWhite={white}
					/>,
				];
			case "Profile":
				return [
					<ChatButton
						key="chat-profile"
						navigation={navigation}
						isWhite={white}
					/>,
					<HeartButton
						key="basket-deals"
						navigation={navigation}
						isWhite={white}
					/>,
				];
			case "Product":
				return [
					<SearchButton
						key="search-product"
						navigation={navigation}
						isWhite={white}
					/>,
					<HeartButton
						key="basket-product"
						navigation={navigation}
						isWhite={white}
					/>,
				];
			case "Search":
				return [
					<ChatButton
						key="chat-search"
						navigation={navigation}
						isWhite={white}
					/>,
					<HeartButton
						key="basket-search"
						navigation={navigation}
						isWhite={white}
					/>,
				];
			case "Settings":
				return [
					<ChatButton
						key="chat-search"
						navigation={navigation}
						isWhite={white}
					/>,
					<HeartButton
						key="basket-search"
						navigation={navigation}
						isWhite={white}
					/>,
				];
			case "None":
				return;
			default:
				break;
		}
	};

	renderSearch = () => {
		const { title } = this.props;
		const searchPlaceHolder = () => {
			if (title == "Message Center") {
				return "Search for chat history";
			} else {
				return "What are you looking for?";
			}
		};
		const { navigation } = this.props;
		const { handleSearch } = this.props;
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
				onChangeText={(newText) => handleSearch(newText)}
			/>
		);
	};
	renderOptions = () => {
		const { navigation, optionLeft, optionRight } = this.props;

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
	renderTabs = () => {
		const { tabs, tabIndex, navigation } = this.props;
		const defaultTab = tabs && tabs[0] && tabs[0].id;

		if (!tabs) return null;

		return (
			<Tabs
				data={tabs || []}
				initialIndex={tabIndex || defaultTab}
				onChange={(id) => navigation.setParams({ tabId: id })}
			/>
		);
	};
	renderHeader = () => {
		const { search, options, tabs } = this.props;
		if (search || tabs || options) {
			return (
				<Block center>
					{search ? this.renderSearch() : null}
					{options ? this.renderOptions() : null}
					{tabs ? this.renderTabs() : null}
				</Block>
			);
		}
	};
	render() {
		const {
			back,
			title,
			white,
			transparent,
			bgColor,
			iconColor,
			titleColor,
			navigation,
			...props
		} = this.props;

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
					<Block
						style={{ paddingVertical: theme.SIZES.BASE * 1.5 }}
					/>
				);
			} else {
				return (
					<NavBar
						back={false}
						title={title}
						style={navbarStyles}
						transparent={transparent}
						right={this.renderRight()}
						rightStyle={{ alignItems: "center" }}
						left={
							<Icon
								name={back ? "chevron-left" : null}
								family="entypo"
								size={20}
								onPress={this.handleLeftPress}
								color={
									iconColor ||
									(white
										? Theme.COLORS.WHITE
										: Theme.COLORS.ICON)
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
						{...props}
					/>
				);
			}
		};
		return (
			<Block style={headerStyles}>
				{navbar()}
				{this.renderHeader()}
			</Block>
		);
	}
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
