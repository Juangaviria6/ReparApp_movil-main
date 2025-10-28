import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import app from './firebaseConfig';
import * as SQLite from 'expo-sqlite';

const db = getFirestore(app);
const auth = getAuth(app);

export const updateUserProfilePhoto = async (userId, photoURL) => {
    if (!userId) {
      throw new Error("Se requiere un ID de usuario para actualizar el perfil.");
    }
  
    try {
      
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: photoURL });
      }
  
      
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        photoURL: photoURL,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      console.log('Foto de perfil actualizada exitosamente en Auth y Firestore.');
      return true;
  
    } catch (error) {
      console.error('Error updating user profile photo:', error);
      throw error;
    }
  };
  
  export const getUserData = async (userId) => {
    if (!userId) return null;

    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        console.warn(`No se encontró un documento para el usuario con ID: ${userId}`);
        return null;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  };

  export const updateUserProfile = async (userId, { displayName, phone }) => {
    if (!userId) {
      throw new Error("Se requiere un ID de usuario para actualizar el perfil.");
    }

    try {
      // Actualizar en Firebase Auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { 
          displayName: displayName 
        });
      }

      // Actualizar en Firestore
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        displayName: displayName,
        phone: phone || null,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Actualizar teléfono en SQLite si existe
      try {
        const sqliteDb = SQLite.openDatabaseSync('reparapp.db');
        const contactData = sqliteDb.getFirstSync(
          `SELECT * FROM user_contact WHERE id = ?;`,
          [userId]
        );
        
        if (contactData || phone) {
          sqliteDb.runSync(
            `INSERT OR REPLACE INTO user_contact (id, direccion, telefono, tipo_vivienda, referencia, notas)
             VALUES (?,?,?,?,?,?);`,
            [
              userId,
              contactData?.direccion || null,
              phone || contactData?.telefono || null,
              contactData?.tipo_vivienda || null,
              contactData?.referencia || null,
              contactData?.notas || null
            ]
          );
        }
      } catch (sqliteError) {
        console.log('SQLite no disponible o error:', sqliteError);
        // No es crítico, continúa sin SQLite
      }
      
      console.log('Perfil actualizado exitosamente en Auth y Firestore.');
      return true;

    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };