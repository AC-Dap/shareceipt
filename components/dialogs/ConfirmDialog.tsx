import {PanningProvider} from "react-native-ui-lib";
import Dialog from "react-native-ui-lib/dialog";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import Button from "react-native-ui-lib/button";
import {BaseStyles, StylingConstants} from "../../styling/BaseStyles";


type ConfirmDialogProps = {
    visible: boolean,
    title: string,
    message: string,
    onCancel: () => void,
    onConfirm: () => void
}

export const ConfirmDialog = ({visible, title, message, onCancel, onConfirm}: ConfirmDialogProps) => {
    return (
        <Dialog
            visible={visible}
            onDismiss={onCancel}
            panDirection={PanningProvider.Directions.DOWN}
            renderPannableHeader={() => <Text style={BaseStyles.dialogHeader}>{title}</Text>}
            containerStyle={BaseStyles.dialog}
            ignoreBackgroundPress
        >
            <Text style={{fontSize: StylingConstants.fontSizes.medium}}>{message}</Text>

            <View style={BaseStyles.dialogActions}>
                <Button label={"Cancel"} link onPress={onCancel}/>
                <Button label={"Ok"} link onPress={onConfirm}/>
            </View>
        </Dialog>
    )
}