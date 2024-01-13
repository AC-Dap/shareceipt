import {IconButton} from "./base/IconButton";
import {StylingConstants} from "../styling/BaseStyles";
import View from "react-native-ui-lib/view";
import {forwardRef, ReactNode, useImperativeHandle, useState} from "react";
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

export type ExpandableOptionsRef = {
    showActions: () => void,
    hideActions: () => void
}

export const ExpandableOptions = forwardRef(({
    children
}: ExpandableOptionsProps, ref) => {
    const [showActions, setShowActions] = useState(false);

    useImperativeHandle(ref, (): ExpandableOptionsRef => {
        return {
            showActions: () => setShowActions(true),
            hideActions: () => setShowActions(false)
        }
    }, []);

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
});