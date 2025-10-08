import {useEffect} from 'react';
import {useRouter} from "expo-router";

const Index = () => {
    const router = useRouter();

    useEffect(() => {
        const isLogado = false;

        if (isLogado) {
            router.replace("/(tabs)/dashboard")
        } else {
            router.replace("/(auth)/login")
        }
    }, []);
    return null;
}
export default Index;
