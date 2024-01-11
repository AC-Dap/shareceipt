import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllParties = async () => {
    const keys = await AsyncStorage.getAllKeys() as string[];
    return keys;
}

export const loadParty = async (name: string) => {
    const party = await AsyncStorage.getItem(name);
    if (party !== null) {
        const parsedParty = await JSON.parse(party) as string[];
        return parsedParty;
    } else {
        throw new Error(`Party "${name}" not found`);
    }
}

export const saveParty = async (name: string, party: string[]) => {
    await AsyncStorage.setItem(name, JSON.stringify(party));
}

export const removeParty = async (name: string) => {
    await AsyncStorage.removeItem(name);
}