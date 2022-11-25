import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name) {
    if (navigationRef.isReady()) {
        console.log("Navigating to screen " + name);
        navigationRef.navigate(name);
    }
}