import React, { useEffect, useState } from 'react';
import { useAuth } from '../../navigation/AppNavigator';    
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

// SQLite solo para móvil
let sqliteService;
try {
  if (Platform.OS !== 'web') {
    sqliteService = require('../services/sqliteService').default;
  }
} catch (error) {
  console.log('SQLite no disponible');
}

const emptyForm = {
    direccion: '',
    telefono: '',
    tipo_vivienda: '',
    referencia: '',
    notas: '',
}

const ContactForm = ({ onClose }) => {
    const { user } = useAuth();
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!user) return;
            try {
                setLoading(true);
                let data = null;
                
                // Usar AsyncStorage para web, SQLite para móvil
                if (Platform.OS === 'web') {
                    const savedData = await AsyncStorage.getItem(`contact_${user.uid}`);
                    data = savedData ? JSON.parse(savedData) : null;
                } else if (sqliteService) {
                    data = sqliteService.getContactById(user.uid);
                }
                
                if (mounted) {
                    if (data) {
                        setForm({
                            direccion: data.direccion || '',
                            telefono: data.telefono || '',
                            tipo_vivienda: data.tipo_vivienda || '',
                            referencia: data.referencia || '',
                            notas: data.notas || '',
                        });
                    } else {
                        setForm(emptyForm);
                    }
                }
            } catch (error) {
                console.warn('ERROR CARGANDO LOS DATOS', error);
                Alert.alert('Error de carga', 'No fue posible cargar los datos');
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [user]);

    const handleChange = (key, value) =>
        setForm(prev => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        if (!user) return Alert.alert('Error', 'Usuario no autenticado');
        try {
            setLoading(true);
            
            // Usar AsyncStorage para web, SQLite para móvil
            if (Platform.OS === 'web') {
                await AsyncStorage.setItem(`contact_${user.uid}`, JSON.stringify(form));
            } else if (sqliteService) {
                sqliteService.upsertContact(user.uid, form);
            }
            
            Alert.alert('Guardado', 'Datos de contacto guardados localmente');
            onClose();
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'No se pudo guardar');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (!user) return;
        Alert.alert(
            'Eliminar',
            '¿Deseas eliminar los datos de contacto locales?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            
                            // Usar AsyncStorage para web, SQLite para móvil
                            if (Platform.OS === 'web') {
                                await AsyncStorage.removeItem(`contact_${user.uid}`);
                            } else if (sqliteService) {
                                sqliteService.deleteContactById(user.uid);
                            }
                            
                            setForm(emptyForm);
                            Alert.alert('Eliminado', 'Datos de contacto eliminados');
                            onClose();
                        } catch (e) {
                            console.error(e);
                            Alert.alert('Error', 'No se pudo eliminar');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={colors.principal} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Datos de Contacto</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Dirección de Servicio</Text>
            <TextInput
                style={styles.input}
                value={form.direccion}
                onChangeText={t => handleChange('direccion', t)}
                placeholder="Dirección donde se realizará el servicio"
                multiline
            />

            <Text style={styles.label}>Teléfono de Contacto</Text>
            <TextInput
                style={styles.input}
                value={form.telefono}
                onChangeText={t => handleChange('telefono', t)}
                placeholder="Teléfono"
                keyboardType="phone-pad"
            />

            <Text style={styles.label}>Tipo de Vivienda</Text>
            <TextInput
                style={styles.input}
                value={form.tipo_vivienda}
                onChangeText={t => handleChange('tipo_vivienda', t)}
                placeholder="Ej: Casa, Apartamento, Oficina"
            />

            <Text style={styles.label}>Referencia</Text>
            <TextInput
                style={styles.input}
                value={form.referencia}
                onChangeText={t => handleChange('referencia', t)}
                placeholder="Puntos de referencia"
            />

            <Text style={styles.label}>Notas Adicionales</Text>
            <TextInput
                style={[styles.input, styles.multiline]}
                value={form.notas}
                onChangeText={t => handleChange('notas', t)}
                placeholder="Información adicional sobre el servicio"
                multiline
            />

            <View style={styles.row}>
                <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.delete]} onPress={handleDelete} disabled={loading}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loaderContainer: {
        padding: 20,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#059669',
    },
    closeButton: {
        padding: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#64748b',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginTop: 12,
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#f8fafc',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        fontSize: 15,
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    save: {
        backgroundColor: '#059669',
    },
    delete: {
        backgroundColor: '#ef4444',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default ContactForm;

