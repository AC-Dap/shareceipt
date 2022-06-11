import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider} from 'react-native-paper';

import useCachedResources from './hooks/useCachedResources';
import ShareceiptScreen from "./screens/ShareceiptScreen";
import useThemeColor from "./hooks/useThemeColor";
import {Platform, UIManager} from "react-native";

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function App() {
    const isLoadingComplete = useCachedResources();
    const statusBarColor = useThemeColor('banner');

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <PaperProvider>
                <ShareceiptScreen/>
                <StatusBar backgroundColor={statusBarColor}/>
            </PaperProvider>
        );
    }
}
