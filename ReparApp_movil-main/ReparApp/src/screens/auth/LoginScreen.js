import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import colors from "../../constants/colors";

// Pantalla de inicio de sesión que autentica usuarios con email y contraseña
const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    // Función que valida campos y autentica al usuario con Firebase
    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            Alert.alert('Éxito', 'Inicio de sesión exitoso');
            // El auth state maneja la navegación automáticamente

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            let errorMessage = 'Error al iniciar sesión';

            // Convierte errores de Firebase a mensajes legibles
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este correo electrónico';
                    break;
                case 'auth/wrong-password':
                        errorMessage = 'Contraseña incorrecta';
                        break;
                case 'auth/invalid-email':
                    errorMessage = 'El formato del correo electrónico no es válido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet';
                    break;
                default:
                    errorMessage = error.message || 'Error desconocido';
                    break;
            }
            setError(errorMessage);        
        } 
    };

    return (
        <LinearGradient colors={colors.gradientePrimario} style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Iniciar Sesión</Text>
                
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color={colors.luminous} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Correo electrónico" 
                        placeholderTextColor={colors.thin}
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color={colors.luminous} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Contraseña" 
                        placeholderTextColor={colors.thin}
                        value={password} 
                        onChangeText={setPassword} 
                        secureTextEntry
                        autoCapitalize="none"
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>o</Text>
                    <View style={styles.divider} />
                </View>

                <TouchableOpacity style={styles.googleButton} onPress={() => {}}>
                    <Ionicons name="logo-google" size={24} color={colors.error} />
                    <Text style={styles.googleButtonText}>Continuar con Google</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.luminous,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,   
        marginBottom: 15,
        paddingHorizontal: 15,
        width: '100%',
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        color: colors.luminous,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: colors.variante8,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: colors.luminous,
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: colors.luminous,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    dividerText: {
        color: colors.luminous,
        fontSize: 14,
        marginHorizontal: 10,
        opacity: 0.8,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.luminous,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 15,
    },
    googleButtonText: {
        color: '#1e293b',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});

export default LoginScreen;