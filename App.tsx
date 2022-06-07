import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider} from 'react-native-paper';

import useCachedResources from './hooks/useCachedResources';
import ShareceiptScreen from "./screens/ShareceiptScreen";
import useThemeColor from "./hooks/useThemeColor";

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
