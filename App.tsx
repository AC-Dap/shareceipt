import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {HomeScreen} from "./screens/HomeScreen";

export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <HomeScreen/>
            </SafeAreaView>
            <StatusBar style="auto"/>
        </SafeAreaProvider>
    );
}
