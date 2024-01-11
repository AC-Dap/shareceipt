import {createRef, useContext, useEffect, useState} from "react";
import {ReceiptContext} from "../../context/ReceiptContext";
import {PanningProvider, TextField, TextFieldRef} from "react-native-ui-lib";
import Dialog from "react-native-ui-lib/dialog";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import Button from "react-native-ui-lib/button";
import {BaseStyles} from "../../styling/BaseStyles";

type PersonDialogProps = {
    visible: boolean,
    closeDialog: () => void,
    personIdx?: number
}

const PersonDialogHeader = ({isEdit}: { isEdit: boolean }) => {
    return <Text style={BaseStyles.dialogHeader}>{isEdit ? "Edit Party Member" : "Add Party Member"}</Text>
}

export const PersonDialog = ({visible, closeDialog, personIdx}: PersonDialogProps) => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);
    const isEdit = personIdx !== undefined;

    const [name, setName] = useState("");
    const input = createRef<TextFieldRef>();
    useEffect(() => {
        setName(isEdit ? receipt.party[personIdx!] : "");
    }, [visible, personIdx]);

    const completeDialog = () => {
        if (name.length == 0) {
            input.current?.validate();
            return;
        }

        if (isEdit) {
            updateReceipt({
                type: "UPDATE_PERSON",
                payload: {
                    idx: personIdx!,
                    person: name
                }
            });
        } else {
            updateReceipt({
                type: "ADD_PERSON",
                payload: name
            });
        }

        closeDialog();
    }

    return <Dialog
        visible={visible}
        onDismiss={closeDialog}
        panDirection={PanningProvider.Directions.DOWN}
        renderPannableHeader={PersonDialogHeader}
        pannableHeaderProps={{isEdit}}
        containerStyle={BaseStyles.dialog}
        ignoreBackgroundPress
    >
        <TextField
            // @ts-expect-error
            ref={input}
            label={"Name"}
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

        <View style={BaseStyles.dialogActions}>
            <Button label={"Cancel"} link onPress={closeDialog}/>
            <Button label={"Done"} link onPress={completeDialog}/>
        </View>
    </Dialog>
}