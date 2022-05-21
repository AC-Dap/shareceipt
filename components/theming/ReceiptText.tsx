import {Text, TextProps} from "react-native";
import useThemeColor from "../../hooks/useThemeColor";

export default function ReceiptText({style, ...props}: TextProps){
    const textColor = useThemeColor("text");

    return <Text style={[{color: textColor, fontFamily: 'receipt'}, style]} {...props} />;
}