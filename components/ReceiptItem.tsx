import {useState} from "react";
import {Text, View} from "./Themed";
import {Avatar, Button, Chip, Colors, IconButton} from "react-native-paper";
import {getInitials, nameToColor} from "../utils/AvatarUtils";
import {StyleSheet} from "react-native";
import CircleAvatar from "./Avatar";
import PersonOverview from "./PersonOverview";

type ReceiptItemProps = {
    itemName: string,
    itemPrice: number,
    peoplePaying: string[]
}

export default function ReceiptItem({ itemName, itemPrice, peoplePaying} : ReceiptItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const addAll = () => {
        console.log(`Add all to ${itemName}`);
    }

    let subheaderContent;

    if(isOpen){
        let rows = peoplePaying.map((person, i) => (
            <View style={styles.subheaderRow} key={`${person}${i}`}>
                <IconButton icon={"minus"} color={Colors.blue300}/>
                <PersonOverview name={person} amountOwed={itemPrice / peoplePaying.length}/>
            </View>
        ));

        subheaderContent = (
            <>
                <View style={styles.subheaderRow}>
                    <Text>Shared with: </Text>
                    <Chip icon={"plus"} mode={"flat"}
                          style={styles.addAllButton}
                          onPress={addAll}>
                        <Text style={styles.addAllText}>Add all</Text>
                    </Chip>
                </View>
                {rows}
            </>
        );
    }else{
        let avatars = peoplePaying.map((person, i) => (
            <CircleAvatar size={20} name={person} key={`${person}${i}`} style={styles.avatar}/>
        ));
        if(avatars.length > 3){
            avatars = avatars.slice(0, 3);
            avatars.push(<Text style={styles.avatar} key={"dots"}>...</Text>);
        }

        subheaderContent = (
            <View style={styles.subheaderRow}>
                <Text>Shared with: </Text>
                {avatars}
                <Chip icon={"plus"} mode={"flat"}
                        style={styles.addAllButton}
                        onPress={addAll}>
                    <Text style={styles.addAllText}>Add all</Text>
                </Chip>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <IconButton color={Colors.blue300} icon={"chevron-right"} onPress={() => setIsOpen(!isOpen)}
                        style={(isOpen) ? { transform: [{rotateZ: "90deg"}]} : {}}/>
            <View style={styles.infoContainer}>
                <View style={styles.itemDescription}>
                    <Text style={styles.itemName}>{itemName}</Text>
                    <Text style={styles.itemPrice}>{`$${itemPrice.toFixed(2)}`}</Text>
                </View>
                <View style={styles.subheader}>
                    {subheaderContent}
                </View>
            </View>
        </View>
    );
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
        justifyContent: "center",
        backgroundColor: Colors.amber300
    },
    addAllText: {
        fontSize: 12
    }
});
