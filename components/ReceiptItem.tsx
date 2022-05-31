import {useState} from "react";
import {Chip, Colors, IconButton} from "react-native-paper";
import {StyleSheet, TouchableOpacity} from "react-native";
import CircleAvatar from "./CircleAvatar";
import PersonOverview from "./PersonOverview";
import {PersonType} from "../screens/ReceiptSplitScreen";
import {calculateItemSplit} from "../utils/ReceiptItemUtils";
import TextInputDialog from "./TextInputDialog";
import {View, Text, ReceiptText} from "./theming";
import useThemeColor from "../hooks/useThemeColor";

type ReceiptItemProps = {
    name: string,
    price: number,
    party: PersonType[],
    peoplePaying: boolean[],
    removePerson: (person: PersonType) => void,
    addAll: () => void,
    editable: boolean,
    onItemChange: (newName: string, newPrice: number) => void
}

export default function ReceiptItem({ party, name, price, peoplePaying, removePerson, addAll, editable, onItemChange} : ReceiptItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [editingName, setEditingName] = useState(false);
    const openNameDialog = () => {
        if(editable) setEditingName(true);
    }
    const closeNameDialog = () => setEditingName(false);
    const submitNameDialog = (newName: string) => onItemChange(newName, price);

    const [editingPrice, setEditingPrice] = useState(false);
    const openPriceDialog = () => {
        if(editable) setEditingPrice(true);
    }
    const closePriceDialog = () => setEditingPrice(false);
    const submitPriceDialog = (newPrice: string) => onItemChange(name, (newPrice == "")? 0 : parseFloat(newPrice));

    const smallBtnColors = useThemeColor('text');
    const addAllBtnColor = useThemeColor('banner');
    let subheaderContent;
    if(isOpen){
        let rows = peoplePaying.flatMap((isPaying, i) => (
            (!isPaying) ? [] :
            <View style={styles.subheaderRow} key={party[i].id}>
                <IconButton icon={"minus"} color={smallBtnColors} onPress={() => removePerson(party[i])}/>
                <PersonOverview name={party[i].name} amountOwed={calculateItemSplit(price, peoplePaying)}/>
            </View>
        ));

        subheaderContent = (
            <>
                <View style={styles.subheaderRow}>
                    <ReceiptText>Shared with: </ReceiptText>
                    <Chip icon={"plus"} mode={"flat"}
                          style={[{backgroundColor: addAllBtnColor}, styles.addAllButton]}
                          onPress={addAll}>
                        <Text style={styles.addAllText}>Add all</Text>
                    </Chip>
                </View>
                {rows}
            </>
        );
    }else{
        let avatars = peoplePaying.flatMap((isPaying, i) => (
            (!isPaying) ? [] :
            <CircleAvatar size={20} name={party[i].name} key={party[i].id} style={styles.avatar}/>
        ));
        if(avatars.length > 3){
            avatars = avatars.slice(0, 3);
            avatars.push(<ReceiptText style={styles.avatar} key={"dots"}>...</ReceiptText>);
        }

        subheaderContent = (
            <View style={styles.subheaderRow}>
                <ReceiptText>Shared with: </ReceiptText>
                {avatars}
                <Chip icon={"plus"} mode={"flat"}
                        style={[{backgroundColor: addAllBtnColor}, styles.addAllButton]}
                        onPress={addAll}>
                    <Text style={styles.addAllText}>Add all</Text>
                </Chip>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <IconButton color={smallBtnColors} icon={"chevron-right"} onPress={() => setIsOpen(!isOpen)}
                        style={(isOpen) ? { transform: [{rotateZ: "90deg"}]} : {}}/>
            <View style={styles.infoContainer}>
                <View style={styles.itemDescription}>
                    <TouchableOpacity onPress={openNameDialog} style={styles.itemName}>
                        <ReceiptText>{name}</ReceiptText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openPriceDialog} style={styles.itemPrice}>
                        <ReceiptText>{`$${price.toFixed(2)}`}</ReceiptText>
                    </TouchableOpacity>
                </View>
                <View style={styles.subheader}>
                    {subheaderContent}
                </View>
            </View>

            <TextInputDialog
                visible={editingName} onClose={closeNameDialog}
                title={"Edit Name"} subtitle={"Name"} submitInput={submitNameDialog}
            />
            <TextInputDialog
                visible={editingPrice} onClose={closePriceDialog}
                title={"Edit Price"} subtitle={"Price"} submitInput={submitPriceDialog}
                keyboardType={"numeric"}
            />
        </View>
    );
}

ReceiptItem.defaultProps = {
    editable: false,
    onItemChange: () => {}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 10
    },
    infoContainer: {
        flex: 1,
        paddingRight: 10
    },
    itemDescription: {
        flexDirection: "row",
        alignItems: "center"
    },
    itemName: {

    },
    itemPrice: {
        marginLeft: "auto"
    },
    subheader: {
        marginLeft: 20,
        marginTop: 2
    },
    subheaderRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        marginHorizontal: 2
    },
    addAllButton: {
        marginLeft: 15,
        height: 22,
        justifyContent: "center"
    },
    addAllText: {
        fontSize: 12
    }
});
