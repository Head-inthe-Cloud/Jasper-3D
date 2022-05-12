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
  ref as dbRef,
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
import PostDone from "./screens/PostDone";
import Support from "./screens/Support";

import { items, users } from "./constants/mockData";

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

function SavedStack({ route }) {
  const { allItems, userData } = route.params;

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
        initialParams={{
          allItems: allItems,
          userData: userData,
        }}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Saved Items" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
    </Stack.Navigator>
  );
}

function ChatStack({ route }) {
  const { allItems, conversations, userId } = route.params;

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
        initialParams={{
          allItems: allItems,
          conversations: conversations,
          userId: userId,
        }}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Message Center"
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

function ProfileStack({ route, navigation }) {
  const { allItems, userId } = route.params;

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
        initialParams={{ allItems: allItems, userId: userId }}
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

function PostStack({ route, navigation }) {
  const { userId } = route.params;
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
        initialParams={{ userId: userId }}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Post Item" navigation={navigation} scene={scene} />
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

  const { allItems, conversations, users, userId } = route.params;

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

  // Conversation Overview
  const conversationList = Object.keys(conversations).map(
    (key) => conversations[key]
  );
  const conversationsOverview = conversationList.map((conversation) => [
    conversation.conversationId,
    conversation.participants,
  ]);

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
        initialParams={{
          allItems: allItems,
          conversationsOverview: conversationsOverview,
          userId: userId,
        }}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              title="Detail"
              back
              navigation={navigation}
              scene={scene}
              route={route}
              userData={users[userId]}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function LandingStack(props) {
  // Database
  // const [userId, loading] = useAuthState(getAuth());

  const userId = "u00001";
  const [allItems, setAllItems] = useState({});
  const [users, setUsers] = useState({});
  const [conversations, setConversations] = useState({});

  useEffect(() => {
    const db = getDatabase();
    const allItemsRef = dbRef(db, "allItems");
    const usersRef = dbRef(db, "users");
    const conversationsRef = dbRef(db, "conversations");

    // Upload temp data to database
    // ***************************f**********
    // firebaseSet(usersRef, users);
    // firebaseSet(allItemsRef, items);

    // *************************************

    const allItemsOffFunction = onValue(allItemsRef, (snapshot) => {
      const newAllItems = snapshot.val();
      setAllItems(newAllItems);
    });

    const conversationsOffFunction = onValue(conversationsRef, (snapshot) => {
      const newConversations = snapshot.val();
      setConversations(newConversations);
    });

    const usersOffFunction = onValue(usersRef, (snapshot) => {
      const newUsers = snapshot.val();
      setUsers(newUsers);
    });

    function cleanUp() {
      allItemsOffFunction();
      conversationsOffFunction();
      usersOffFunction();
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
        name="App"
        component={AppTabs}
        initialParams={{
          allItems: allItems,
          conversations: conversations,
          users: users,
          userId: userId,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        initialParams={{
          allItems: allItems,
          userId: userId,
          conversations: conversations,
        }}
        options={{
          header: ({ navigation, scene }) => (
            <Header title={"Chat"} back navigation={navigation} scene={scene} />
          ),
          headerShown: true,
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen
        name="Detail-Chat"
        component={Detail}
        initialParams={{
          allItems: allItems,
          userId: userId,
        }}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              title="Detail"
              back
              navigation={navigation}
              scene={scene}
              route={route}
              userData={users[userId]}
            />
          ),
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

function AppTabs({ route }) {
  const { allItems, conversations, users, userId } = route.params;
  const userData = users[userId];
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
        initialParams={{
          allItems: allItems,
          conversations: conversations,
          users: users,
          userId: userId,
        }}
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
                  <Icon name="home" family="MaterialIcons" size={30} />
                </View>
              );
            }
          },
        }}
      />
      <Tab.Screen
        name="SavedTab"
        component={SavedStack}
        initialParams={{ allItems: allItems, userData: userData }}
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
                  <Icon name="heart" family="AntDesign" size={25} />
                </View>
              );
            }
          },
        }}
      />
      <Tab.Screen
        name="PostTab"
        component={PostStack}
        initialParams={{ userId: userId }}
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
        initialParams={{
          allItems: allItems,
          userId: userId,
          conversations: conversations,
        }}
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
                  <Icon name="chat" family="Entypo" size={25} />
                </View>
              );
            }
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        initialParams={{ allItems: allItems, userId: userId }}
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
                  <Icon name="person" family="MaterialIcons" size={30} />
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
