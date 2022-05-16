import {Text, View} from "../components/Themed";
import {SafeAreaView, ScrollView, StatusBar, StyleSheet} from "react-native";
import PersonOverview from "../components/PersonOverview";
import {IconButton} from "react-native-paper";
import ReceiptItem from "../components/ReceiptItem";
import {useEffect, useMemo, useState} from "react";
import 'react-native-get-random-values';
import {nanoid} from "nanoid";
import {calculateItemSplit} from "../utils/ReceiptItemUtils";
import {getRandomName} from "../utils/AvatarUtils";

export type PersonType = {
    id: string,
    name: string
}

export type ReceiptItemType = {
    id: string,
    name: string,
    price: number,
    peoplePaying: boolean[]
}

export default function ReceiptSplitScreen() {
    const [party, setParty] = useState<PersonType[]>([]);
    const [receiptItems, setReceiptItems] = useState<ReceiptItemType[]>([]);

    const addPerson = () => {
        setParty([...party, {id: nanoid(), name: getRandomName()}]);
        setReceiptItems(receiptItems.map((item) => {
            item.peoplePaying.push(false);
            return item;
        }));
    }
    const editPerson = (person: PersonType, newName: string) => {
        setParty(party.map(el => {
            if(el === person){
                el.name = newName;
            }

            return el;
        }));
    }
    const removePerson = (person: PersonType) => {
        const index = party.indexOf(person);
        setParty(party.filter((_, i) => i !== index));
        setReceiptItems(receiptItems.map((item, i) => {
            item.peoplePaying.splice(index, 1);
            return item;
        }));
    }

    const addReceiptItem = () => {
        setReceiptItems([...receiptItems, {
            id: nanoid(), name: "", price: 0, peoplePaying: new Array(party.length).fill(false)
        }]);
    }
    const editReceiptItem = (item: ReceiptItemType, newName: string, newPrice: number) => {
        setReceiptItems(receiptItems.map((el) => {
            if(el === item){
                el.name = newName;
                el.price = newPrice;
            }

            return el;
        }));
    }
    const removeReceiptItem = (item: ReceiptItemType) => {
        setReceiptItems(receiptItems.filter((el) => el !== item));
    }
    const addPersonToItem = (item: ReceiptItemType, person: PersonType) => {
        setReceiptItems(receiptItems.map((el) => {
            if(el === item){
                el.peoplePaying[party.indexOf(person)] = true;
            }

            return el;
        }));
    }
    const removePersonFromItem = (item: ReceiptItemType, person: PersonType) => {
        setReceiptItems(receiptItems.map((el) => {
            if(el === item){
                el.peoplePaying[party.indexOf(person)] = false;
            }

            return el;
        }));
    }
    const addAllToItem = (item: ReceiptItemType) => {
        setReceiptItems(receiptItems.map((el) => {
            if(el === item){
                el.peoplePaying.fill(true);
            }

            return el;
        }));
    }

    // Update receiptSplit everytime receiptItems is updated
    const receiptSplit = useMemo(() => {
        let receiptSplit = (new Array(party.length)).fill(0);
        receiptItems.forEach((item => {
            const split = calculateItemSplit(item.price, item.peoplePaying);
            item.peoplePaying.forEach((isPaying, i) => {
                if(isPaying) receiptSplit[i] += split;
            })
        }));
        return receiptSplit;
    }, [party, receiptItems]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.banner}>
                <Text style={styles.bannerText}>Edit Partyyyyyy</Text>
                <IconButton icon={"plus"} onPress={addPerson}/>
                <IconButton icon={"minus"} onPress={() => {
                    editPerson(party[0], "Bob James");
                    editPerson(party[1], "Adam");
                    editPerson(party[2], "Steeeeve Wander");
                }}/>
            </View>
            <ScrollView style={styles.peopleScrollArea}>
                {party.map((person, i) => (
                    <PersonOverview
                        name={person.name} amountOwed={receiptSplit[i]} key={person.id}
                        editable={true} onNameChange={(newName) => editPerson(person, newName)}
                    />
                ))}
            </ScrollView>
            <View style={styles.banner}>
                <Text style={styles.bannerText}>Edit Receipt</Text>
                <IconButton icon={"camera"} onPress={() => console.log("camera")}/>
                <IconButton icon={"plus"} onPress={addReceiptItem}/>
                <IconButton icon={"minus"} onPress={() => {
                    editReceiptItem(receiptItems[0], "Pasta", 14.99);
                    addAllToItem(receiptItems[0]);

                    editReceiptItem(receiptItems[1], "Brownies", 3.99);
                    addPersonToItem(receiptItems[1], party[2]);
                }}/>
            </View>
            <ScrollView style={styles.receiptScrollArea}>
                {receiptItems.map((item) => (
                    <ReceiptItem
                        party={party} name={item.name} price={item.price} peoplePaying={item.peoplePaying}
                        removePerson={(person) => removePersonFromItem(item, person)}
                        addAll={() => addAllToItem(item)}
                        key={item.id}
                    />
                ))}
            </ScrollView>
            <View style={[styles.banner, styles.footer]}>
                <Text>Tax</Text>
                <Text>Tip</Text>
                <Text>Total</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight
    },
    banner: {
        height: 50,
        backgroundColor: "#0cb4ab",
        flexDirection: "row",
        alignItems: "center"
    },
    bannerText: {
        marginLeft: 10,
        marginRight: "auto"
    },
    peopleScrollArea: {
        flex: 2
    },
    receiptScrollArea: {
        flex: 3
    },
    footer: {
        marginTop: "auto",
        justifyContent: "space-between",
        padding: 10
    }
});
