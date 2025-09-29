import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "../styles/UserScreenStyles"

const recentServices = [
  {
    id: 1,
    service: "Reparación de tubería",
    provider: "AquaFix Pro",
    date: "15 Dic 2024",
    status: "Completado",
    amount: "$45.000",
  },
  {
    id: 2,
    service: "Instalación eléctrica",
    provider: "ElectroServ",
    date: "10 Dic 2024",
    status: "Completado",
    amount: "$80.000",
  },
  {
    id: 3,
    service: "Limpieza general",
    provider: "CleanMaster",
    date: "5 Dic 2024",
    status: "Completado",
    amount: "$35.000",
  },
]

export default function UserScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#059669" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Juan Pérez</Text>
              <Text style={styles.userEmail}>juan.perez@email.com</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.userRating}>4.8</Text>
                <Text style={styles.ratingText}>(12 reseñas)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#059669" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Servicios</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>$420K</Text>
            <Text style={styles.statLabel}>Gastado</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Proveedores</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Recientes</Text>
          {recentServices.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>{service.service}</Text>
                <Text style={styles.serviceAmount}>{service.amount}</Text>
              </View>
              <Text style={styles.providerName}>{service.provider}</Text>
              <View style={styles.serviceFooter}>
                <Text style={styles.serviceDate}>{service.date}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{service.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="repeat" size={20} color="#059669" />
            <Text style={styles.actionText}>Repetir Servicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="star-outline" size={20} color="#059669" />
            <Text style={styles.actionText}>Mis Favoritos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}