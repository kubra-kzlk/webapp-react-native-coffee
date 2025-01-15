//delen van de coffee: genereert een tekst bestand met gedeelde coffee
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import type { Coffee } from "../types/coffee";

const shareCoffee = async (coffee: Coffee[]) => {
    const fileUri = FileSystem.cacheDirectory + "coffee.txt";
    try {
        const isTastedCount = coffee.filter((c) => c.isTasted).length;
        const text = `${coffee.length} coffees tasted: ${isTastedCount}`;
        await FileSystem.writeAsStringAsync(fileUri, text);
        await Sharing.shareAsync(fileUri, {
            mimeType: "text/plain",
            dialogTitle: "Share coffee",
        });

        await FileSystem.deleteAsync(fileUri, { idempotent: true });

    } catch (error) {
        throw error;
    }
};

export default shareCoffee;