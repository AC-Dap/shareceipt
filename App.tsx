import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider} from 'react-native-paper';

import useCachedResources from './hooks/useCachedResources';
import ReceiptSplitScreen from "./screens/ReceiptSplitScreen";
import {useColorScheme} from "react-native";
import {ColorsDark, ColorsLight} from "./styling/StyleConstants";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();
    const color = (colorScheme === "dark") ? ColorsDark.banner : ColorsLight.banner;

    if (!isLoadingComplete) {
        console.log("HI");
        return null;
    } else {
        console.log(":(");
        return (
            <PaperProvider>
                <ReceiptSplitScreen/>
                <StatusBar backgroundColor={color}/>
            </PaperProvider>
        );
    }
}
