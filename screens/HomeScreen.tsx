import {useState} from "react";
import {StyleSheet} from "react-native";
import View from 'react-native-ui-lib/view';
import Button from "react-native-ui-lib/button";
import Text from 'react-native-ui-lib/text';
import PageControl from "react-native-ui-lib/pageControl";
import {AddPartyScreen} from './AddPartyScreen';
import {ScanReceiptScreen} from "./ScanReceiptScreen";
import {AssignItemsScreen} from "./AssignItemsScreen";
import {ResultsScreen} from "./ResultsScreen";
import {ReceiptProvider} from "../context/ReceiptContext";
import {StylingConstants} from "../styling/BaseStyles";

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "column",
    },
    header: {
        marginHorizontal: StylingConstants.spacing.large,
        marginVertical: StylingConstants.spacing.medium,
        fontSize: StylingConstants.fontSizes.xxLarge,
        fontWeight: StylingConstants.fontWeights.medium
    },
    footer: {
        margin: StylingConstants.spacing.medium,
        marginTop: "auto",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerButtonText: {
        color: "white",
        fontSize: StylingConstants.fontSizes.medium
    }
})

export const HomeScreen = () => {
    const steps = ["Add Party Members", "Scan Receipt", "Assign Items", "Results"]
    const screens = [<AddPartyScreen/>, <ScanReceiptScreen/>, <AssignItemsScreen/>, <ResultsScreen/>]
    const [currentStep, setCurrentStep] = useState(0);
    const decrementStep = () => setCurrentStep(currentStep - 1);
    const incrementStep = () => setCurrentStep(currentStep + 1);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{currentStep + 1}. {steps[currentStep]}</Text>

            <ReceiptProvider>
                {screens[currentStep]}
            </ReceiptProvider>

            <View style={styles.footer}>
                <Button
                    label={"Prev step"}
                    onPress={decrementStep}
                    disabled={currentStep == 0}
                    backgroundColor={StylingConstants.colors.primary}
                    labelStyle={styles.footerButtonText}
                />
                <PageControl
                    numOfPages={steps.length}
                    currentPage={currentStep}
                    enlargeActive
                    color={StylingConstants.colors.primary}
                />
                <Button
                    label={"Next step"}
                    onPress={incrementStep}
                    disabled={currentStep == steps.length - 1}
                    backgroundColor={StylingConstants.colors.primary}
                    labelStyle={styles.footerButtonText}
                />
            </View>
        </View>
    );
}