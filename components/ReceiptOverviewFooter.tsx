import {StyleSheet, TouchableOpacity} from "react-native";
import {ReceiptItemType} from "../screens/ReceiptSplitScreen";
import {useMemo, useState} from "react";
import {Text, Banner} from "./theming";
import {Button, Dialog, Portal, TextInput} from "react-native-paper";

type ReceiptOverviewFooterProps = {
    items: ReceiptItemType[],
    taxPercent: number
    tipPercent: number,
    setTaxPercent: (newVal: number) => void,
    setTipPercent: (newVal: number) => void
}

type PercentAmountDialogProps = {
    visible: boolean,
    title: string,
    total: number,
    onClose: () => void,
    onSubmit: (newVal: number) => void
}

function PercentAmountDialog({ visible, title, total, onClose, onSubmit } : PercentAmountDialogProps){
    const [percent, setPercent] = useState("");
    const [amount, setAmount] = useState("");

    const close = () => {
        onClose();
        setPercent("");
        setAmount("");
    }
    const submit = () => {
        onSubmit((percent == "")? 0 : parseFloat(percent));
        close();
    }
    const newPercent = (val: string) => {
        setPercent(val);
        if(val == "") setAmount("");
        else setAmount((parseFloat(val) / 100 * total).toFixed(2));
    }
    const newAmount = (val: string) => {
        setAmount(val);
        if(val == "") setPercent("");
        else setPercent((parseFloat(val) / total * 100).toFixed(2));
    }

    return (
        <Dialog visible={visible} onDismiss={onClose}>
            <Dialog.Title><Text>{title}</Text></Dialog.Title>
            <Dialog.Content>
                <TextInput
                    label={"Percent"}
                    value={percent}
                    onChangeText={inp => newPercent(inp)}
                    keyboardType={"numeric"}
                />
                <TextInput
                    label={"Dollar Amount"}
                    value={amount}
                    onChangeText={inp => newAmount(inp)}
                    keyboardType={"numeric"}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={close}><Text>Cancel</Text></Button>
                <Button onPress={submit}><Text>Submit</Text></Button>
            </Dialog.Actions>
        </Dialog>
    );
}

export default function ReceiptOverviewFooter({ items, taxPercent, tipPercent, setTaxPercent, setTipPercent } : ReceiptOverviewFooterProps){
    const itemTotal = useMemo(() => {
        let sum = 0;
        items.forEach((item) => sum += item.price);
        return sum;
    }, [items]);

    const [showTaxDialog, setShowTaxDialog] = useState(false);
    const [showTipDialog, setShowTipDialog] = useState(false);

    return (
        <Banner style={styles.footer}>
            <TouchableOpacity style={styles.textContainer} onPress={() => setShowTaxDialog(true)}>
                <Text>{`Tax: ${taxPercent.toFixed(2)}%`}</Text>
                <Text>{`($${(itemTotal * taxPercent / 100).toFixed(2)})`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textContainer} onPress={() => setShowTipDialog(true)}>
                <Text>{`Tax: ${tipPercent.toFixed(2)}%`}</Text>
                <Text>{`($${(itemTotal * tipPercent / 100).toFixed(2)})`}</Text>
            </TouchableOpacity>
            <Text>{`Total: $${(itemTotal * (1 + (taxPercent + tipPercent)/ 100)).toFixed(2)}`}</Text>

            <Portal>
                <PercentAmountDialog
                    visible={showTaxDialog}
                    title={"Edit Tax"}
                    total={itemTotal}
                    onClose={() => setShowTaxDialog(false)}
                    onSubmit={(newVal) => setTaxPercent(newVal)}
                />

                <PercentAmountDialog
                    visible={showTipDialog}
                    title={"Edit Tip"}
                    total={itemTotal}
                    onClose={() => setShowTipDialog(false)}
                    onSubmit={(newVal) => setTipPercent(newVal)}
                />
            </Portal>
        </Banner>
    );
}

const styles = StyleSheet.create({
    footer: {
        marginTop: "auto",
        justifyContent: "space-between",
        padding: 10
    },
    textContainer: {
        backgroundColor: "transparent",
        alignItems: "center"
    }
});