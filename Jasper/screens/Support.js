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

const { width } = Dimensions.get("screen");

const Support = (navigation) => {
  return (
    <Block flex style={styles.container}>
      <Text style={styles.title}>Contact our Support</Text>
      <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
        <Input
          placeholder="Your Name"
          placeholderTextColor="#6314AB"
          iconContent={
            <Icon
              size={11}
              style={{ marginRight: 10 }}
              color={Theme.COLORS.ICON}
              name="user"
              family="Entypo"
            />
          }
          style={{ width: 300 }}
        />
      </Block>
      <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
        <Input
          placeholder="Email"
          placeholderTextColor="#6314AB"
          iconContent={
            <Icon
              size={11}
              style={{ marginRight: 10 }}
              color={Theme.COLORS.ICON}
              name="mail"
              family="Feather"
            />
          }
          style={{ width: 300 }}
        />
      </Block>
      <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
        <Input
          placeholder="Subject"
          placeholderTextColor="#6314AB"
          iconContent={
            <Icon
              size={11}
              style={{ marginRight: 10 }}
              color={Theme.COLORS.ICON}
              name="magnifying-glass"
              family="Entypo"
            />
          }
          style={{ width: 300 }}
        />
      </Block>
      <Block>
        <Block style={[styles.textInput, styles.shadow]}>
          <TextInput
            style={{ color: Theme.COLORS.HEADER }}
            placeholder="Describe your issue "
            multiline={true}
            numberOfLines={6}
            maxLength={500}
          ></TextInput>
        </Block>
      </Block>
      <Button
        onPress={() => navigation.navigate("App")}
        style={{
          width: width - theme.SIZES.BASE * 4,
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 30,
        }}
        textStyle={{ fontSize: 15, fontWeight: "600" }}
      >
        Submit Request
      </Button>
      <Block style={styles.directly}>
        <Text style={styles.subtitle}>Contact us directly:</Text>
        <Text>Email: jasperEmail@gmail.com</Text>
        <Text>Address: U-Distict</Text>
        <Text>Phone: 206-000-0000</Text>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  directly: {
    position: "absolute",
    top: 560,
    left: 40,
  },
  title: {
    fontWeight: "600",
    fontSize: 25,
    color: Theme.COLORS.HEADER,
    paddingBottom: 30,
  },
  subtitle: {
    fontWeight: "400",
    fontSize: 20,
    color: Theme.COLORS.HEADER,
    paddingBottom: 10,
  },
  textInput: {
    fontSize: 15,
    color: Theme.COLORS.HEADER,
    marginVertical: theme.SIZES.BASE / 2,
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 4,
    borderColor: Theme.COLORS.BORDER,
    height: 100,
    width: 300,
    paddingHorizontal: 15,
  },
  shadow: {
    shadowColor: Theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 0,
  },
  greyBorder: {
    borderTopColor: "black",
  },
});

export default Support;
