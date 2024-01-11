import {useContext, useState} from "react";
import {ReceiptContext} from "../context/ReceiptContext";
import View from "react-native-ui-lib/view";
import Text from "react-native-ui-lib/text";
import {FlatList, StyleSheet} from "react-native";
import {ReceiptItemDialog} from "../components/dialogs/ReceiptItemDialog";
import {ReceiptItemCard} from "../components/ReceiptItemCard";
import {TipTaxDialog} from "../components/dialogs/TipTaxDialog";
import {getReceiptTotal} from "../utils/receiptUtils";
import {formatPrice} from "../utils/priceUtils";
import {Divider} from "../components/base/Divider";
import {BaseStyles, StylingConstants} from "../styling/BaseStyles";
import {IconTextButton} from "../components/base/IconTextButton";
import TouchableOpacity from "react-native-ui-lib/touchableOpacity";
import {IconButton} from "../components/base/IconButton";

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: StylingConstants.spacing.large,
    },
    footerContainer: {
        margin: StylingConstants.spacing.large,
        gap: StylingConstants.spacing.small,
    },
    tiptaxContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: StylingConstants.spacing.small,
    },
    tiptaxLeft: {
        flex: 1
    },
    tiptaxText: {
        fontSize: StylingConstants.fontSizes.medium,
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginRight: 40,
    },
    totalText: {
        fontSize: StylingConstants.fontSizes.large,
        fontWeight: StylingConstants.fontWeights.bold
    }
});


export const ScanReceiptScreen = () => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showTipDialog, setShowTipDialog] = useState(false);
    const [showTaxDialog, setShowTaxDialog] = useState(false);

    return <View style={BaseStyles.screenContainer}>
        <View style={styles.actionContainer}>
            <IconTextButton icon={"camera"} text={"Scan Receipt"} onPress={() => {
            }}/>
            <IconTextButton icon={"plus"} text={"Add Item"} onPress={() => setShowAddDialog(true)}/>
        </View>

        <FlatList
            data={receipt.receipt}
            renderItem={({index}) => <ReceiptItemCard itemIdx={index}/>}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            ItemSeparatorComponent={() => <Divider fullWidth={false}/>}
        />

        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.tiptaxContainer} onPress={() => setShowTaxDialog(true)}>
                <Text style={[styles.tiptaxText, styles.tiptaxLeft]}>Tax:</Text>
                <Text style={styles.tiptaxText}>${formatPrice(receipt.taxCents)}</Text>
                <IconButton
                    icon={"pencil"}
                    iconColor={StylingConstants.colors.secondary}
                    onPress={() => setShowTaxDialog(true)}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tiptaxContainer} onPress={() => setShowTipDialog(true)}>
                <Text style={[styles.tiptaxText, styles.tiptaxLeft]}>Tip:</Text>
                <Text style={styles.tiptaxText}>${formatPrice(receipt.tipCents)}</Text>
                <IconButton
                    icon={"pencil"}
                    iconColor={StylingConstants.colors.secondary}
                    onPress={() => setShowTipDialog(true)}
                />
            </TouchableOpacity>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalText}>${formatPrice(getReceiptTotal(receipt))}</Text>
            </View>
        </View>

        <ReceiptItemDialog visible={showAddDialog} closeDialog={() => setShowAddDialog(false)}/>
        <TipTaxDialog visible={showTaxDialog} closeDialog={() => setShowTaxDialog(false)} isTip={false}/>
        <TipTaxDialog visible={showTipDialog} closeDialog={() => setShowTipDialog(false)} isTip={true}/>
    </View>
}