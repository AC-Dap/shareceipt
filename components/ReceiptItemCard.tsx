import {StyleSheet} from "react-native";
import {useContext, useRef, useState} from "react";
import {ReceiptContext} from "../context/ReceiptContext";
import Text from "react-native-ui-lib/text";
import TouchableOpacity from "react-native-ui-lib/touchableOpacity";
import {ReceiptItemDialog} from "./dialogs/ReceiptItemDialog";
import {formatPrice} from "../utils/priceUtils";
import {ConfirmDialog} from "./dialogs/ConfirmDialog";
import {StylingConstants} from "../styling/BaseStyles";
import {IconButton} from "./base/IconButton";
import {ExpandableOptions, ExpandableOptionsRef} from "./ExpandableOptions";

type ReceiptItemCardProps = {
    itemIdx: number
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: StylingConstants.spacing.small,
        marginHorizontal: StylingConstants.spacing.large,
        marginVertical: StylingConstants.spacing.medium
    },
    name: {
        flex: 1,
        fontSize: StylingConstants.fontSizes.medium,
        marginRight: "auto"
    },
    price: {
        fontSize: StylingConstants.fontSizes.medium
    }
});

export const ReceiptItemCard = ({itemIdx}: ReceiptItemCardProps) => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);

    const [showDialog, setShowDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const removeItem = () => {
        updateReceipt({
            type: "REMOVE_ITEM",
            payload: itemIdx
        });
        setShowConfirmDialog(false);
    }

    const optionsRef = useRef<ExpandableOptionsRef | null>(null);

    return <>
        <TouchableOpacity style={styles.container} onPress={() => setShowDialog(true)}>
            <Text style={styles.name}>{receipt.receipt[itemIdx].name}</Text>
            <Text style={styles.price}>${formatPrice(receipt.receipt[itemIdx].priceCents)}</Text>
            <ExpandableOptions ref={optionsRef}>
                <IconButton
                    icon={"pencil"}
                    iconColor={StylingConstants.colors.secondary}
                    onPress={() => {
                        setShowDialog(true);
                        optionsRef.current?.hideActions();
                    }}
                />
                <IconButton
                    icon={"trash-o"}
                    iconColor={StylingConstants.colors.secondary}
                    onPress={() => {
                        setShowConfirmDialog(true);
                        optionsRef.current?.hideActions();
                    }}
                />
            </ExpandableOptions>
        </TouchableOpacity>

        <ConfirmDialog
            visible={showConfirmDialog}
            title={"Remove Item?"}
            message={`Are you sure you want to remove ${receipt.receipt[itemIdx].name} from the receipt?`}
            onCancel={() => setShowConfirmDialog(false)}
            onConfirm={removeItem}
        />
        <ReceiptItemDialog visible={showDialog} closeDialog={() => setShowDialog(false)} itemIdx={itemIdx}/>
    </>
}