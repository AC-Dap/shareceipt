import {StyleSheet} from "react-native";
import Button from "react-native-ui-lib/button";
import {StylingConstants} from "../../styling/BaseStyles";
import {FontAwesome} from "@expo/vector-icons";
import Text from "react-native-ui-lib/text";

type IconTextButtonProps = {
    icon: string,
    text: string
    onPress: () => void,
    iconColor?: string,
    buttonColor?: string,
    style?: any,
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: StylingConstants.fontSizes.medium,
        marginLeft: StylingConstants.spacing.small
    }
});

export const IconTextButton = ({
   icon,
   text,
   onPress,
   iconColor = "white",
   buttonColor = StylingConstants.colors.primary,
   style = {}
}: IconTextButtonProps) => {
    return <Button onPress={onPress} backgroundColor={buttonColor} style={style}>
        {/* @ts-ignore */}
        <FontAwesome name={icon} size={StylingConstants.iconSize} color={iconColor}/>
        <Text style={styles.buttonText} color={iconColor}>{text}</Text>
    </Button>
}