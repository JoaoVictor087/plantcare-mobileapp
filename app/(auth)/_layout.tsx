import React from 'react';
import {Stack} from "expo-router";
import Header from "../../components/header";

const AuthLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="login"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="cadastro"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
};

export default AuthLayout;