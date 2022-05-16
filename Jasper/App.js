import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./Screens";
import Loading from "./screens/Loading";
import { Images, Theme } from "./constants";

function App() {
	return (
		<NavigationContainer>
			<GalioProvider theme={Theme}>
				<Block flex>
					<Screens />
				</Block>
			</GalioProvider>
		</NavigationContainer>
	);
}

export default App;
