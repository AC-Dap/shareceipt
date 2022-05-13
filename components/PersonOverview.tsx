import {View, Text} from "./Themed";
import {StyleSheet} from "react-native";
import CircleAvatar from "./Avatar";

type PersonOverviewProps = {
    name: string,
    amountOwed: number
}

export default function PersonOverview({ name, amountOwed }: PersonOverviewProps) {
    return (
        <View style={styles.overviewContainer}>
            <CircleAvatar size={24} name={name}/>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.amountOwedText}>{`$${amountOwed.toFixed(2)}`}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    overviewContainer: {
        flex: 1,
        flexDirection: "row",
        padding: 10
    },
    nameText: {
        marginLeft: 10
    },
    amountOwedText: {
        marginLeft: "auto"
    }
});
