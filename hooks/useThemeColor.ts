import {useColorScheme} from "react-native";
import {ColorsDark, ColorsLight} from "../styling/StyleConstants";

export default function useThemeColor(color: (keyof typeof ColorsLight & keyof typeof ColorsDark)){
    const theme = useColorScheme();

    return (theme === "dark")? ColorsDark[color] : ColorsLight[color];
}