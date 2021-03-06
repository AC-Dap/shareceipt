import {StyleSheet, TouchableOpacity} from "react-native";
import CircleAvatar from "./CircleAvatar";
import {useState} from "react";
import TextInputDialog from "./TextInputDialog";
import {View, ReceiptText} from "./theming";

type PersonOverviewProps = {
    name: string,
    amountOwed: number,
    editable: boolean,
    onNameChange: (newName: string) => void;
}

export default function PersonOverview({ name, amountOwed, editable, onNameChange }: PersonOverviewProps) {
    const [editingName, setEditingName] = useState(false);
    const openDialog = () => {
        if(editable) setEditingName(true);
    }
    const closeDialog = () => {
        setEditingName(false);
    }

    return (
        <View style={styles.overviewContainer}>
            <CircleAvatar size={24} name={name}/>
            <TouchableOpacity onPress={openDialog}>
                <ReceiptText style={styles.nameText}>{name}</ReceiptText>
            </TouchableOpacity>
            <ReceiptText style={styles.amountOwedText}>{`$${amountOwed.toFixed(2)}`}</ReceiptText>

            <TextInputDialog
                visible={editingName}
                title={"Edit Name"}
                subtitle={"Name"}
                onClose={closeDialog}
                onSubmit={onNameChange}
            />
        </View>
    );
}

PersonOverview.defaultProps = {
    editable: false,
    onNameChange: () => {}
}

const styles = StyleSheet.create({
    overviewContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "transparent"
    },
    nameText: {
        marginLeft: 10
    },
    amountOwedText: {
        marginLeft: "auto"
    }
});
