import {StyleSheet, ViewProps} from "react-native";
import View from "./View";
import useThemeColor from "../../hooks/useThemeColor";

export default function Banner({ style, ...props }: ViewProps){
    const color = useThemeColor('banner');

    return <View style={[{backgroundColor: color}, styles.banner, style]} {...props}/>;
}

const styles = StyleSheet.create({
    banner: {
        height: 50,
        flexDirection: "row",
        alignItems: "center"
    }
});