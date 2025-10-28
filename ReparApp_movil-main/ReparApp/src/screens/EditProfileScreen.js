import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { useAuth } from '../../navigation/AppNavigator';
import { updateUserProfile, getUserData } from '../services/userService';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function EditProfileScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const firestoreData = await getUserData(user.uid);
      
      setFormData({
        displayName: firestoreData?.displayName || user.displayName || '',
        email: user.email || '',
        phone: firestoreData?.phone || '',
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es requerido');
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        phone: formData.phone,
      });
      
      Alert.alert('Éxito', 'Perfil actualizado correctamente', [
        { 
          text: 'OK', 
          onPress: () => {
            navigation.goBack();
          }
        }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={colors.principal} />
        <Text style={{ marginTop: 10, color: '#666' }}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.principal} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: '700',
          marginLeft: 16,
          color: '#1e293b'
        }}>
          Editar Perfil
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Nombre */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#334155',
            marginBottom: 8
          }}>
            Nombre completo
          </Text>
          <TextInput
            style={{
              backgroundColor: '#f8fafc',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              fontSize: 15,
            }}
            value={formData.displayName}
            onChangeText={(value) => handleChange('displayName', value)}
            placeholder="Ingrese su nombre"
          />
        </View>

        {/* Email (solo lectura) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#334155',
            marginBottom: 8
          }}>
            Email
          </Text>
          <TextInput
            style={{
              backgroundColor: '#f1f5f9',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              fontSize: 15,
              color: '#64748b'
            }}
            value={formData.email}
            editable={false}
          />
          <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
            El email no se puede modificar
          </Text>
        </View>

        {/* Teléfono */}
        <View style={{ marginBottom: 30 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#334155',
            marginBottom: 8
          }}>
            Teléfono
          </Text>
          <TextInput
            style={{
              backgroundColor: '#f8fafc',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              fontSize: 15,
            }}
            value={formData.phone}
            onChangeText={(value) => handleChange('phone', value)}
            placeholder="Ingrese su teléfono"
            keyboardType="phone-pad"
          />
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.principal,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{
              color: '#fff',
              fontWeight: '700',
              fontSize: 16
            }}>
              Guardar Cambios
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

