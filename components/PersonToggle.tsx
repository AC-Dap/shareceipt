import {useContext} from "react";
import {ReceiptContext} from "../context/ReceiptContext";
import TouchableOpacity from "react-native-ui-lib/touchableOpacity";
import Text from "react-native-ui-lib/text";
import {StyleSheet} from "react-native";
import {StylingConstants} from "../styling/BaseStyles";

type PersonToggleProps = {
    personIdx: number,
    itemIdx: number
}

const styles = StyleSheet.create({
    personContainer: {
        width: "100%",
        padding: StylingConstants.spacing.medium
    },
    toggled: {
        backgroundColor: StylingConstants.colors.darkgrey
    },
    untoggled: {
        backgroundColor: "white"
    },
    personText: {
        fontSize: StylingConstants.fontSizes.medium,
        marginLeft: StylingConstants.spacing.medium
    }
});

export const PersonToggle = ({personIdx, itemIdx}: PersonToggleProps) => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);

    const selected = receipt.matches[personIdx][itemIdx];
    const toggleSelected = () => {
        updateReceipt({
            type: "UPDATE_MATCH",
            payload: {
                personIdx,
                receiptItemIdx: itemIdx,
                match: !selected
            }
        });
    }

    return (
        <TouchableOpacity
            style={[styles.personContainer, selected ? styles.toggled : styles.untoggled]}
            onPress={toggleSelected}
        >
            <Text style={styles.personText}>{receipt.party[personIdx]}</Text>
        </TouchableOpacity>
    )
}