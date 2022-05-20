import {Text, View} from "./Themed";
import {StyleSheet, TouchableOpacity} from "react-native";
import {ReceiptItemType} from "../screens/ReceiptSplitScreen";
import {useMemo, useState} from "react";
import TextInputDialog from "./TextInputDialog";

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
        <View style={[styles.banner, styles.footer]}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        height: 50,
        backgroundColor: "#0cb4ab",
        flexDirection: "row",
        alignItems: "center"
    },
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