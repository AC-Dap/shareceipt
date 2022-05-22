import {Text as NativeText, TextProps} from "react-native";
import useThemeColor from "../../hooks/useThemeColor";
import {Fonts} from "../../styling/StyleConstants";

export function Text({style, ...props}: TextProps){
    const textColor = useThemeColor("text");

    return <NativeText style={[{color: textColor, fontFamily: Fonts.normalFont}, style]} {...props} />;
}