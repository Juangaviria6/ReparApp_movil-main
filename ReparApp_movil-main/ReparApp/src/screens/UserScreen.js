import React, { useState, useCallback, useEffect } from "react"
import { View, Text, TouchableOpacity, Alert, SafeAreaView, Image, ActivityIndicator, ScrollView } from "react-native"
import { useAuth } from '../../navigation/AppNavigator'
import { signOut } from "firebase/auth"
import { auth } from "../services/firebaseConfig"
import styles from "../styles/UserScreenStyles" 
import colors from "../constants/colors"
import { Ionicons } from '@expo/vector-icons'
import { pickImage, uploadImageToCloudinary } from '../services/cloudinaryService'
import ImagePreviewModal from '../components/ImagePreviewModal'
import { updateUserProfilePhoto, getUserData } from '../services/userService'
import { useFocusEffect } from '@react-navigation/native'
import ContactForm from '../components/ContactForm'
import ContactDataView from '../components/ContactDataView'
import sqliteService from '../services/sqliteService' 
// Datos mock de servicios recientes
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

// Pantalla de perfil que muestra información del usuario y servicios recientes
export default function UserScreen() {
  const { user } = useAuth();
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [contactData, setContactData] = useState(null);
  const defaultImage = 'https://via.placeholder.com/150';

  // Inicializar SQLite al cargar el componente
  useEffect(() => {
    sqliteService.init();
  }, []);

  // Cargar favoritos del usuario
  const loadFavorites = useCallback(() => {
    if (user) {
      const userFavorites = sqliteService.getAllFavorites(user.uid);
      setFavorites(userFavorites);
    }
  }, [user]);

  // Cargar datos de contacto
  const loadContactData = useCallback(() => {
    if (user) {
      const data = sqliteService.getContactById(user.uid);
      setContactData(data);
    }
  }, [user]);

  const fetchUserProfile = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const firestoreUserData = await getUserData(user.uid);
        setImageUri(firestoreUserData?.photoURL || user.photoURL || defaultImage);
      } catch (error) {
        console.error("Error al obtener datos del perfil:", error);
        setImageUri(user.photoURL || defaultImage);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
      loadFavorites();
      loadContactData();
    }, [fetchUserProfile, loadFavorites, loadContactData])
  );

  const handleImageSelection = async () => {
    try {
      const imageAsset = await pickImage();
      if (imageAsset) {
        setSelectedImage(imageAsset);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedImage) return;
    
    try {
      setLoading(true);
      setShowPreview(false);
      
      const imageUrl = await uploadImageToCloudinary(selectedImage.uri);
      await updateUserProfilePhoto(user.uid, imageUrl);
      
      setImageUri(imageUrl);
      setSelectedImage(null);
      Alert.alert('Éxito', 'Imagen de perfil actualizada correctamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'No se pudo actualizar la imagen de perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedImage(null);
    setShowPreview(false);
  };

  // Función para cerrar sesión del usuario
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con información del perfil */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={40} color="#059669" />
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.displayName || 'Usuario'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'usuario@email.com'}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.userRating}>4.8</Text>
                <Text style={styles.ratingText}>(12 reseñas)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleImageSelection}>
              <Ionicons name="pencil" size={16} color="#059669" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón de cambiar foto */}
        <View style={styles.changePhotoContainer}>
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={handleImageSelection}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="camera-outline" size={18} color="#fff" />
                <Text style={styles.changeImageText}>Cambiar Foto de Perfil</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Datos de contacto guardados */}
        {contactData && (
          <View style={{paddingHorizontal: 24}}>
            <ContactDataView contactData={contactData} />
          </View>
        )}

        {/* Botón para datos de contacto */}
        <View style={styles.contactButtonContainer}>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => setShowContactForm(!showContactForm)}
          >
            <Ionicons 
              name={showContactForm ? "chevron-up-outline" : contactData ? "create-outline" : "add-circle-outline"} 
              size={20} 
              color={colors.principal} 
            />
            <Text style={styles.contactButtonText}>
              {showContactForm ? 'Cancelar' : contactData ? 'Editar Datos de Contacto' : 'Agregar Datos de Contacto'}
            </Text>
            <Ionicons 
              name={showContactForm ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={colors.principal} 
            />
          </TouchableOpacity>
        </View>

        {/* Formulario de contacto */}
        {showContactForm && (
          <View style={{paddingHorizontal: 24}}>
            <ContactForm 
              onClose={() => {
                setShowContactForm(false);
                loadContactData(); // Recargar datos después de guardar
              }} 
            />
          </View>
        )}

        {/* Estadísticas del usuario */}
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

        {/* Lista de servicios recientes */}
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

        {/* Mis Favoritos */}
        {favorites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mis Favoritos</Text>
            {favorites.map((favorite) => (
              <View key={favorite.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>{favorite.provider_name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.rating}>{favorite.provider_rating}</Text>
                  </View>
                </View>
                <Text style={styles.providerName}>{favorite.services_offered}</Text>
                <TouchableOpacity style={[styles.contactButton, {marginTop: 8}]}>
                  <Text style={[styles.contactButtonText, {textAlign: 'center'}]}>
                    Contactar Proveedor
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Botón de cerrar sesión */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ImagePreviewModal
        visible={showPreview}
        imageUri={selectedImage?.uri}
        loading={loading}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelSelection}
      />
    </SafeAreaView>
  )
}
