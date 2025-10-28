import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('Error', 'Permiso de acceso a la biblioteca de fotos denegado');
        return false;
    }
    return true;
};

export const pickImage = async () => {
    const hasPermission = await requestImagePermission();
    if ( !hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (!result.canceled ) {
        return result.assets[0];
    }

    return null;
};

export const uploadImageToCloudinary = async (imageUri) => {
    try {
        // Verificar que las variables de entorno estén configuradas
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
            console.error('Cloudinary credentials not found');
            throw new Error('Las credenciales de Cloudinary no están configuradas');
        }

        const formData = new FormData();
        
        // Detectar si es web o móvil
        const isWeb = typeof document !== 'undefined';
        
        if (isWeb) {
            // Para web: convertir la URI a blob
            try {
                const response = await fetch(imageUri);
                const blob = await response.blob();
                formData.append('file', blob);
            } catch (error) {
                console.error('Error al convertir imagen:', error);
                // Fallback: usar el URI directamente
                formData.append('file', { uri: imageUri, type: 'image/jpeg', name: 'profile_image.jpg' });
            }
        } else {
            // Para móvil: usar el formato correcto
            formData.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'profile_image.jpg',
            });
        }
        
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
            // NO agregar Content-Type header, el navegador lo hace automáticamente
          }
        );
    
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = await response.text();
            }
            console.error('Cloudinary error response:', errorData);
            console.error('Cloudinary credentials:', { 
                cloudName: CLOUDINARY_CLOUD_NAME, 
                hasUploadPreset: !!CLOUDINARY_UPLOAD_PRESET 
            });
            throw new Error(`Error al subir la imagen (${response.status}): ${JSON.stringify(errorData)}`);
        }
    
        const data = await response.json();
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
      }
    };
    
    export const selectAndUploadImage = async () => {
      try {
        const imageAsset = await pickImage();
        if (!imageAsset) return null;
    
        const imageUrl = await uploadImageToCloudinary(imageAsset.uri);
        return imageUrl;
      } catch (error) {
        console.error('Error in selectAndUploadImage:', error);
        alert('Error al subir la imagen. Por favor, inténtalo de nuevo.');
        return null;
      }
    };


