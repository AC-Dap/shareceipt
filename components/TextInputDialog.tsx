import {Button, Dialog, Portal, TextInput} from "react-native-paper";
import {useState} from "react";
import {KeyboardTypeOptions} from "react-native";
import {Text} from "./theming";

type TextInputDialog = {
    visible: boolean,
    title: string,
    subtitle: string,
    onClose: () => void,
    onSubmit: (input: string) => void,
    keyboardType: KeyboardTypeOptions
}

// Moving this into separate component fixes this weird bug
// https://github.com/callstack/react-native-paper/issues/1668
function MainPortalComponent({visible,title, subtitle, onClose,  onSubmit, keyboardType}: TextInputDialog){
    const [input, setInput] = useState("");

    const close = () => {
        onClose();
        setInput("");
    }
    const submit = () => {
        onSubmit(input);
        close();
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
                <Button onPress={close}><Text>Cancel</Text></Button>
                <Button onPress={submit}><Text>Submit</Text></Button>
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
