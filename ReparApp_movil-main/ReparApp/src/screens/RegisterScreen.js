import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles/RegisterScreenStyles"

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = () => {
    const { name, email, phone, password, confirmPassword } = formData

    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden")
      return
    }

    Alert.alert("Éxito", "Cuenta creada exitosamente", [{ text: "OK", onPress: () => navigation.navigate("Login") }])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#059669" />
          </TouchableOpacity>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a reparApp</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange("confirmPassword", value)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}