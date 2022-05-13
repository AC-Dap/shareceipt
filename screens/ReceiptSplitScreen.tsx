import {Text, View} from "../components/Themed";
import {SafeAreaView, ScrollView, StatusBar, StyleSheet} from "react-native";
import PersonOverview from "../components/PersonOverview";
import {IconButton} from "react-native-paper";
import ReceiptItem from "../components/ReceiptItem";

export default function ReceiptSplitScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.banner}>
                <Text style={styles.bannerText}>Edit Partyyyyyy</Text>
                <IconButton icon={"plus"} onPress={() => console.log("plus")}/>
                <IconButton icon={"minus"} onPress={() => console.log("minus")}/>
            </View>
            <ScrollView style={styles.peopleScrollArea}>
                <PersonOverview name={"Jimmy Joe"} amountOwed={0.01}/>
                <PersonOverview name={"Adam"} amountOwed={13.80}/>
                <PersonOverview name={"A B C"} amountOwed={4.22888}/>
                <PersonOverview name={"!!!"} amountOwed={0.56}/>
            </ScrollView>
            <View style={styles.banner}>
                <Text style={styles.bannerText}>Edit Receipt</Text>
                <IconButton icon={"camera"} onPress={() => console.log("camera")}/>
                <IconButton icon={"plus"} onPress={() => console.log("plus")}/>
                <IconButton icon={"minus"} onPress={() => console.log("minus")}/>
            </View>
            <ScrollView style={styles.receiptScrollArea}>
                <ReceiptItem itemName={"Pasta"} itemPrice={14.99} peoplePaying={["John", "Joe", "Adam Amelia", "Cut off?"]}/>
                <ReceiptItem itemName={"Drink"} itemPrice={3.49} peoplePaying={["Adam Amelia"]}/>
                <ReceiptItem itemName={"Other Drink"} itemPrice={8.99} peoplePaying={["Charlie", "Kris"]}/>
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
