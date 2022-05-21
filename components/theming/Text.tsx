import {Text as NativeText, TextProps} from "react-native";
import useThemeColor from "../../hooks/useThemeColor";

export default function Text({style, ...props}: TextProps){
    const textColor = useThemeColor("text");

    return <NativeText style={[{color: textColor, fontFamily: 'space-mono'}, style]} {...props} />;
}