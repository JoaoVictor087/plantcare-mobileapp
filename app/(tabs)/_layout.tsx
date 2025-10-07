import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({color}) => <MaterialIcons name={"home"}
                                                            size={28} color={color}/>
                }}
            />
            <Tabs.Screen
                name="my_plants"
                options={{
                    title: 'Minhas Plantas',
                    headerShown: false,
                    tabBarIcon: ({color}) => <MaterialIcons name={"eco"}
                                                            size={28} color={color}/>
                }}
            />
            <Tabs.Screen
                name="options"
                options={{
                    title: 'Configurações',
                    headerShown: false,
                    tabBarIcon: ({color}) => <MaterialIcons name={"account-circle"}
                                                       size={28} color={color}/>
                }}
            />
        </Tabs>
    );
}

