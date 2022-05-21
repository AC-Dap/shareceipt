import {StyleSheet, TouchableOpacity} from "react-native";
import {ReceiptItemType} from "../screens/ReceiptSplitScreen";
import {useMemo, useState} from "react";
import TextInputDialog from "./TextInputDialog";
import Banner from "./theming/Banner";
import ReceiptText from "./theming/ReceiptText";

type ReceiptOverviewFooterProps = {
    items: ReceiptItemType[]
}

export default function ReceiptOverviewFooter({ items } : ReceiptOverviewFooterProps){
    const [taxPercent, setTaxPercent] = useState(6.25);
    const [tipPercent, setTipPercent] = useState(10);
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
                <ReceiptText>{`Tax: ${taxPercent}%`}</ReceiptText>
                <ReceiptText>{`($${(itemTotal * taxPercent / 100).toFixed(2)})`}</ReceiptText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.textContainer} onPress={() => setShowTipDialog(true)}>
                <ReceiptText>{`Tax: ${tipPercent}%`}</ReceiptText>
                <ReceiptText>{`($${(itemTotal * tipPercent / 100).toFixed(2)})`}</ReceiptText>
            </TouchableOpacity>
            <ReceiptText>{`Total: $${(itemTotal * (1 + (taxPercent + tipPercent)/ 100)).toFixed(2)}`}</ReceiptText>

            <TextInputDialog
                title={"Edit Tax"} subtitle={"Tax"}
                visible={showTaxDialog}
                onClose={() => setShowTaxDialog(false)}
                submitInput={(inp) => setTaxPercent(parseFloat(inp))}
                keyboardType={"numeric"}
            />

            <TextInputDialog
                title={"Edit Tip"} subtitle={"Tip"}
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