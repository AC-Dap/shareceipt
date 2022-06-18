import {Button, Checkbox, Dialog, Portal} from "react-native-paper";
import {useEffect, useState} from "react";
import {Text} from "./theming";
import {Fonts} from "../styling/StyleConstants";
import {ScrollView} from "react-native";

type EditListDialogProps = {
    title: string,
    items: {id: string, name: string}[],
    visible: boolean,
    onClose: () => void,
    onSubmit: (removeItem: boolean[]) => void
}

export default function EditListDialog({title, items, visible, onClose, onSubmit} : EditListDialogProps){
    const [isChecked, setIsChecked] = useState<boolean[]>([]);
    useEffect(() => setIsChecked(new Array(items.length).fill(false)), [items]);

    const setChecked = (i: number, newState: boolean) => {
        setIsChecked(isChecked.map((_, j) => (i == j)? newState : isChecked[j]));
    }

    const close = () => {
        onClose();
        setIsChecked(new Array(items.length).fill(false));
    }
    const submit = () => {
        onSubmit(isChecked);
        close();
    }

    return <Portal>
        <Dialog visible={visible} onDismiss={onClose}>
            <Dialog.Title>
                <Text>{title}</Text>
            </Dialog.Title>
            <Dialog.ScrollArea>
                <ScrollView>
                    {items.map((item, i) => (
                        <Checkbox.Item
                            label={item.name}
                            status={isChecked[i]? "indeterminate" : "unchecked"}
                            onPress={() => setChecked(i, !isChecked[i])}
                            position={"leading"}
                            labelStyle={{textAlign: "left", fontFamily: Fonts.normalFont}}
                            key={item.id}
                        />
                    ))}
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button onPress={close}><Text>Cancel</Text></Button>
                <Button onPress={submit}><Text>Submit</Text></Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
}