// Define the user settings interface
export interface UserSettings {
    id: number;
    userId: number;
    
    // Notification preferences
    emailNotifications: boolean;
    pushNotifications: boolean;
    itemSoldNotifications: boolean;
    itemPurchasedNotifications: boolean;
    priceDropNotifications: boolean;
    messageNotifications: boolean;
    
    // Privacy settings
    showEmail: boolean;
    showPurchaseHistory: boolean;
    
    // Display preferences
    darkMode: boolean;
    itemsPerPage: number;
    
    // Communication preferences
    receiveMarketingEmails: boolean;
    receiveSurveyRequests: boolean;
}

// Default settings
const defaultSettings: UserSettings = {
    id: 1,
    userId: 1,
    emailNotifications: true,
    pushNotifications: true,
    itemSoldNotifications: true,
    itemPurchasedNotifications: true,
    priceDropNotifications: true,
    messageNotifications: true,
    showEmail: false,
    showPurchaseHistory: false,
    darkMode: false,
    itemsPerPage: 10,
    receiveMarketingEmails: true,
    receiveSurveyRequests: true
};

// Mock user settings
let mockUserSettings: UserSettings = { ...defaultSettings };

// Mock settings service
export const mockSettingsService = {
    // Get user settings
    getUserSettings: (): Promise<UserSettings> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...mockUserSettings });
            }, 500);
        });
    },

    // Update user settings
    updateUserSettings: (settings: Partial<UserSettings>): Promise<UserSettings> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockUserSettings = { ...mockUserSettings, ...settings };
                resolve({ ...mockUserSettings });
            }, 500);
        });
    },

    // Reset user settings
    resetUserSettings: (): Promise<UserSettings> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                mockUserSettings = { ...defaultSettings };
                resolve({ ...mockUserSettings });
            }, 500);
        });
    }
};
