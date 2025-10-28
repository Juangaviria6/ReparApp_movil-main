import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('reparapp.db');

const init = () => {
    db.execSync(
        `CREATE TABLE IF NOT EXISTS user_contact (
            id TEXT PRIMARY KEY NOT NULL,
            direccion TEXT,
            telefono TEXT,
            tipo_vivienda TEXT,
            referencia TEXT,
            notas TEXT
        );`
    );
    
    db.execSync(
        `CREATE TABLE IF NOT EXISTS favorites (
            id TEXT PRIMARY KEY NOT NULL,
            provider_id TEXT NOT NULL,
            provider_name TEXT NOT NULL,
            provider_rating REAL,
            services_offered TEXT,
            user_id TEXT NOT NULL,
            created_at TEXT
        );`
    );
    
    db.execSync(
        `CREATE TABLE IF NOT EXISTS providers (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            address TEXT,
            rating REAL DEFAULT 0.0,
            rating_count INTEGER DEFAULT 0,
            created_at TEXT
        );`
    );
};

const upsertContact = (id, {direccion = null, telefono = null, tipo_vivienda = null, referencia = null, notas = null} = {}) => {
    const result = db.runSync(
       `INSERT OR REPLACE INTO user_contact (id, direccion, telefono, tipo_vivienda, referencia, notas)
       VALUES (?,?,?,?,?,?);`,
       [id, direccion, telefono, tipo_vivienda, referencia, notas] 
    );
    return result;
};

const getContactById = (id) => {
    const row = db.getFirstSync(
        `SELECT * FROM user_contact WHERE id = ?;`,
        [id]
    );
    return row || null;
}

const deleteContactById = (id) => {
  const result = db.runSync(
    `DELETE FROM user_contact WHERE id = ?;`,
    [id]
  );
  return result;
};

// Funciones para Favoritos
const addFavorite = (userId, providerId, providerData) => {
    const id = `${userId}_${providerId}`;
    const result = db.runSync(
        `INSERT OR REPLACE INTO favorites (id, provider_id, provider_name, provider_rating, services_offered, user_id, created_at)
         VALUES (?,?,?,?,?,?,?);`,
        [
            id, 
            providerId, 
            providerData.name || '',
            providerData.rating || 0, 
            providerData.services || '',
            userId,
            new Date().toISOString()
        ]
    );
    return result;
};

const removeFavorite = (userId, providerId) => {
    const id = `${userId}_${providerId}`;
    const result = db.runSync(
        `DELETE FROM favorites WHERE id = ?;`,
        [id]
    );
    return result;
};

const getFavoriteById = (userId, providerId) => {
    const id = `${userId}_${providerId}`;
    const row = db.getFirstSync(
        `SELECT * FROM favorites WHERE id = ?;`,
        [id]
    );
    return row || null;
};

const getAllFavorites = (userId) => {
    const rows = db.getAllSync(
        `SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC;`,
        [userId]
    );
    return rows || [];
};

const isFavorite = (userId, providerId) => {
    const favorite = getFavoriteById(userId, providerId);
    return favorite !== null;
};

// Funciones para Proveedores/Empresas
const addProvider = (providerData) => {
    const id = providerData.id || Date.now().toString();
    const result = db.runSync(
        `INSERT INTO providers (id, name, category, phone, email, address, rating, rating_count, created_at)
         VALUES (?,?,?,?,?,?,?,?,?);`,
        [
            id,
            providerData.name,
            providerData.category,
            providerData.phone || null,
            providerData.email || null,
            providerData.address || null,
            providerData.rating || 0.0,
            providerData.rating_count || 0,
            new Date().toISOString()
        ]
    );
    return result;
};

const getAllProviders = () => {
    const rows = db.getAllSync(
        `SELECT * FROM providers ORDER BY name ASC;`
    );
    return rows || [];
};

const getProvidersByCategory = (category) => {
    const rows = db.getAllSync(
        `SELECT * FROM providers WHERE category = ? ORDER BY name ASC;`,
        [category]
    );
    return rows || [];
};

const deleteProvider = (providerId) => {
    const result = db.runSync(
        `DELETE FROM providers WHERE id = ?;`,
        [providerId]
    );
    return result;
};

export default {
    init,
    upsertContact,
    getContactById,
    deleteContactById,
    addFavorite,
    removeFavorite,
    getFavoriteById,
    getAllFavorites,
    isFavorite,
    addProvider,
    getAllProviders,
    getProvidersByCategory,
    deleteProvider
}