import Dialog from "react-native-ui-lib/dialog";
import {PanningProvider, TextField, TextFieldRef} from "react-native-ui-lib";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import Button from "react-native-ui-lib/button";
import {FlatList, StyleSheet} from "react-native";
import {ReceiptContext} from "../../context/ReceiptContext";
import {createRef, useContext, useEffect, useState} from "react";
import {saveParty} from "../../utils/partyStorage";
import {BaseStyles, StylingConstants} from "../../styling/BaseStyles";

type SavePartyDialogProps = {
    visible: boolean,
    closeDialog: () => void
}

const styles = StyleSheet.create({
    currentPartyText: {
        fontSize: StylingConstants.fontSizes.medium,
        fontWeight: StylingConstants.fontWeights.medium,
        color: StylingConstants.colors.secondary
    },
    currentPartyMemberText: {
        fontSize: StylingConstants.fontSizes.medium,
        marginLeft: StylingConstants.spacing.small,
    }
});

export const SavePartyDialog = ({visible, closeDialog}: SavePartyDialogProps) => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);

    const [name, setName] = useState("");
    const input = createRef<TextFieldRef>();

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setName("");
        setErrorMessage("");
    }, [visible]);

    const onConfirm = async () => {
        input.current?.validate();
        setErrorMessage("");

        if (name.length === 0) {
            return;
        }

        try {
            await saveParty(name, receipt.party);
            closeDialog();
        } catch (e) {
            setErrorMessage(e.message);
        }
    }

    return (
        <Dialog
            visible={visible}
            onDismiss={closeDialog}
            panDirection={PanningProvider.Directions.DOWN}
            renderPannableHeader={() => <Text style={BaseStyles.dialogHeader}>Save Current Party</Text>}
            containerStyle={BaseStyles.dialog}
            ignoreBackgroundPress
        >
            <TextField
                // @ts-expect-error
                ref={input}
                label={"Party Name"}
                placeholder={"Enter Name"}
                value={name}
                onChangeText={setName}
                enableErrors
                validationMessage={"Name is required"}
                validate={"required"}
                style={BaseStyles.textInput}
                labelStyle={BaseStyles.textInputLabel}
                validationMessageStyle={BaseStyles.textInputError}
            />

            <Text style={styles.currentPartyText}>Current Party:</Text>
            <FlatList data={receipt.party} renderItem={({item: person}) =>
                <Text style={styles.currentPartyMemberText}>- {person}</Text>}/>

            {errorMessage !== "" && <>
                <Text color={StylingConstants.colors.error}>An unexpected error has occurred:</Text>
                <Text color={StylingConstants.colors.error}>{errorMessage}</Text>
            </>}

            <View style={BaseStyles.dialogActions}>
                <Button label={"Cancel"} link onPress={closeDialog}/>
                <Button label={"Done"} link onPress={onConfirm}/>
            </View>
        </Dialog>
    )
}
