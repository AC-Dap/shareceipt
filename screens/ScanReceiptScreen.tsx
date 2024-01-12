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
import {scanReceiptFromCamera, scanReceiptFromGallery, ScanResult, ScanResultStatus} from "../utils/scanReceiptUtils";

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginHorizontal: StylingConstants.spacing.large,
    },
    addItemButton: {
        marginLeft: "auto"
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

    const scanFromCamera = async () => {handleScanResults(await scanReceiptFromCamera())};
    const scanFromGallery = async () => {handleScanResults(await scanReceiptFromGallery())};
    const handleScanResults = (results: ScanResult) => {
        if(results.status !== ScanResultStatus.Success) return;

        updateReceipt({
            type: "SET_RECEIPT",
            payload: results.receipt.receipt
        });
        updateReceipt({
            type: "UPDATE_TAX",
            payload: results.receipt.taxCents
        });
        updateReceipt({
            type: "UPDATE_TIP",
            payload: results.receipt.tipCents
        });
    }

    return <View style={BaseStyles.screenContainer}>
        <View style={styles.actionContainer}>
            <IconButton icon={"camera"} onPress={scanFromCamera}/>
            <IconButton icon={"picture-o"} onPress={scanFromGallery}/>
            <IconTextButton
                icon={"plus"}
                text={"Add Item"}
                onPress={() => setShowAddDialog(true)}
                style={styles.addItemButton}
            />
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