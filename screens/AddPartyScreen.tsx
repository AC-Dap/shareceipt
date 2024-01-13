import {FlatList, StyleSheet} from "react-native";
import {useContext, useState} from "react";
import {ReceiptContext} from "../context/ReceiptContext";
import View from "react-native-ui-lib/view";
import {PersonCard} from "../components/PersonCard";
import {PersonDialog} from "../components/dialogs/PersonDialog";
import {SavePartyDialog} from "../components/dialogs/SavePartyDialog";
import {AllPartiesDialog} from "../components/dialogs/AllPartiesDialog";
import {Divider} from "../components/base/Divider";
import {IconButton} from "../components/base/IconButton";
import {BaseStyles, StylingConstants} from "../styling/BaseStyles";
import {IconTextButton} from "../components/base/IconTextButton";

const styles = StyleSheet.create({
    actionContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: StylingConstants.spacing.large,
        marginHorizontal: StylingConstants.spacing.large,
    },
    addButton: {
        marginLeft: "auto"
    }
});

export const AddPartyScreen = () => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showPartiesDialog, setShowPartiesDialog] = useState(false);

    return <View style={BaseStyles.screenContainer}>
        <View style={styles.actionContainer}>
            <IconButton icon={"save"} onPress={() => setShowSaveDialog(true)}/>
            <IconButton icon={"users"} onPress={() => setShowPartiesDialog(true)}/>

            <IconTextButton
                icon={"user-plus"}
                text={"Add Member"}
                onPress={() => setShowAddDialog(true)}
                style={styles.addButton}
            />
        </View>

        <FlatList
            data={receipt.party}
            renderItem={({index}) => <PersonCard personIdx={index}/>}
            keyExtractor={(item, index) => `${item}-${index}`}
            ItemSeparatorComponent={() => <Divider fullWidth={false}/>}
            removeClippedSubviews={false}
        />

        <PersonDialog visible={showAddDialog} closeDialog={() => setShowAddDialog(false)}/>
        <SavePartyDialog visible={showSaveDialog} closeDialog={() => setShowSaveDialog(false)}/>
        <AllPartiesDialog visible={showPartiesDialog} closeDialog={() => setShowPartiesDialog(false)}/>
    </View>
}