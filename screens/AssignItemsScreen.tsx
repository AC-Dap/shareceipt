import {useContext, useState} from "react";
import {ReceiptContext} from "../context/ReceiptContext";
import {FlatList, StyleSheet} from "react-native";
import View from "react-native-ui-lib/view"
import Button from "react-native-ui-lib/button";
import Text from "react-native-ui-lib/text";
import {formatPrice} from "../utils/priceUtils";
import {ScanReceiptPrompt} from "../components/ScanReceiptPrompt";
import {FontAwesome} from "@expo/vector-icons";
import {BaseStyles, StylingConstants} from "../styling/BaseStyles";
import {PersonToggle} from "../components/PersonToggle";

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: StylingConstants.spacing.small,
        marginHorizontal: StylingConstants.spacing.large,
    },
    itemTextContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        flex: 1
    },
    itemText: {
        fontSize: StylingConstants.fontSizes.medium,
        textAlign: "center"
    },
    list: {
        marginTop: StylingConstants.spacing.medium,
        marginBottom: StylingConstants.spacing.medium
    },
    addAllButton: {
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: StylingConstants.colors.secondary,
    },
    addAllText: {
        color: "white",
        fontSize: StylingConstants.fontSizes.small
    }
});

export const AssignItemsScreen = () => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);

    const [selectedItem, setSelectedItem] = useState(0);
    const prevItem = () => setSelectedItem(selectedItem - 1);
    const nextItem = () => setSelectedItem(selectedItem + 1);

    if (receipt.receipt.length == 0) {
        return <ScanReceiptPrompt/>
    }

    const addAll = () => {
        for (let personIdx = 0; personIdx < receipt.party.length; personIdx++) {
            updateReceipt({
                type: "UPDATE_MATCH",
                payload: {
                    personIdx,
                    receiptItemIdx: selectedItem,
                    match: true
                }
            });
        }
    }

    return <View style={BaseStyles.screenContainer}>
        <View style={styles.header}>
            <Button
                onPress={prevItem}
                disabled={selectedItem === 0}
                backgroundColor={StylingConstants.colors.primary}
            >
                <FontAwesome name={"chevron-left"} size={StylingConstants.iconSize} color="white"/>
            </Button>
            <View style={styles.itemTextContainer}>
                <Text style={styles.itemText} numberOfLines={1}>{receipt.receipt[selectedItem].name}</Text>
                <Text style={styles.itemText}
                      numberOfLines={1}>${formatPrice(receipt.receipt[selectedItem].priceCents)}</Text>
            </View>
            <Button
                onPress={nextItem}
                disabled={selectedItem === receipt.receipt.length - 1}
                backgroundColor={StylingConstants.colors.primary}
            >
                <FontAwesome name={"chevron-right"} size={StylingConstants.iconSize} color="white"/>
            </Button>
        </View>

        <FlatList
            data={receipt.party}
            renderItem={({index}) => <PersonToggle personIdx={index} itemIdx={selectedItem}/>}
            keyExtractor={(item, index) => `${item}-${index}`}
            style={styles.list}
        />

        <Button
            label={"Add All"}
            size={Button.sizes.medium}
            onPress={addAll}
            labelStyle={styles.addAllText}
            style={styles.addAllButton}
        />
    </View>
}