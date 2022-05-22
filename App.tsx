import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider} from 'react-native-paper';

import useCachedResources from './hooks/useCachedResources';
import ReceiptSplitScreen from "./screens/ReceiptSplitScreen";
import useThemeColor from "./hooks/useThemeColor";

export default function App() {
    const isLoadingComplete = useCachedResources();
    const color = useThemeColor('banner');

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <PaperProvider>
                <ReceiptSplitScreen/>
                <StatusBar backgroundColor={color}/>
            </PaperProvider>
        );
    }
}
