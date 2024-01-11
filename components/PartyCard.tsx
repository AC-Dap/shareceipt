import {StyleSheet} from "react-native";
import Text from "react-native-ui-lib/text";
import Button from "react-native-ui-lib/button";
import TouchableOpacity from "react-native-ui-lib/touchableOpacity";
import {StylingConstants} from "../styling/BaseStyles";
import {IconButton} from "./base/IconButton";

type PartyCardProps = {
    party: string
    onLoad: () => void
    onRemove: () => void
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: StylingConstants.spacing.small,
        marginHorizontal: StylingConstants.spacing.large,
        marginVertical: StylingConstants.spacing.medium,
    },
    partyName: {
        flex: 1,
        fontSize: StylingConstants.fontSizes.medium
    },
    loadPartyText: {
        color: "white",
        fontSize: StylingConstants.fontSizes.small
    }
});

export const PartyCard = ({party, onLoad, onRemove}: PartyCardProps) => {
    return (
        <TouchableOpacity onPress={onLoad} style={styles.container}>
            <Text style={styles.partyName}>{party}</Text>

            <Button
                label={"Load Party"}
                labelStyle={styles.loadPartyText}
                size={Button.sizes.xSmall}
                onPress={onLoad}
                backgroundColor={StylingConstants.colors.secondary}
            />
            <IconButton icon={"trash-o"} onPress={onRemove} iconColor={StylingConstants.colors.secondary}/>
        </TouchableOpacity>
    )
}