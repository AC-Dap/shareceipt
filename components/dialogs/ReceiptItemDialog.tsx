import {createRef, useContext, useEffect, useState} from "react";
import {ReceiptContext} from "../../context/ReceiptContext";
import {PanningProvider, TextField, TextFieldRef} from "react-native-ui-lib";
import Text from "react-native-ui-lib/text";
import Dialog from "react-native-ui-lib/dialog";
import View from "react-native-ui-lib/view";
import Button from "react-native-ui-lib/button";
import {formatPrice, parsePriceString} from "../../utils/priceUtils";
import {BaseStyles, StylingConstants} from "../../styling/BaseStyles";

type ReceiptItemDialogProps = {
    visible: boolean,
    closeDialog: () => void,
    itemIdx?: number
}

const ReceiptItemDialogHeader = ({isEdit}: { isEdit: boolean }) => {
    return <Text style={BaseStyles.dialogHeader}>{isEdit ? "Edit Receipt Item" : "Add Receipt Item"}</Text>
}

export const ReceiptItemDialog = ({visible, closeDialog, itemIdx}: ReceiptItemDialogProps) => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);
    const isEdit = itemIdx !== undefined;

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const nameInput = createRef<TextFieldRef>();
    const priceInput = createRef<TextFieldRef>();
    useEffect(() => {
        setName(isEdit ? receipt.receipt[itemIdx!].name : "");
        setPrice(isEdit ? formatPrice(receipt.receipt[itemIdx!].priceCents) : "");
    }, [visible, itemIdx]);

    const completeDialog = () => {
        nameInput.current?.validate();
        priceInput.current?.validate();

        if (name.length == 0) {
            return;
        }

        const parsedPrice = parsePriceString(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return;
        }

        const newItem = {name, priceCents: parsedPrice}

        if (isEdit) {
            updateReceipt({
                type: "UPDATE_ITEM",
                payload: {
                    idx: itemIdx!,
                    item: newItem
                }
            });
        } else {
            updateReceipt({
                type: "ADD_ITEM",
                payload: newItem
            });
        }

        closeDialog();
    }

    return <Dialog
        visible={visible}
        onDismiss={closeDialog}
        panDirection={PanningProvider.Directions.DOWN}
        renderPannableHeader={ReceiptItemDialogHeader}
        pannableHeaderProps={{isEdit}}
        containerStyle={BaseStyles.dialog}
        ignoreBackgroundPress
    >
        <TextField
            // @ts-expect-error
            ref={nameInput}
            label={"Item Name"}
            placeholder={"Enter Name"}
            value={name}
            onChangeText={setName}
            enableErrors
            validationMessage={"Name is required"}
            validate={"required"}
            style={BaseStyles.textInput}
            labelStyle={BaseStyles.textInputLabel}
            validationMessageStyle={BaseStyles.textInputError}
        />

        <TextField
            // @ts-expect-error
            ref={priceInput}
            label={"Item Price"}
            placeholder={"Enter Price"}
            leadingAccessory={<Text style={{fontSize: StylingConstants.fontSizes.medium}}>$</Text>}
            inputMode={"numeric"}
            value={price}
            onChangeText={setPrice}
            enableErrors
            validationMessage={["Invalid Price Inputted", "Price must be greater than 0"]}
            validate={['number', (val: string) => !isNaN(parsePriceString(val)) && parsePriceString(val) >= 0]}
            formatter={value => {
                const parsedPrice = parsePriceString(value);
                return isNaN(parsedPrice) ? value : formatPrice(parsedPrice);
            }}
            style={BaseStyles.textInput}
            labelStyle={BaseStyles.textInputLabel}
            validationMessageStyle={BaseStyles.textInputError}
        />

        <View style={BaseStyles.dialogActions}>
            <Button label={"Cancel"} link onPress={closeDialog}/>
            <Button label={"Done"} link onPress={completeDialog}/>
        </View>
    </Dialog>
}