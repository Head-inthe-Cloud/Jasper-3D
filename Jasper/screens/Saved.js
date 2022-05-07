//galio
import { Block, Text, theme } from "galio-framework";
import {
	Dimensions,
	ImageBackground,
	ScrollView,
	StyleSheet,
} from "react-native";
//argon
import { Images, Theme } from "../constants";
import { items } from "../constants/mockData";

import { Card } from "../components";
import React from "react";

const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

class Saved extends React.Component {
	render() {
		return (
			<Block flex center>
				<ScrollView>
					<Block flex style={styles.group}>
						<Block flex>
							<Block
								style={{ paddingHorizontal: theme.SIZES.BASE }}
							>
								<Card item={items.i00001} horizontal />
								<Card item={items.i00002} horizontal />
								<Card item={items.i00003} horizontal />
								<Card item={items.i00004} horizontal />
								<Card item={items.i00005} horizontal />
								<Card item={items.i00006} horizontal />
								<Card item={items.i00007} horizontal />
								<Card item={items.i00008} horizontal />
								<Card item={items.i00009} horizontal />
								<Card item={items.i00010} horizontal />
								<Block flex card shadow style={styles.category}>
									<ImageBackground
										source={Images.CherryBlossom}
										style={[
											styles.imageBlock,
											{
												width:
													width -
													theme.SIZES.BASE * 2,
												height: 252,
											},
										]}
										imageStyle={{
											width: width - theme.SIZES.BASE * 2,
											height: 252,
										}}
									>
										<Block style={styles.categoryTitle}>
											<Text
												size={18}
												bold
												color={theme.COLORS.WHITE}
											>
												Explore More Items
											</Text>
										</Block>
									</ImageBackground>
								</Block>
							</Block>
						</Block>
					</Block>
				</ScrollView>
			</Block>
		);
	}
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
