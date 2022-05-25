import {SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, useColorScheme} from "react-native";
import PersonOverview from "../components/PersonOverview";
import {IconButton, TouchableRipple} from "react-native-paper";
import ReceiptItem from "../components/ReceiptItem";
import {useMemo, useState} from "react";
import 'react-native-get-random-values';
import {nanoid} from "nanoid";
import {calculateItemSplit, getRandomItemName} from "../utils/ReceiptItemUtils";
import {getRandomName} from "../utils/AvatarUtils";
import EditListDialog from "../components/EditListDialog";
import ReceiptOverviewFooter from "../components/ReceiptOverviewFooter";
import useThemeColor from "../hooks/useThemeColor";
import {Text, Banner} from "../components/theming";

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

    const [showEditPartyModal, setShowEditPartyModal] = useState(false);
    const openEditPartyModal = () => {
        setShowEditPartyModal(true);
    }
    const closeEditPartyModal = () => {
        setShowEditPartyModal(false);
    }
    const submitEditPartyModal = (toRemove: boolean[]) => {
        let people: PersonType[] = []
        toRemove.forEach((remove, i) => {
            if (remove) people.push(party[i]);
        });
        removePeople(people);
    }

    const [showEditReceiptModal, setShowEditReceiptModal] = useState(false);
    const openEditReceiptModal = () => {
        setShowEditReceiptModal(true);
    }
    const closeEditReceiptModal = () => {
        setShowEditReceiptModal(false);
    }
    const submitEditReceiptModal = (toRemove: boolean[]) => {
        let items: ReceiptItemType[] = []
        toRemove.forEach((remove, i) => {
            if (remove) items.push(receiptItems[i]);
        });
        removeReceiptItems(items);
    }

    const addPerson = () => {
        setParty([...party, {id: nanoid(), name: getRandomName()}]);
        setReceiptItems(receiptItems.map((item) => {
            item.peoplePaying.push(false);
            return item;
        }));
    }
    const editPerson = (person: PersonType, newName: string) => {
        setParty(party.map(el => {
            if (el === person) {
                el.name = newName;
            }

            return el;
        }));
    }
    const removePeople = (people: PersonType[]) => {
        let newParty = party;
        let newItems = receiptItems;

        people.forEach((person) => {
            const index = newParty.indexOf(person);
            newParty.splice(index, 1);
            receiptItems.forEach((item) => item.peoplePaying.splice(index, 1));
        })

        setParty(newParty);
        setReceiptItems(newItems);
    }

    const addReceiptItem = () => {
        setReceiptItems([...receiptItems, {
            id: nanoid(),
            name: getRandomItemName(),
            price: 0,
            peoplePaying: new Array(party.length).fill(false)
        }]);
    }
    const editReceiptItem = (item: ReceiptItemType, newName: string, newPrice: number) => {
        setReceiptItems(receiptItems.map((el) => {
            if (el === item) {
                el.name = newName;
                el.price = newPrice;
            }

            return el;
        }));
    }
    const removeReceiptItems = (items: ReceiptItemType[]) => {
        let newItems = receiptItems;

        items.forEach((item) => {
            const index = newItems.indexOf(item);
            newItems.splice(index, 1);
        })

        setReceiptItems(newItems);
    }
    const addPersonToItem = (item: ReceiptItemType, person: PersonType) => {
        setReceiptItems(receiptItems.map((el) => {
            if (el === item) {
                el.peoplePaying[party.indexOf(person)] = true;
            }

            return el;
        }));
    }
    const removePersonFromItem = (item: ReceiptItemType, person: PersonType) => {
        setReceiptItems(receiptItems.map((el) => {
            if (el === item) {
                el.peoplePaying[party.indexOf(person)] = false;
            }

            return el;
        }));
    }
    const addAllToItem = (item: ReceiptItemType) => {
        setReceiptItems(receiptItems.map((el) => {
            if (el === item) {
                el.peoplePaying.fill(true);
            }

            return el;
        }));
    }

    const [taxPercent, setTaxPercent] = useState(6.25);
    const [tipPercent, setTipPercent] = useState(15);

    // Update receiptSplit everytime receiptItems is updated
    const receiptSplit = useMemo(() => {
        let receiptSplit = (new Array(party.length)).fill(0);
        receiptItems.forEach((item => {
            const split = calculateItemSplit(item.price, item.peoplePaying);
            item.peoplePaying.forEach((isPaying, i) => {
                if (isPaying) receiptSplit[i] += split;
            })
        }));
        for(let i = 0; i < receiptSplit.length; i++) receiptSplit[i] *= (1 + (taxPercent + tipPercent)/100);
        return receiptSplit;
    }, [party, receiptItems, taxPercent, tipPercent]);

    const [selectedPerson, setSelectedPerson] = useState<PersonType | null>(null);
    const onSelectPerson = (person: PersonType) => {
        if (person === selectedPerson) {
            setSelectedPerson(null);
        } else {
            setSelectedPerson(person);
        }
    }

    const backgroundColor = useThemeColor("background");
    const highlightColor = useThemeColor("highlight");

    return (
        <SafeAreaView style={[{backgroundColor: backgroundColor}, styles.container]}>
            <Banner>
                <Text style={styles.bannerText}>Edit Party</Text>
                <IconButton icon={"plus"} onPress={addPerson}/>
                <IconButton icon={"minus"} onPress={openEditPartyModal}/>
            </Banner>
            <ScrollView style={styles.peopleScrollArea}>
                {party.map((person, i) => (
                    <TouchableOpacity
                        onPress={() => onSelectPerson(person)} key={person.id}
                        style={{backgroundColor: (person === selectedPerson) ? highlightColor : "transparent"}}
                    >
                        <PersonOverview
                            name={person.name} amountOwed={receiptSplit[i]}
                            editable={selectedPerson === null}
                            onNameChange={(newName) => editPerson(person, newName.trim())}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Banner>
                <Text style={styles.bannerText}>Edit Receipt</Text>
                <IconButton icon={"camera"} onPress={() => console.log("camera")}/>
                <IconButton icon={"plus"} onPress={addReceiptItem}/>
                <IconButton icon={"minus"} onPress={openEditReceiptModal}/>
            </Banner>
            <ScrollView style={styles.receiptScrollArea}>
                {receiptItems.map((item) => (
                    <TouchableRipple
                        disabled={selectedPerson === null}
                        onPress={() => addPersonToItem(item, selectedPerson!)}
                        key={item.id}
                    >
                        <ReceiptItem
                            party={party} name={item.name} price={item.price} peoplePaying={item.peoplePaying}
                            removePerson={(person) => removePersonFromItem(item, person)}
                            addAll={() => addAllToItem(item)}
                            editable={selectedPerson === null}
                            onItemChange={(newName, newPrice) => editReceiptItem(item, newName.trim(), newPrice)}
                        />
                    </TouchableRipple>
                ))}
            </ScrollView>

            <ReceiptOverviewFooter
                items={receiptItems}
                taxPercent={taxPercent} setTaxPercent={(newVal) => setTaxPercent(newVal)}
                tipPercent={tipPercent} setTipPercent={(newVal) => setTipPercent(newVal)}
            />

            <EditListDialog
                title={"Remove party members"}
                items={party.map((person) => person.name)}
                visible={showEditPartyModal}
                onClose={closeEditPartyModal}
                onSubmit={submitEditPartyModal}
            />

            <EditListDialog
                title={"Remove receipt items"}
                items={receiptItems.map((item) => item.name)}
                visible={showEditReceiptModal}
                onClose={closeEditReceiptModal}
                onSubmit={submitEditReceiptModal}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight
    },
    bannerText: {
        marginLeft: 10,
        marginRight: "auto",
        fontSize: 18
    },
    peopleScrollArea: {
        flex: 2
    },
    receiptScrollArea: {
        flex: 3
    }
});
