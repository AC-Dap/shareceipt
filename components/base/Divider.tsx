import View from "react-native-ui-lib/view";
import {StylingConstants} from "../../styling/BaseStyles";

type DividerProps = {
    marginTop?: number,
    marginBottom?: number,
    fullWidth?: boolean
}

export const Divider = ({marginTop = 0, marginBottom = 0, fullWidth = true}: DividerProps) => {
    return <View style={{
        height: 2,
        backgroundColor: StylingConstants.colors.lightgrey,
        marginTop,
        marginBottom,
        marginLeft: fullWidth ? 0 : "10%",
        marginRight: fullWidth ? 0 : "10%",
    }}/>
}