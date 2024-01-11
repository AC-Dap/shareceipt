import {FlatList, StyleSheet} from "react-native";
import {useContext, useMemo, useState} from "react";
import {ReceiptContext} from "../context/ReceiptContext";
import {formatPrice} from "../utils/priceUtils";
import Text from "react-native-ui-lib/text";
import View from "react-native-ui-lib/view";
import ExpandableSection from "react-native-ui-lib/expandableSection";
import {ScanReceiptPrompt} from "../components/ScanReceiptPrompt";
import {FontAwesome} from "@expo/vector-icons";
import {BaseStyles, StylingConstants} from "../styling/BaseStyles";

const styles = StyleSheet.create({
    personResultsHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: StylingConstants.spacing.small,
        marginHorizontal: StylingConstants.spacing.large,
        marginVertical: StylingConstants.spacing.medium
    },
    headerNameText: {
        flex: 1,
        fontSize: StylingConstants.fontSizes.medium
    },
    headerPriceText: {
        fontSize: StylingConstants.fontSizes.medium
    },
    personResultsDetails: {
        marginLeft: StylingConstants.spacing.large,
        paddingLeft: StylingConstants.spacing.medium,
        borderLeftWidth: StylingConstants.borderWidth,
        borderLeftColor: StylingConstants.colors.lightgrey
    },
    detailsText: {
        fontSize: StylingConstants.fontSizes.medium,
        color: StylingConstants.colors.secondary
    }
});

const PersonResults = ({personIdx, itemPrices, amountOwed}: {
    personIdx: number,
    itemPrices: number[],
    amountOwed: number
}) => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);
    const [expanded, setExpanded] = useState(false);

    const details = receipt.matches[personIdx].map((match, itemIdx) => {
        if (!match) {
            return null;
        }

        return `Paid $${formatPrice(itemPrices[itemIdx])} for ${receipt.receipt[itemIdx].name}`;
    });
    details.push(
        `Paid $${formatPrice(receipt.taxCents / receipt.party.length)} for Tax`,
        `Paid $${formatPrice(receipt.tipCents / receipt.party.length)} for Tip`
    );

    const header = <View style={styles.personResultsHeader}>
        <Text style={styles.headerNameText}>{receipt.party[personIdx]}</Text>
        <Text style={styles.headerPriceText}>${formatPrice(amountOwed)}</Text>
        {expanded ? (
            <FontAwesome name={"chevron-up"} size={StylingConstants.iconSize}
                         color={StylingConstants.colors.secondary}/>
        ) : (
            <FontAwesome name={"chevron-down"} size={StylingConstants.iconSize}
                         color={StylingConstants.colors.secondary}/>
        )}
    </View>

    return (
        <ExpandableSection
            expanded={expanded}
            onPress={() => setExpanded(!expanded)}
            sectionHeader={header}
        >
            <View style={styles.personResultsDetails}>
                <FlatList
                    data={details}
                    renderItem={({item: detail}) => {
                        if (detail === null) {
                            return null;
                        } else {
                            return <Text style={styles.detailsText}>{detail}</Text>
                        }
                    }}
                    keyExtractor={(item, index) => `${item}-${index}`}
                />
            </View>
        </ExpandableSection>
    )
}

export const ResultsScreen = () => {
    const [receipt, updateReceipt] = useContext(ReceiptContext);

    const [itemPrices, totalOwed] = useMemo(() => {
        const numMatched = new Array(receipt.receipt.length).fill(0);
        receipt.matches.forEach(itemMatches => {
            itemMatches.forEach((match, itemIdx) => {
                if (match) {
                    numMatched[itemIdx]++;
                }
            });
        });

        const itemPrices = receipt.receipt.map((item, itemIdx) => {
            return item.priceCents / numMatched[itemIdx];
        });

        const baseOwed = (receipt.tipCents + receipt.taxCents) / receipt.party.length;
        const totalOwed = new Array(receipt.party.length).fill(baseOwed);
        receipt.matches.forEach((itemMatches, personIdx) => {
            totalOwed[personIdx] = itemMatches.reduce((total, match, itemIdx) => {
                if (match) {
                    return total + itemPrices[itemIdx];
                } else {
                    return total;
                }
            }, 0);
        });

        return [itemPrices, totalOwed];
    }, [receipt]);

    if (receipt.receipt.length == 0) {
        return <ScanReceiptPrompt/>
    }

    return (
        <FlatList
            data={receipt.party}
            renderItem={({index}) => <PersonResults personIdx={index} itemPrices={itemPrices}
                                                    amountOwed={totalOwed[index]}/>}
            keyExtractor={(item, index) => `${item}-${index}`}
            style={BaseStyles.screenContainer}
        />
    );
}