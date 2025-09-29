import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles/LoginScreenStyles"

export default function LoginScreen({ navigation, route }) {
  const { setIsLoggedIn } = route?.params || {};
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }
    if (setIsLoggedIn) {
      setIsLoggedIn(true)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="construct" size={60} color="#059669" />
        <Text style={styles.title}>reparApp</Text>
        <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.registerTextBold}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}