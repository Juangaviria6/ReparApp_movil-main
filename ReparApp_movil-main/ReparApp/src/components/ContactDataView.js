import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const ContactDataView = ({ contactData }) => {
  if (!contactData || (!contactData.direccion && !contactData.telefono && !contactData.tipo_vivienda && !contactData.referencia && !contactData.notas)) {
    return null;
  }

  const contactItems = [
    { icon: 'location-outline', label: 'Dirección', value: contactData.direccion, key: 'direccion' },
    { icon: 'call-outline', label: 'Teléfono', value: contactData.telefono, key: 'telefono' },
    { icon: 'home-outline', label: 'Tipo de Vivienda', value: contactData.tipo_vivienda, key: 'tipo_vivienda' },
    { icon: 'map-outline', label: 'Referencia', value: contactData.referencia, key: 'referencia' },
    { icon: 'document-text-outline', label: 'Notas', value: contactData.notas, key: 'notas' },
  ].filter(item => item.value && item.value.trim() !== '');

  if (contactItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="information-circle" size={20} color={colors.principal} />
        <Text style={styles.title}>Datos Guardados</Text>
      </View>
      
      {contactItems.map((item) => (
        <View key={item.key} style={styles.item}>
          <View style={styles.itemHeader}>
            <Ionicons name={item.icon} size={16} color={colors.principal} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginTop: 20,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 8,
  },
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 6,
  },
  value: {
    fontSize: 15,
    color: '#1e293b',
    marginLeft: 22,
    lineHeight: 20,
  },
});

export default ContactDataView;

