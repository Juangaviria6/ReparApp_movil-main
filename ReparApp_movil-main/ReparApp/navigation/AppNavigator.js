import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, createContext, useContext, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";
import SplashScreen from "../src/screens/SplashScreen";
import RegisterScreen from "../src/screens/auth/RegisterScreen";
import LoginScreen from "../src/screens/auth/LoginScreen";
import SettingsScreen from "../src/screens/SettingsScreen";
import UserScreen from "../src/screens/UserScreen";
import HomeScreen from "../src/screens/HomeScreen";
import EditProfileScreen from "../src/screens/EditProfileScreen";
import ServiceProvidersScreen from "../src/screens/ServiceProvidersScreen";
import AddProviderScreen from "../src/screens/AddProviderScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

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
            <Tab.Screen name="Home" component={HomeStackNavigator} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="User" component={UserScreen} options={{ tabBarLabel: 'Usuario' }} />
            <Tab.Screen name="Settings" component={SettingsStackNavigator} options={{ tabBarLabel: 'Ajustes' }} />
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

// Navegador de stack para Settings que incluye EditProfile
const SettingsStackNavigator = () => {
    return (
        <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
            <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
            <SettingsStack.Screen name="EditProfile" component={EditProfileScreen} />
        </SettingsStack.Navigator>
    );
};

// Navegador de stack para Home que incluye ServiceProviders y AddProvider
const HomeStackNavigator = () => {
    return (
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen name="HomeMain" component={HomeScreen} />
            <MainStack.Screen name="ServiceProviders" component={ServiceProvidersScreen} />
            <MainStack.Screen name="AddProvider" component={AddProviderScreen} />
        </MainStack.Navigator>
    );
};

// Componente principal que decide qué pantallas mostrar según el estado de autenticación
const AppNavigator = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    // Cierra cualquier sesión previa al cargar la app
    useEffect(() => {
        signOut(auth).then(() => {
            setIsLoading(false);
            setInitialLoadComplete(true);
        }).catch(() => {
            setIsLoading(false);
            setInitialLoadComplete(true);
        });
    }, []);

    // Escucha cambios en el estado de autenticación de Firebase
    useEffect(() => {
        if (!initialLoadComplete) return;

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return unsubscribe;
    }, [initialLoadComplete]);

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
