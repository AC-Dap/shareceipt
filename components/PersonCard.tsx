import {StyleSheet} from "react-native";
import {useContext, useRef, useState} from "react";
import {ReceiptContext} from "../context/ReceiptContext";
import Text from "react-native-ui-lib/text";
import TouchableOpacity from "react-native-ui-lib/touchableOpacity";
import {PersonDialog} from "./dialogs/PersonDialog";
import {ConfirmDialog} from "./dialogs/ConfirmDialog";
import {StylingConstants} from "../styling/BaseStyles";
import {IconButton} from "./base/IconButton";
import {ExpandableOptions, ExpandableOptionsRef} from "./ExpandableOptions";

type PersonCardProps = {
    personIdx: number
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: StylingConstants.spacing.large,
        marginVertical: StylingConstants.spacing.medium
    },
    name: {
        flex: 1,
        fontSize: StylingConstants.fontSizes.medium
    }
});

export const PersonCard = ({personIdx}: PersonCardProps) => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);

    const [showDialog, setShowDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const removePerson = () => {
        updateReceipt({
            type: "REMOVE_PERSON",
            payload: personIdx
        });
        setShowConfirmDialog(false);
    }

    const optionsRef = useRef<ExpandableOptionsRef | null>(null);

    return <>
        <TouchableOpacity style={styles.container} onPress={() => setShowDialog(true)}>
            <Text style={styles.name}>{receipt.party[personIdx]}</Text>
            <ExpandableOptions ref={optionsRef}>
                <IconButton
                    icon={"pencil"}
                    iconColor={StylingConstants.colors.secondary}
                    onPress={() => {
                        setShowDialog(true);
                        optionsRef.current?.hideActions();
                    }}
                />
                <IconButton
                    icon={"trash-o"}
                    iconColor={StylingConstants.colors.secondary}
                    onPress={() => {
                        setShowConfirmDialog(true);
                        optionsRef.current?.hideActions();
                    }}
                />
            </ExpandableOptions>
        </TouchableOpacity>

        <ConfirmDialog
            visible={showConfirmDialog}
            title={"Remove Person?"}
            message={`Are you sure you want to remove ${receipt.party[personIdx]} from the party?`}
            onCancel={() => setShowConfirmDialog(false)}
            onConfirm={removePerson}
        />
        <PersonDialog visible={showDialog} closeDialog={() => setShowDialog(false)} personIdx={personIdx}/>
    </>
}