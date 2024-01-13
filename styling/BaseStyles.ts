import {StyleSheet} from "react-native";

type FontWeight = "300" | "400" | "500" | "700";

export const StylingConstants = {
    colors: {
        primary: "#2979ff",
        secondary: "#716BEC",
        error: "#b00020",
        success: "#00c853",
        warning: "#ffab00",

        // Greyscale
        lightgrey: "#eeeeee",
        darkgrey: "#aaaaaa",
    },
    fontSizes: {
        small: 14,
        medium: 16,
        large: 20,
        xLarge: 24,
        xxLarge: 28
    },
    fontWeights: {
        // Typecasting necessary since fontWeight is not a general string
        light: "300" as FontWeight,
        regular: "400" as FontWeight,
        medium: "500" as FontWeight,
        bold: "700" as FontWeight
    },
    spacing: {
        small: 4,
        medium: 8,
        large: 16,
        xLarge: 24,
        xxLarge: 32
    },
    borderRadius: 12,
    borderWidth: 2,
    iconSize: 24
};

export const BaseStyles = StyleSheet.create({
    screenContainer: {
        maxHeight: "80%"
    },
    dialog: {
        backgroundColor: "white",
        padding: StylingConstants.spacing.medium,
        borderRadius: StylingConstants.borderRadius,
    },
    dialogActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: StylingConstants.spacing.medium,
    },
    dialogHeader: {
        fontSize: StylingConstants.fontSizes.large,
        fontWeight: StylingConstants.fontWeights.medium,
        marginBottom: StylingConstants.spacing.small,
    },
    textInput: {
        borderBottomColor: StylingConstants.colors.secondary,
        borderBottomWidth: StylingConstants.borderWidth,
        fontSize: StylingConstants.fontSizes.medium,
    },
    textInputLabel: {
        fontSize: StylingConstants.fontSizes.medium,
        fontWeight: StylingConstants.fontWeights.medium,
        color: StylingConstants.colors.secondary
    },
    textInputError: {
        fontSize: StylingConstants.fontSizes.small,
        fontWeight: StylingConstants.fontWeights.light,
        color: StylingConstants.colors.error
    },
});