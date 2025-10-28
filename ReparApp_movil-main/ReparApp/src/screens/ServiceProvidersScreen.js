import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../navigation/AppNavigator';
import sqliteService from '../services/sqliteService';
import colors from '../constants/colors';

export default function ServiceProvidersScreen({ route, navigation }) {
  const { serviceCategory, serviceName } = route.params;
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [favoriteStates, setFavoriteStates] = useState({});

  useEffect(() => {
    loadProviders();
    if (user) {
      loadFavoriteStates();
    }
  }, []);

  const loadProviders = () => {
    const categoryProviders = sqliteService.getProvidersByCategory(serviceCategory);
    setProviders(categoryProviders);
  };

  const loadFavoriteStates = () => {
    const states = {};
    providers.forEach(provider => {
      states[provider.id] = sqliteService.isFavorite(user.uid, provider.id);
    });
    setFavoriteStates(states);
  };

  const toggleFavorite = (provider) => {
    if (!user) {
      Alert.alert('Error', 'Debes estar autenticado para agregar favoritos');
      return;
    }

    const isFavorite = favoriteStates[provider.id];
    
    if (isFavorite) {
      sqliteService.removeFavorite(user.uid, provider.id);
      Alert.alert('Favorito removido', `${provider.name} eliminado de favoritos`);
    } else {
      sqliteService.addFavorite(user.uid, provider.id, {
        name: provider.name,
        rating: provider.rating,
        services: provider.category
      });
      Alert.alert('Favorito agregado', `${provider.name} agregado a favoritos`);
    }

    setFavoriteStates(prev => ({
      ...prev,
      [provider.id]: !isFavorite
    }));
  };

  const handleCall = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Sin teléfono', 'Este proveedor no tiene número de contacto registrado');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
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
          {serviceName}
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {providers.length === 0 ? (
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60
          }}>
            <Ionicons name="business-outline" size={64} color="#94a3b8" />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#64748b',
              marginTop: 16
            }}>
              No hay empresas registradas
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#94a3b8',
              marginTop: 8,
              textAlign: 'center'
            }}>
              Agrega una empresa desde el menú
            </Text>
          </View>
        ) : (
          providers.map((provider) => (
            <View key={provider.id} style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              {/* Header con nombre y favorito */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: 4
                  }}>
                    {provider.name}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#64748b'
                  }}>
                    {provider.category}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleFavorite(provider)}
                  style={{ padding: 8 }}
                >
                  <Ionicons
                    name={favoriteStates[provider.id] ? "heart" : "heart-outline"}
                    size={24}
                    color={favoriteStates[provider.id] ? "#ef4444" : "#64748b"}
                  />
                </TouchableOpacity>
              </View>

              {/* Información de contacto */}
              {provider.phone && (
                <View style={{
                  backgroundColor: '#f8fafc',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8
                }}>
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: '#64748b',
                    marginBottom: 4
                  }}>
                    Contacto
                  </Text>
                  <Text style={{
                    fontSize: 15,
                    color: '#1e293b',
                    fontWeight: '600'
                  }}>
                    {provider.phone}
                  </Text>
                </View>
              )}

              {/* Dirección */}
              {provider.address && (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <Ionicons name="location" size={16} color="#64748b" />
                  <Text style={{
                    fontSize: 13,
                    color: '#64748b',
                    marginLeft: 6,
                    flex: 1
                  }}>
                    {provider.address}
                  </Text>
                </View>
              )}

              {/* Rating */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={{
                  fontSize: 14,
                  color: '#1e293b',
                  fontWeight: '600',
                  marginLeft: 4
                }}>
                  {provider.rating.toFixed(1)}
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  marginLeft: 4
                }}>
                  ({provider.rating_count} reseñas)
                </Text>
              </View>

              {/* Botones de acción */}
              <View style={{
                flexDirection: 'row',
                gap: 10
              }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: colors.principal,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                  onPress={() => handleCall(provider.phone)}
                >
                  <Ionicons name="call" size={18} color="#fff" />
                  <Text style={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: 14,
                    marginTop: 4
                  }}>
                    Llamar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

