import {View as NativeView, ViewProps} from "react-native";

export default function View({ style, ...props}: ViewProps) {
    return <NativeView style={[{backgroundColor: "transparent"}, style]} {...props}/>;
}