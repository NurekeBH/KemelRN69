import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        console.log("Navigating to screen " + name);
        console.log("Navigating to screen " + params);
        navigationRef.navigate(name, params);
    }
}