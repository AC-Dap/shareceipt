import {FontAwesome} from "@expo/vector-icons";
import Button from "react-native-ui-lib/button";
import {StylingConstants} from "../../styling/BaseStyles";
import View from "react-native-ui-lib/view";

type IconButtonProps = {
    icon: string,
    onPress: () => void,
    iconColor?: string,
    buttonPadding?: number,
}

export const IconButton = ({
                               icon,
                               onPress,
                               iconColor = StylingConstants.colors.primary,
                               buttonPadding = StylingConstants.spacing.medium
                           }: IconButtonProps) => {
    return <Button
        onPress={onPress}
        backgroundColor={"transparent"}
        iconSource={() => (
            <View style={{padding: buttonPadding}}>
                {/* @ts-ignore */}
                <FontAwesome name={icon} size={StylingConstants.iconSize} color={iconColor}/>
            </View>
        )}
    />
}
