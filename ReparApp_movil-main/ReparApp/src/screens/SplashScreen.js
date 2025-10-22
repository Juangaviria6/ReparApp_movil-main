import React, { useEffect, useRef } from "react"
import { View, Text, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import styles from "../styles/SplashScreenStyles"

const { width, height } = Dimensions.get("window")

// Pantalla de carga inicial con animaciones que navega al login
export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.5)).current
  const navigation = useNavigation()

  // Ejecuta animaciones de fade in y escala, luego navega al login
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setTimeout(() => {
        navigation.navigate('Login')
      }, 1000)
    })
  }, [])

  return (
    <LinearGradient colors={["#059669", "#10b981"]} style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="construct" size={80} color="white" />
        </View>
        <Text style={styles.appName}>reparApp</Text>
        <Text style={styles.tagline}>Servicios para tu hogar</Text>
      </Animated.View>
    </LinearGradient>
  )
}