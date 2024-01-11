import Dialog from "react-native-ui-lib/dialog";
import {PanningProvider, TextField, TextFieldRef} from "react-native-ui-lib";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import Button from "react-native-ui-lib/button";
import {ReceiptContext} from "../../context/ReceiptContext";
import {createRef, useContext, useEffect, useState} from "react";
import {formatPrice, parsePriceString} from "../../utils/priceUtils";
import {getReceiptSubtotal} from "../../utils/receiptUtils";
import {BaseStyles, StylingConstants} from "../../styling/BaseStyles";

type TipTaxDialogProps = {
    visible: boolean,
    closeDialog: () => void,
    isTip: boolean
}

export const TipTaxDialog = ({visible, closeDialog, isTip}: TipTaxDialogProps) => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);
    const tipTaxString = isTip ? "Tip" : "Tax";

    const [percent, setPercent] = useState("");
    const [value, setValue] = useState("");

    const percentInput = createRef<TextFieldRef>();
    const valueInput = createRef<TextFieldRef>();

    const changePercent = (newPercent: string) => {
        setPercent(newPercent);
        const parsedPercent = parseFloat(newPercent);
        if (!isNaN(parsedPercent) && parsedPercent >= 0) {
            const receiptTotal = getReceiptSubtotal(receipt);
            setValue(`${formatPrice(parsedPercent / 100 * receiptTotal)}`);
        }


    }
    const changeValue = (newValue: string) => {
        setValue(newValue);

        const parsedValue = parsePriceString(newValue);
        if (!isNaN(parsedValue) && parsedValue >= 0) {
            const receiptTotal = getReceiptSubtotal(receipt);
            setPercent(`${(parsedValue / receiptTotal * 100).toFixed(2)}`);
        }
    }

    useEffect(() => {
        if (isTip) {
            changeValue(receipt.tipCents === 0 ? "" : formatPrice(receipt.tipCents));
        } else {
            changeValue(receipt.taxCents === 0 ? "" : formatPrice(receipt.taxCents));
        }
    }, [visible]);
    const onConfirm = () => {
        percentInput.current?.validate();
        valueInput.current?.validate();

        if (percent.length == 0 || value.length == 0) {
            return;
        }

        const parsedValue = parsePriceString(value);
        if (isNaN(parsedValue) || parsedValue < 0) {
            return;
        }

        if (isTip) {
            updateReceipt({
                type: "UPDATE_TIP",
                payload: parsedValue
            });
        } else {
            updateReceipt({
                type: "UPDATE_TAX",
                payload: parsedValue
            });
        }
        closeDialog();
    }

    return (
        <Dialog
            visible={visible}
            onDismiss={closeDialog}
            panDirection={PanningProvider.Directions.DOWN}
            renderPannableHeader={() => <Text style={BaseStyles.dialogHeader}>Enter {tipTaxString}</Text>}
            containerStyle={BaseStyles.dialog}
            ignoreBackgroundPress
        >
            <TextField
                // @ts-expect-error
                ref={percentInput}
                label={"Percent"}
                placeholder={"Enter Percentage"}
                inputMode={"numeric"}
                value={percent}
                onChangeText={changePercent}
                enableErrors
                validationMessage={"Percentage is required"}
                validate={"required"}
                style={BaseStyles.textInput}
                labelStyle={BaseStyles.textInputLabel}
                validationMessageStyle={BaseStyles.textInputError}
            />
            <TextField
                // @ts-expect-error
                ref={valueInput}
                label={`${tipTaxString} Value`}
                placeholder={`Enter ${tipTaxString}`}
                leadingAccessory={<Text style={{fontSize: StylingConstants.fontSizes.medium}}>$</Text>}
                inputMode={"numeric"}
                value={value}
                onChangeText={changeValue}
                enableErrors
                validationMessage={[`Invalid ${tipTaxString} Inputted`, `${tipTaxString} must be greater than 0`]}
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
                <Button label={"Done"} link onPress={onConfirm}/>
            </View>
        </Dialog>
    )
}