import React, { useState } from "react"
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Switch } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles/SettingsScreenStyles"

// Pantalla de configuraciones que permite ajustar preferencias de la app
export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [locationServices, setLocationServices] = useState(true)

  // Configuraciones disponibles en la pantalla
  const settingsOptions = [
    {
      id: 1,
      title: "Perfil",
      subtitle: "Editar información personal",
      icon: "person-outline",
      type: "navigation",
    },
    {
      id: 2,
      title: "Notificaciones",
      subtitle: "Recibir alertas de servicios",
      icon: "notifications-outline",
      type: "toggle",
      value: notifications,
      onToggle: setNotifications,
    },
    {
      id: 3,
      title: "Modo Oscuro",
      subtitle: "Cambiar tema de la aplicación",
      icon: "moon-outline",
      type: "toggle",
      value: darkMode,
      onToggle: setDarkMode,
    },
    {
      id: 4,
      title: "Ubicación",
      subtitle: "Servicios de localización",
      icon: "location-outline",
      type: "toggle",
      value: locationServices,
      onToggle: setLocationServices,
    },
    {
      id: 5,
      title: "Métodos de Pago",
      subtitle: "Gestionar tarjetas y pagos",
      icon: "card-outline",
      type: "navigation",
    },
    {
      id: 6,
      title: "Historial",
      subtitle: "Ver servicios anteriores",
      icon: "time-outline",
      type: "navigation",
    },
    {
      id: 7,
      title: "Ayuda y Soporte",
      subtitle: "Contactar con soporte",
      icon: "help-circle-outline",
      type: "navigation",
    },
    {
      id: 8,
      title: "Acerca de",
      subtitle: "Información de la app",
      icon: "information-circle-outline",
      type: "navigation",
    },
  ]

  // Función para renderizar cada opción de configuración
  const renderSettingItem = (item) => {
    return (
      <TouchableOpacity key={item.id} style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={item.icon} size={20} color="#059669" />
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <View style={styles.settingRight}>
          {item.type === "toggle" ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: "#e2e8f0", true: "#10b981" }}
              thumbColor={item.value ? "#059669" : "#f4f3f4"}
            />
          ) : (
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con título */}
        <View style={styles.header}>
          <Text style={styles.title}>Configuración</Text>
        </View>

        {/* Lista de opciones de configuración */}
        <View style={styles.section}>{settingsOptions.map(renderSettingItem)}</View>
      </ScrollView>
    </SafeAreaView>
  )
}