import {Colors} from "react-native-paper";
import {LayoutAnimation} from "react-native";

export const ColorsLight = {
    banner: '#19AFDE',
    background: "#fff",
    highlight: Colors.grey400,
    accent: Colors.blueGrey700,
    text: "#000",
    errorText: '#dd0000'
}

export const ColorsDark = {
    banner: Colors.blueGrey700,
    background: Colors.grey900,
    highlight: Colors.grey800,
    accent: Colors.blue300,
    text: "#fff",
    errorText: '#ff0033'
}

export const Fonts = {
    receiptFont: 'receipt',
    normalFont: 'sans-serif'
}

export const Animations = {
    timingDuration: 350,
    layoutAnimation: () => {
        LayoutAnimation.configureNext({
            duration: Animations.timingDuration,
            create: {
                type: LayoutAnimation.Types.easeOut,
                property: "opacity"
            },
            update: {
                type: LayoutAnimation.Types.easeOut
            }
        });
    }
}