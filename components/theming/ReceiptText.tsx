import {Text as NativeText, TextProps} from "react-native";
import useThemeColor from "../../hooks/useThemeColor";

export default function ReceiptText({style, ...props}: TextProps){
    const textColor = useThemeColor("text");

    return <NativeText style={[{color: textColor, fontFamily: 'receipt'}, style]} {...props} />;
}