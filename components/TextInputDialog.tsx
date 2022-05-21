import {Button, Dialog, Portal, TextInput} from "react-native-paper";
import {useState} from "react";
import {KeyboardTypeOptions} from "react-native";
import Text from "./theming/Text";

type TextInputDialog = {
    visible: boolean,
    onClose: () => void,
    title: string,
    subtitle: string,
    submitInput: (input: string) => void,
    keyboardType: KeyboardTypeOptions
}

// Moving this into separate component fixes this weird bug
// https://github.com/callstack/react-native-paper/issues/1668
function MainPortalComponent({visible, onClose, title, subtitle, submitInput, keyboardType}: TextInputDialog){
    const [input, setInput] = useState("");

    const onSubmit = () => {
        onClose();
        submitInput(input);
    }

    return (
         <Dialog visible={visible} onDismiss={onClose}>
            <Dialog.Title><Text>{title}</Text></Dialog.Title>
            <Dialog.Content>
                <TextInput
                    label={subtitle}
                    value={input}
                    onChangeText={input => setInput(input)}
                    keyboardType={keyboardType}
                />
            </Dialog.Content>

            <Dialog.Actions>
                <Button onPress={onClose}><Text>Cancel</Text></Button>
                <Button onPress={onSubmit}><Text>Submit</Text></Button>
            </Dialog.Actions>
        </Dialog>
    );
}

export default function TextInputDialog(props: TextInputDialog) {
    return (
        <Portal>
            <MainPortalComponent {...props} />
        </Portal>
    )
}

TextInputDialog.defaultProps = {
    keyboardType: "default"
}
