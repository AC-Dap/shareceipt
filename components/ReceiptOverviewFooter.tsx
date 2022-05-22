import {StyleSheet, TouchableOpacity} from "react-native";
import {ReceiptItemType} from "../screens/ReceiptSplitScreen";
import {useMemo, useState} from "react";
import TextInputDialog from "./TextInputDialog";
import {Text, Banner} from "./theming";

type ReceiptOverviewFooterProps = {
    items: ReceiptItemType[],
    taxPercent: number
    tipPercent: number,
    setTaxPercent: (newVal: number) => void,
    setTipPercent: (newVal: number) => void
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
                <Text>{`Tax: ${taxPercent}%`}</Text>
                <Text>{`($${(itemTotal * taxPercent / 100).toFixed(2)})`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textContainer} onPress={() => setShowTipDialog(true)}>
                <Text>{`Tax: ${tipPercent}%`}</Text>
                <Text>{`($${(itemTotal * tipPercent / 100).toFixed(2)})`}</Text>
            </TouchableOpacity>
            <Text>{`Total: $${(itemTotal * (1 + (taxPercent + tipPercent)/ 100)).toFixed(2)}`}</Text>

            <TextInputDialog
                title={"Edit Tax Percentage"} subtitle={"Tax"}
                visible={showTaxDialog}
                onClose={() => setShowTaxDialog(false)}
                submitInput={(inp) => setTaxPercent(parseFloat(inp))}
                keyboardType={"numeric"}
            />

            <TextInputDialog
                title={"Edit Tip Percentage"} subtitle={"Tip"}
                visible={showTipDialog}
                onClose={() => setShowTipDialog(false)}
                submitInput={(inp) => setTipPercent(parseFloat(inp))}
                keyboardType={"numeric"}
            />
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