import Dialog from "react-native-ui-lib/dialog";
import {PanningProvider} from "react-native-ui-lib";
import Text from "react-native-ui-lib/text";
import {FlatList} from "react-native";
import View from "react-native-ui-lib/view";
import Button from "react-native-ui-lib/button";
import {useContext, useEffect, useState} from "react";
import {ReceiptContext} from "../../context/ReceiptContext";
import {getAllParties, loadParty, removeParty} from "../../utils/partyStorage";
import {PartyCard} from "../PartyCard";
import {ConfirmDialog} from "./ConfirmDialog";
import {BaseStyles, StylingConstants} from "../../styling/BaseStyles";
import {Divider} from "../base/Divider";

type AllPartiesDialogProps = {
    visible: boolean,
    closeDialog: () => void
}

export const AllPartiesDialog = ({visible, closeDialog}: AllPartiesDialogProps) => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [parties, setParties] = useState<string[]>([]);

    const [partyToRemove, setPartyToRemove] = useState<string>("");
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const readParties = async () => {
        try {
            const storedParties = await getAllParties();
            setParties(storedParties);
            setErrorMessage("");
        } catch (e) {
            setParties([]);
            setErrorMessage(e.message);
        }
    }

    useEffect(() => {
        readParties();
    }, [visible]);

    const onLoadParty = async (party: string) => {
        try {
            const partyMembers = await loadParty(party);
            updateReceipt({
                type: "SET_PARTY",
                payload: partyMembers
            });
            closeDialog();
        } catch (e) {
            setErrorMessage(e.message);
        }
    }

    const confirmRemoveParty = (party: string) => {
        setPartyToRemove(party);
        setShowConfirmDialog(true);
    }
    const onRemoveParty = async () => {
        setShowConfirmDialog(false);
        try {
            await removeParty(partyToRemove);
            await readParties();
            setErrorMessage("");
        } catch (e) {
            setErrorMessage(e.message);
        }
    }

    return <>
        <Dialog
            visible={visible}
            onDismiss={closeDialog}
            panDirection={PanningProvider.Directions.DOWN}
            renderPannableHeader={() => <Text style={BaseStyles.dialogHeader}>Manage Saved Parties</Text>}
            containerStyle={BaseStyles.dialog}
            ignoreBackgroundPress
        >
            <FlatList
                data={parties}
                renderItem={({item: party}) =>
                    <PartyCard party={party} onLoad={() => onLoadParty(party)}
                               onRemove={() => confirmRemoveParty(party)}/>}
                keyExtractor={party => party}
                ItemSeparatorComponent={() => <Divider fullWidth={false}/>}
            />

            {errorMessage !== "" && <>
                <Text color={StylingConstants.colors.error}>An unexpected error has occurred:</Text>
                <Text color={StylingConstants.colors.error}>{errorMessage}</Text>
            </>}

            <View style={BaseStyles.dialogActions}>
                <Button label={"Close"} link onPress={closeDialog}/>
            </View>
        </Dialog>

        <ConfirmDialog
            visible={showConfirmDialog}
            title={"Remove Party?"}
            message={`Are you sure you want to remove "${partyToRemove}"?`}
            onCancel={() => setShowConfirmDialog(false)}
            onConfirm={onRemoveParty}
        />
    </>
}