import {IconButton} from "./base/IconButton";
import {StylingConstants} from "../styling/BaseStyles";
import View from "react-native-ui-lib/view";
import {ReactNode, useState} from "react";
import {StyleSheet} from "react-native";

type ExpandableOptionsProps = {
    children?: ReactNode
}

const styles = StyleSheet.create({
    hintButtonContainer: {
        flexDirection: "row",
        gap: StylingConstants.spacing.medium
    }
});

export const ExpandableOptions = ({children}: ExpandableOptionsProps) => {
    const [showActions, setShowActions] = useState(false);

    return (
        <View style={styles.hintButtonContainer}>
            {showActions && children}
            <IconButton
                icon={showActions ? "close" : "ellipsis-h"}
                onPress={() => setShowActions(!showActions)}
                iconColor={StylingConstants.colors.secondary}
            />
        </View>
    );
}