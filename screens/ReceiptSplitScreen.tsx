import {Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity} from "react-native";
import PersonOverview from "../components/PersonOverview";
import {IconButton, Portal, TouchableRipple} from "react-native-paper";
import ReceiptItem from "../components/ReceiptItem";
import {useMemo, useRef, useState} from "react";
import 'react-native-get-random-values';
import {nanoid} from "nanoid";
import {calculateItemSplit, getRandomItemName} from "../utils/ReceiptItemUtils";
import {getRandomName} from "../utils/AvatarUtils";
import EditListDialog from "../components/EditListDialog";
import ReceiptOverviewFooter from "../components/ReceiptOverviewFooter";
import useThemeColor from "../hooks/useThemeColor";
import {Banner, Text} from "../components/theming";
import {
    getPendingResultAsync,
    ImagePickerOptions,
    launchCameraAsync, launchImageLibraryAsync,
    MediaTypeOptions
} from "expo-image-picker";
import MLKit, {MLKTextLine} from "react-native-mlkit-ocr/src";

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
        const people: PersonType[] = party.filter((_, i) => toRemove[i]);
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
        const items: ReceiptItemType[] = receiptItems.filter((_, i) => toRemove[i]);
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
        let newParty = [...party];
        let newItems = [...receiptItems];

        people.forEach((person) => {
            const index = newParty.indexOf(person);
            newParty.splice(index, 1);
            newItems.forEach((item) => item.peoplePaying.splice(index, 1));
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
        let newItems = [...receiptItems];

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
        // Scale everything by the tip and tax
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

    const pictureOptions: ImagePickerOptions = {
        allowsMultipleSelection: false,
        allowsEditing: true,
        mediaTypes: MediaTypeOptions.Images,
        quality: 0.1
    };

    const [imgUri, setImgUri] = useState("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png");

    const recognizeFromCamera = async () => {
        // Get image from camera
        const image = await launchCameraAsync(pictureOptions);
        console.log(image);
        if(image.cancelled) return;

        await parseImage(image.uri);
    };

    const recognizeFromGallery = async () => {
        // Get image from gallery
        const image = await launchImageLibraryAsync(pictureOptions);
        console.log(image);
        if(image.cancelled) return;

        setImgUri(image.uri);

        await parseImage(image.uri);
    }

    const [debugLines, setDebugLines] = useState("");
    const parseImage = async (imageUri: string) => {
        setImgUri("HI");

        // Read text from image and split into lines
        const recognizedText = await MLKit.detectFromUri(imageUri);
        const recognizedLines = recognizedText.flatMap(block => block.lines);

        setImgUri("SEFSEF");

        // Categorize lines depending on if they seem to have text or numbers
        let textBlocks: MLKTextLine[] = [];
        let numBlocks: MLKTextLine[] = [];
        recognizedLines.forEach((line) => {
            if(/^[\d$ \n.]+$/.test(line.text)) numBlocks.push(line);
            else textBlocks.push(line);
            // console.log("--------");
            // console.log(line);
            // console.log("--------");
        });
        // console.log(textBlocks);
        // console.log(numBlocks);

        // Sort so we loop through from top -> bottom
        textBlocks.sort((a, b) => a.bounding.top - b.bounding.top);
        numBlocks.sort((a, b) => a.bounding.top - b.bounding.top);

        // For each text line, find all the num lines that have the majority of their bounding box on the same level
        // Attempts to correctly pair together item names + prices
        type Line = {
            text: string, nums: string[]
        }
        let lines: Line[] = textBlocks.map((block) => ({text: block.text, nums:[]}));
        numBlocks.forEach((block) => {
            let maxOverlap = 0;
            let maxOverlapI = -1;

            // Go through each text block and find the one with the largest overlap
            const blockTop = block.bounding.top;
            const blockBottom = block.bounding.top + block.bounding.height;
            textBlocks.forEach((textBlock, i) => {
                const textBlockTop = textBlock.bounding.top;
                const textBlockBottom = textBlock.bounding.top + textBlock.bounding.height;

                const overlap = Math.max(0, Math.min(blockBottom, textBlockBottom) - Math.max(blockTop, textBlockTop));
                if(overlap > maxOverlap){
                    maxOverlap = overlap;
                    maxOverlapI = i;
                }
            });

            if(maxOverlapI != -1) lines[maxOverlapI].nums.push(block.text);
        });

        console.log(lines);
        setDebugLines(lines.map(line => `${line.text}: ${line.nums.join(", ")}`).join("\n"));
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

            {(imgUri !== "") && <>
                <Text>{imgUri}</Text>
                <Image style={{width: "100%", height:300, resizeMode:'contain'}} source={{uri: imgUri}}/>
                <Text>{debugLines}</Text>
            </>}

            <Banner>
                <Text style={styles.bannerText}>Edit Receipt</Text>
                <IconButton icon={"image"} onPress={recognizeFromGallery}/>
                <IconButton icon={"camera"} onPress={recognizeFromCamera}/>
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
                items={party.map((person) => ({
                    name: person.name,
                    id: person.id
                }))}
                visible={showEditPartyModal}
                onClose={closeEditPartyModal}
                onSubmit={submitEditPartyModal}
            />

            <EditListDialog
                title={"Remove receipt items"}
                items={receiptItems.map((item) => ({
                    name: item.name,
                    id: item.id
                }))}
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
