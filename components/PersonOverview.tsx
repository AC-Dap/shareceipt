import {View, Text} from "./Themed";
import {StyleSheet, TouchableOpacity} from "react-native";
import CircleAvatar from "./CircleAvatar";
import {useState} from "react";
import TextInputDialog from "./TextInputDialog";

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
                <Text style={styles.nameText}>{name}</Text>
            </TouchableOpacity>
            <Text style={styles.amountOwedText}>{`$${amountOwed.toFixed(2)}`}</Text>

            <TextInputDialog
                visible={editingName} onClose={closeDialog}
                title={"Edit Name"} subtitle={"Name"} submitInput={onNameChange}
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
