// From https://mui.com/material-ui/react-avatar/
import {adjectives, animals, uniqueNamesGenerator} from "unique-names-generator";

export function nameToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

export function getInitials(name: string) {
    const parts = name.split(' ');
    if(parts.length > 1){
        return `${parts[0][0]}${parts[parts.length-1][0]}`
    }else{
        return `${parts[0][0]}`;
    }
}

export function getRandomName() {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: " ",
        length: 2,
        style: "capital"
    })
}
