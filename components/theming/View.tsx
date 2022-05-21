import {ViewProps} from "react-native";

export default function View({ style, ...props}: ViewProps) {
    return <View style={[{backgroundColor: "transparent"}, style]} {...props}/>;
}