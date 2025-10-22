import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, createContext, useContext, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";
import SplashScreen from "../src/screens/SplashScreen";
import RegisterScreen from "../src/screens/auth/RegisterScreen";
import LoginScreen from "../src/screens/auth/LoginScreen";
import SettingsScreen from "../src/screens/SettingsScreen";
import UserScreen from "../src/screens/UserScreen";
import HomeScreen from "../src/screens/HomeScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Contexto global para manejar el estado de autenticación del usuario
const AuthContext = createContext();

// Hook para acceder al contexto de autenticación desde cualquier componente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Navegador de pestañas que se muestra cuando el usuario está autenticado
const TabNavigator = () => {
    const { user } = useAuth();

    return (
        <Tab.Navigator 
            initialRouteName="Home" 
            screenOptions={({ route }) => ({
                // Configura iconos dinámicos según la pestaña activa
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === "Settings") {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === "User") {
                        iconName = focused ? 'person' : 'person-outline';
                    } 
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#059669',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="User" component={UserScreen} options={{ tabBarLabel: 'Usuario' }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Ajustes' }} />
        </Tab.Navigator>
    );
};

// Navegador de stack para las pantallas de autenticación (login/registro)
const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
};

// Componente principal que decide qué pantallas mostrar según el estado de autenticación
const AppNavigator = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Escucha cambios en el estado de autenticación de Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const authContextValue = {
        user,
        setUser,
        isLoading,
        setIsLoading
    };

    // Muestra splash mientras verifica autenticación
    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            {user ? (
                <TabNavigator />     // App principal si está autenticado
            ) : (
                <AuthNavigator />    // Login/registro si no está autenticado
            )}
        </AuthContext.Provider>
    );
};

export default AppNavigator;
