import {Button, Dialog, Portal, TextInput} from "react-native-paper";
import {Text} from "./Themed"
import {useState} from "react";
import {KeyboardTypeOptions} from "react-native";

type TextInputDialog = {
    visible: boolean,
    onClose: () => void,
    title: string,
    subtitle: string,
    submitInput: (input: string) => void,
    keyboardType: KeyboardTypeOptions
}

export default function TextInputDialog({visible, onClose, title, subtitle, submitInput, keyboardType}: TextInputDialog) {
    const [input, setInput] = useState("");

    const onSubmit = () => {
        onClose();
        submitInput(input);
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Title><Text>{title}</Text></Dialog.Title>
                <Dialog.Content>
                    <Text>{subtitle}</Text>
                    <TextInput
                        value={input}
                        onChangeText={inp => setInput(inp)}
                        keyboardType={keyboardType}
                    />
                </Dialog.Content>

                <Dialog.Actions>
                    <Button onPress={onClose}><Text>Cancel</Text></Button>
                    <Button onPress={onSubmit}><Text>Submit</Text></Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

TextInputDialog.defaultProps = {
    keyboardType: "default"
}
