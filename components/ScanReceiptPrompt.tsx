import Text from "react-native-ui-lib/text";
import {StyleSheet} from "react-native";
import {StylingConstants} from "../styling/BaseStyles";

const styles = StyleSheet.create({
    text: {
        fontSize: StylingConstants.fontSizes.medium,
        textAlign: "center",
    }
});

export const ScanReceiptPrompt = () => {
    return <Text style={styles.text}>Scan a receipt first!</Text>
}