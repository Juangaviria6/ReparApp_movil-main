import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/HomeScreenStyles";

const services = [
  { id: 1, name: "Plomería", icon: "water", color: "#3b82f6" },
  { id: 2, name: "Electricidad", icon: "flash", color: "#f59e0b" },
  { id: 3, name: "Carpintería", icon: "hammer", color: "#8b5cf6" },
  { id: 4, name: "Cerrajería", icon: "key", color: "#ef4444" },
  { id: 5, name: "Limpieza", icon: "sparkles", color: "#10b981" },
  { id: 6, name: "Reparaciones", icon: "construct", color: "#f97316" },
];

const providers = [
  { id: 1, name: "TecnoFix Pro", rating: 4.8, services: "Electricidad, Plomería" },
  { id: 2, name: "Hogar Seguro", rating: 4.9, services: "Cerrajería, Seguridad" },
  { id: 3, name: "CleanMaster", rating: 4.7, services: "Limpieza General" },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.subtitle}>¿Qué necesitas reparar hoy?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#059669" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Buscar servicios...</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Disponibles</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                  <Ionicons name={service.icon} size={24} color="white" />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proveedores Destacados</Text>
          {providers.map((provider) => (
            <TouchableOpacity key={provider.id} style={styles.providerCard}>
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
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}