import {Avatar, Colors} from "react-native-paper";
import {getInitials, nameToColor} from "../utils/AvatarUtils";
import {StyleProp, StyleSheet, ViewStyle} from "react-native";

type CircleAvatarProps = {
    size: number,
    name: string,
    style: StyleProp<ViewStyle>
}

export default function CircleAvatar({size, name, style, ...props} : CircleAvatarProps){
    return <Avatar.Text size={size} label={getInitials(name)}
                        style={[style, {backgroundColor: nameToColor(name)}]} color={Colors.white} {...props}/>;
}

CircleAvatar.defaultProps = {
    style: {}
}
