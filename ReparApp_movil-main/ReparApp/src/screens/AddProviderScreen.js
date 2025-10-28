import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import sqliteService from '../services/sqliteService';
import colors from '../constants/colors';

const categories = [
  { label: 'Plomería', value: 'plomeria' },
  { label: 'Electricidad', value: 'electricidad' },
  { label: 'Carpintería', value: 'carpinteria' },
  { label: 'Cerrajería', value: 'cerrajeria' },
  { label: 'Limpieza', value: 'limpieza' },
  { label: 'Reparaciones', value: 'reparaciones' },
];

export default function AddProviderScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'plomeria',
    phone: '',
    email: '',
    address: '',
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    if (!formData.category) {
      Alert.alert('Error', 'La categoría es requerida');
      return;
    }

    try {
      setLoading(true);
      sqliteService.addProvider({
        name: formData.name,
        category: formData.category,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        rating: 0.0,
        rating_count: 0,
      });

      Alert.alert('Éxito', 'Empresa agregada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          }
        }
      ]);
    } catch (error) {
      console.error('Error adding provider:', error);
      Alert.alert('Error', 'No se pudo agregar la empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 16,
        backgroundColor: '#fff',
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
          Agregar Empresa
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
            Nombre de la empresa *
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
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            placeholder="Ej: TecnoFix Pro"
          />
        </View>

        {/* Categoría */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#334155',
            marginBottom: 8
          }}>
            Categoría *
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#f8fafc',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={{ fontSize: 15, color: '#1e293b' }}>
              {categories.find(c => c.value === formData.category)?.label || 'Seleccionar categoría'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Modal de selección de categoría */}
        <Modal
          visible={showCategoryModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end'
          }}>
            <View style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: '50%'
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 16
              }}>
                Seleccionar Categoría
              </Text>
              <ScrollView>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      backgroundColor: formData.category === cat.value ? '#f0fdf4' : '#f8fafc',
                      marginBottom: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      handleChange('category', cat.value);
                      setShowCategoryModal(false);
                    }}
                  >
                    <Text style={{
                      fontSize: 16,
                      color: formData.category === cat.value ? colors.principal : '#1e293b',
                      fontWeight: formData.category === cat.value ? '600' : '400'
                    }}>
                      {cat.label}
                    </Text>
                    {formData.category === cat.value && (
                      <Ionicons name="checkmark" size={20} color={colors.principal} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setShowCategoryModal(false)}
                style={{
                  marginTop: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: '#f1f5f9',
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#64748b', fontWeight: '600' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Teléfono */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#334155',
            marginBottom: 8
          }}>
            Teléfono de contacto
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
            placeholder="Ej: 3001234567"
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#334155',
            marginBottom: 8
          }}>
            Email (opcional)
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
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="empresa@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Dirección */}
        <View style={{ marginBottom: 30 }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#334155',
            marginBottom: 8
          }}>
            Dirección (opcional)
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
              minHeight: 80,
              textAlignVertical: 'top'
            }}
            value={formData.address}
            onChangeText={(value) => handleChange('address', value)}
            placeholder="Dirección de la empresa"
            multiline
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
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{
              color: '#fff',
              fontWeight: '700',
              fontSize: 16
            }}>
              Guardar Empresa
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

