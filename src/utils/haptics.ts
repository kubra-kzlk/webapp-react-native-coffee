//Expo Haptics trillingen: Provide confirmation: 
// successful new coffee form submission
import * as Haptics from "expo-haptics";

const haptics = {
    // Positieve feedback (bijv. bij succesvolle acties)
    success: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
};
export default haptics;