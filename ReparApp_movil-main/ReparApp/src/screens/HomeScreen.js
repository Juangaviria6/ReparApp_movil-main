import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import sqliteService from "../services/sqliteService";
import styles from "../styles/HomeScreenStyles";
import colors from "../constants/colors";

// Lista de servicios disponibles con iconos y colores
const services = [
  { id: 1, name: "Plomería", icon: "water", color: "#3b82f6" },
  { id: 2, name: "Electricidad", icon: "flash", color: "#f59e0b" },
  { id: 3, name: "Carpintería", icon: "hammer", color: "#8b5cf6" },
  { id: 4, name: "Cerrajería", icon: "key", color: "#ef4444" },
  { id: 5, name: "Limpieza", icon: "sparkles", color: "#10b981" },
  { id: 6, name: "Reparaciones", icon: "construct", color: "#f97316" },
];

// Lista de proveedores destacados con calificaciones
const providers = [
  { id: 1, name: "TecnoFix Pro", rating: 4.8, services: "Electricidad, Plomería" },
  { id: 2, name: "Hogar Seguro", rating: 4.9, services: "Cerrajería, Seguridad" },
  { id: 3, name: "CleanMaster", rating: 4.7, services: "Limpieza General" },
];

// Pantalla principal que muestra servicios disponibles y proveedores destacados
export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [favoriteStates, setFavoriteStates] = useState({});

  useEffect(() => {
    sqliteService.init();
    loadFavoriteStates();
  }, []);

  // Manejar clic en servicio
  const handleServicePress = (service) => {
    const categoryMap = {
      'Plomería': 'plomeria',
      'Electricidad': 'electricidad',
      'Carpintería': 'carpinteria',
      'Cerrajería': 'cerrajeria',
      'Limpieza': 'limpieza',
      'Reparaciones': 'reparaciones',
    };

    navigation.navigate('ServiceProviders', {
      serviceCategory: categoryMap[service.name] || service.name.toLowerCase(),
      serviceName: service.name
    });
  };

  const loadFavoriteStates = () => {
    if (!user) return;
    const states = {};
    providers.forEach(provider => {
      states[provider.id] = sqliteService.isFavorite(user.uid, provider.id.toString());
    });
    setFavoriteStates(states);
  };

  const toggleFavorite = (providerId, providerName) => {
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para agregar favoritos');
      return;
    }

    const isFavorite = favoriteStates[providerId];
    
    if (isFavorite) {
      sqliteService.removeFavorite(user.uid, providerId.toString());
      Alert.alert('Favorito removido', `${providerName} eliminado de favoritos`);
    } else {
      const provider = providers.find(p => p.id === providerId);
      sqliteService.addFavorite(user.uid, providerId.toString(), {
        name: provider.name,
        rating: 4.7, // Puedes obtenerlo de los datos reales del proveedor
        services: provider.services
      });
      Alert.alert('Favorito agregado', `${providerName} agregado a favoritos`);
    }

    setFavoriteStates(prev => ({
      ...prev,
      [providerId]: !isFavorite
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con saludo y botón de notificaciones */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.subtitle}>¿Qué necesitas reparar hoy?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#059669" />
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Buscar servicios...</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddProvider')}
            style={{
              backgroundColor: colors.principal,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={{
              color: '#fff',
              fontWeight: '600',
              fontSize: 14,
              marginLeft: 4
            }}>
              Agregar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sección de servicios disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Disponibles</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.serviceCard}
                onPress={() => handleServicePress(service)}
              >
                <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                  <Ionicons name={service.icon} size={24} color="white" />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sección de proveedores destacados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proveedores Destacados</Text>
          {providers.map((provider) => (
            <View key={provider.id} style={styles.providerCard}>
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(provider.id, provider.name)}
              >
                <Ionicons 
                  name={favoriteStates[provider.id] ? "heart" : "heart-outline"} 
                  size={24} 
                  color={favoriteStates[provider.id] ? "#ef4444" : "#64748b"} 
                />
              </TouchableOpacity>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerServices}>{provider.services}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#f59e0b" />
                  <Text style={styles.rating}>{provider.rating}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contactar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}