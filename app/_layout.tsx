import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useFonts} from 'expo-font';
import {useEffect} from "react";
import Header from "../components/header";


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        'Inter': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error ){
        return null;
    }
    return (
        <Stack screenOptions={{header: () => <Header/>}}>
            <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        </Stack>
    );
}

