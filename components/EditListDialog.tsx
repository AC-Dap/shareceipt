import {Button, Checkbox, Dialog, Portal} from "react-native-paper";
import {useEffect, useState} from "react";
import Text from "./theming/Text";

type EditListDialogProps = {
    title: string,
    items: string[],
    visible: boolean,
    onClose: () => void,
    onSubmit: (removeItem: boolean[]) => void
}

export default function EditListDialog({title, items, visible, onClose, onSubmit} : EditListDialogProps){
    const [isChecked, setIsChecked] = useState<boolean[]>([]);
    const setChecked = (i: number, newState: boolean) => {
        setIsChecked(isChecked.map((_, j) => (i == j)? newState : isChecked[j]));
    }
    useEffect(() => {
        setIsChecked(new Array(items.length).fill(false));
    }, [visible]);

    const submit = () => {
        onClose();
        onSubmit(isChecked);
    }

    return <Portal>
        <Dialog visible={visible} onDismiss={onClose}>
            <Dialog.Title>
                <Text>{title}</Text>
            </Dialog.Title>
            <Dialog.Content>
                {items.map((item, i) => (
                    <Checkbox.Item
                        label={item}
                        status={isChecked[i]? "checked" : "unchecked"}
                        onPress={() => setChecked(i, !isChecked[i])}
                        position={"leading"}
                        labelStyle={{textAlign: "left"}}
                        key={item}
                    />
                ))}
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onClose}><Text>Cancel</Text></Button>
                <Button onPress={submit}><Text>Submit</Text></Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
}