import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View, TouchableOpacity } from "react-native";
// header for screens
import { Header, Icon } from "./components";
import { Theme, tabs } from "./constants";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
// Firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import {
	getDatabase,
	ref,
	set as firebaseSet,
	onValue,
} from "firebase/database";

// screens
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Detail from "./screens/Detail";
import Saved from "./screens/Saved";
import Profile from "./screens/Profile";
import Post from "./screens/Post";
import React from "react";
import Recovery from "./screens/Recovery";
import SignUp from "./screens/SignUp";
import MessageCenter from "./screens/MessageCenter";
import Chat from "./screens/Chat";
import Chat2 from "./screens/Chat2";
import PostDone from "./screens/PostDone";

import { items, conversations } from "./constants/mockData";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
	<TouchableOpacity
		style={[styles.customButton, styles.shadow]}
		onPress={onPress}
	>
		<View
			style={{
				width: 70,
				height: 70,
				borderRadius: 35,
				backgroundColor: Theme.COLORS.PRIMARY,
			}}
		>
			{children}
		</View>
	</TouchableOpacity>
);

function SavedStack(props) {
	return (
		<Stack.Navigator
			screenOptions={{
				mode: "card",
				headerShown: "screen",
			}}
		>
			<Stack.Screen
				name="Saved"
				component={Saved}
				options={{
					header: ({ navigation, scene }) => (
						<Header
							title="Saved Items"
							navigation={navigation}
							scene={scene}
						/>
					),
					cardStyle: { backgroundColor: "#F8F9FE" },
				}}
			/>
		</Stack.Navigator>
	);
}

function ChatStack(props) {
	return (
		<Stack.Navigator
			screenOptions={{
				mode: "card",
				headerShown: "screen",
			}}
		>
			<Stack.Screen
				name="MessageCenter"
				component={MessageCenter}
				options={{
					header: ({ navigation, scene }) => (
						<Header
							title="Message Center"
							search
							navigation={navigation}
							scene={scene}
						/>
					),
					cardStyle: { backgroundColor: "#F8F9FE" },
				}}
			/>
		</Stack.Navigator>
	);
}

function ProfileStack(props) {
	return (
		<Stack.Navigator
			initialRouteName="Profile"
			screenOptions={{
				mode: "card",
				headerShown: "screen",
			}}
		>
			<Stack.Screen
				name="Profile"
				component={Profile}
				options={{
					header: ({ navigation, scene }) => (
						<Header
							transparent
							white
							title="Profile"
							navigation={navigation}
							scene={scene}
						/>
					),
					cardStyle: { backgroundColor: "#FFFFFF" },
					headerTransparent: true,
				}}
			/>
		</Stack.Navigator>
	);
}

function PostStack(props) {
	return (
		<Stack.Navigator
			screenOptions={{
				mode: "card",
				headerShown: "screen",
			}}
		>
			<Stack.Screen
				name="Post"
				component={Post}
				options={{
					header: ({ navigation, scene }) => (
						<Header
							title="Post Item"
							navigation={navigation}
							scene={scene}
						/>
					),
					cardStyle: { backgroundColor: "#F8F9FE" },
				}}
			/>
			<Stack.Screen
				name="PostDone"
				component={PostDone}
				options={{
					header: ({ navigation, scene }) => (
						<Header
							title="Post Done"
							white
							transparent
							navigation={navigation}
							scene={scene}
						/>
					),
					headerTransparent: true,
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}

function HomeStack({ route }) {
	const [searchText, setSearchText] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");

	const { allItems } = route.params;

	let filteredItems;
	if (allItems) {
		filteredItems = Object.keys(allItems).map((key) => allItems[key]);
	} else {
		filteredItems = [];
	}

	// handle category select
	if (selectedCategory !== "All") {
		filteredItems = filteredItems.filter((item) => {
			return item.category === selectedCategory;
		});
	}

	// handle search
	filteredItems = filteredItems.filter((item) => {
		return (
			item.title.toLowerCase().includes(searchText.toLowerCase()) ||
			item.description.toLowerCase().includes(searchText.toLowerCase())
		);
	});
	return (
		<Stack.Navigator
			screenOptions={{
				mode: "card",
				headerShown: "screen",
			}}
		>
			<Stack.Screen
				name="Home"
				component={Home}
				initialParams={{ items: allItems }}
				options={{
					header: ({ navigation, scene }) => (
						<Header
							title="Home"
							tabs={tabs.categories}
							search
							navigation={navigation}
							scene={scene}
						/>
					),
					cardStyle: { backgroundColor: "#F8F9FE" },
				}}
			/>
			<Stack.Screen
				name="Detail"
				component={Detail}
				options={{
					header: ({ navigation, scene }) => (
						<Header
							title="Detail"
							back
							navigation={navigation}
							scene={scene}
						/>
					),
				}}
			/>
		</Stack.Navigator>
	);
}

function LandingStack(props) {
	// Database
	const [user, loading] = useAuthState(getAuth());
	const [allItems, setAllItems] = useState();

	useEffect(() => {
		const db = getDatabase();
		const allItemsRef = ref(db, "allItems");

		const allItemsOffFunction = onValue(allItemsRef, (snapshot) => {
			const newAllItems = snapshot.val();
			setAllItems(newAllItems);
		});

		function cleanUp() {
			allItemsOffFunction();
		}

		return cleanUp;
	}, []);

	return (
		<Stack.Navigator
			screenOptions={{
				mode: "card",
				headerShown: false,
			}}
		>
			<Stack.Screen
				name="Landing"
				component={Landing}
				options={{
					headerTransparent: true,
				}}
			/>
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="SignUp" component={SignUp} />
			<Stack.Screen name="Recovery" component={Recovery} />

			<Stack.Screen
				name="Chat"
				component={Chat}
				options={{
					header: ({ navigation, scene }) => (
						<Header
							title="David"
							back
							navigation={navigation}
							scene={scene}
						/>
					),
					headerShown: true,
					cardStyle: { backgroundColor: "#F8F9FE" },
				}}
			/>
			<Stack.Screen
				name="Chat2"
				component={Chat2}
				options={{
					header: ({ navigation, scene }) => (
						<Header
							title="Josh"
							back
							navigation={navigation}
							scene={scene}
						/>
					),
					headerShown: true,
					cardStyle: { backgroundColor: "#F8F9FE" },
				}}
			/>
			<Stack.Screen
				name="App"
				component={AppTabs}
				initialParams={{ allItems: allItems }}
			/>
		</Stack.Navigator>
	);
}

function AppTabs({ route }) {
	const { allItems } = route.params;
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarShowLabel: false,
				style: styles.bottomNav,
				headerShown: false,
			}}
			initialRouteName="HomeTab"
		>
			<Tab.Screen
				name="HomeTab"
				component={HomeStack}
				initialParams={{ allItems: allItems }}
				options={{
					tabBarIcon: ({ focused }) => {
						if (focused) {
							return (
								<View>
									<Icon
										name="home"
										family="MaterialIcons"
										size={30}
										color={Theme.COLORS.PRIMARY}
									/>
								</View>
							);
						} else {
							return (
								<View>
									<Icon
										name="home"
										family="MaterialIcons"
										size={30}
									/>
								</View>
							);
						}
					},
				}}
			/>
			<Tab.Screen
				name="SavedTab"
				component={SavedStack}
				options={{
					tabBarIcon: ({ focused }) => {
						if (focused) {
							return (
								<View>
									<Icon
										name="heart"
										family="AntDesign"
										size={25}
										color={Theme.COLORS.PRIMARY}
									/>
								</View>
							);
						} else {
							return (
								<View>
									<Icon
										name="heart"
										family="AntDesign"
										size={25}
									/>
								</View>
							);
						}
					},
				}}
			/>
			<Tab.Screen
				name="PostTab"
				component={PostStack}
				options={{
					tabBarIcon: ({ focused }) => (
						<View>
							<Icon
								name="plus"
								family="Entypo"
								size={40}
								color={Theme.COLORS.WHITE}
							/>
						</View>
					),
					tabBarButton: (props) => <CustomTabBarButton {...props} />,
				}}
			/>
			<Tab.Screen
				name="ChatTab"
				component={ChatStack}
				options={{
					tabBarIcon: ({ focused }) => {
						if (focused) {
							return (
								<View>
									<Icon
										name="chat"
										family="Entypo"
										size={25}
										color={Theme.COLORS.PRIMARY}
									/>
								</View>
							);
						} else {
							return (
								<View>
									<Icon
										name="chat"
										family="Entypo"
										size={25}
									/>
								</View>
							);
						}
					},
				}}
			/>
			<Tab.Screen
				name="ProfileTab"
				component={ProfileStack}
				options={{
					tabBarIcon: ({ focused }) => {
						if (focused) {
							return (
								<View>
									<Icon
										name="person"
										family="MaterialIcons"
										size={30}
										color={Theme.COLORS.PRIMARY}
									/>
								</View>
							);
						} else {
							return (
								<View>
									<Icon
										name="person"
										family="MaterialIcons"
										size={30}
									/>
								</View>
							);
						}
					},
				}}
			/>
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: Theme.COLORS.BLACK,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		shadowOpacity: 0.1,
		elevation: 5,
	},
	bottomNav: {
		position: "absolute",
		bottom: 25,
		left: 20,
		right: 20,
		elevation: 0,
		backgroundColor: Theme.COLORS.WHITE,
		borderRadius: 15,
		height: 90,
	},
	customButton: {
		top: -30,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default LandingStack;
