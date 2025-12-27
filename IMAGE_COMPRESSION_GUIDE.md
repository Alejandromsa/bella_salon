# Guía de Compresión Automática de Imágenes

## Descripción General

El sistema ahora incluye **compresión automática de imágenes** que garantiza que todas las fotos subidas:
- ✅ Sean menores a 5 MB (en formato base64)
- ✅ Mantengan buena calidad visual
- ✅ Se optimicen automáticamente sin intervención del usuario
- ✅ Reduzcan el uso de espacio en la base de datos

## Cómo Funciona

### 1. **Cuando subes una imagen:**
El sistema automáticamente:
1. Valida que sea un archivo de imagen válido (JPG, PNG, GIF, WebP)
2. Verifica el tamaño del archivo
3. Si es necesario, comprime la imagen utilizando:
   - Reducción de calidad (85% inicial, puede bajar hasta 50%)
   - Redimensionamiento inteligente (máximo 1920px en el lado más largo)
   - Conversión a JPEG optimizado

### 2. **Proceso de Compresión:**

```
Imagen Original (ej. 10 MB)
         ↓
[Validación de tipo de archivo]
         ↓
[Cálculo de tamaño estimado en base64]
         ↓
¿Es mayor a 5 MB? → SÍ → [Compresión iterativa]
                 → NO → [Conversión directa]
         ↓
Imagen Optimizada (< 5 MB)
```

### 3. **Algoritmo de Compresión Iterativa:**

Si la imagen es muy grande, el sistema:
1. **Intento 1:** Calidad 85%, dimensiones originales (máx. 1920px)
2. **Intento 2:** Calidad 75%, dimensiones originales
3. **Intento 3:** Calidad 65%, dimensiones originales
4. **Intento 4:** Calidad 55%, dimensiones reducidas 80%
5. **Intento 5:** Calidad 50%, dimensiones reducidas 64%

Hasta lograr un tamaño menor a 5 MB o llegar al límite de calidad mínima.

## Dónde se Aplica

### ✅ Gestión de Personal
- **Ubicación:** `/administracion` → Pestaña "Gestión de Personal"
- **Función:** Foto de perfil de especialistas
- **Archivo:** `src/app/administracion/page.tsx` → `handleImageUpload()`

### ✅ Gestión de Servicios
- **Ubicación:** `/administracion` → Pestaña "Gestión de Servicios"
- **Función:** Imagen promocional de servicios
- **Archivo:** `src/app/administracion/page.tsx` → `handleServiceImageUpload()`

## Beneficios

### 📊 Rendimiento
- **Carga más rápida:** Imágenes optimizadas = páginas más rápidas
- **Menor uso de ancho de banda:** Ahorro en transferencia de datos
- **Mejor experiencia móvil:** Fundamental para conexiones lentas

### 💾 Base de Datos
- **Espacio ahorrado:** Una imagen de 10 MB se reduce a ~2-3 MB
- **Backups más rápidos:** Menos datos = backups más eficientes
- **Menor costo de almacenamiento:** En producción, esto ahorra dinero

### 👤 Experiencia de Usuario
- **Sin rechazos:** Las imágenes se comprimen automáticamente
- **Proceso transparente:** El usuario solo ve un mensaje de éxito
- **Información útil:** Se muestra en consola el ratio de compresión

## Información Técnica

### Archivo Principal
📁 `src/lib/imageCompression.ts`

### Funciones Exportadas

#### `compressImage(file, options)`
Comprime una imagen y retorna el resultado.

**Parámetros:**
```typescript
file: File                    // Archivo de imagen del input
options?: {
    maxSizeMB?: number        // Tamaño máximo en MB (default: 5)
    maxWidthOrHeight?: number // Dimensión máxima (default: 1920)
    initialQuality?: number   // Calidad inicial (default: 0.85)
}
```

**Retorna:**
```typescript
{
    success: boolean
    data?: string            // Base64 de la imagen comprimida
    error?: string          // Mensaje de error si falló
    originalSize?: number   // Tamaño original en bytes
    compressedSize?: number // Tamaño final en bytes
    compressionRatio?: number // Ratio de compresión
}
```

#### `formatFileSize(bytes)`
Formatea bytes a formato legible.

**Ejemplo:**
```typescript
formatFileSize(1048576)  // "1 MB"
formatFileSize(524288)   // "512 KB"
```

## Ejemplos de Uso

### Ejemplo 1: Imagen Grande (8 MB)
```
Original: 8 MB (8,388,608 bytes)
   ↓
Compresión aplicada: Calidad 75%, Dimensiones 1920px
   ↓
Resultado: 2.3 MB (2,411,724 bytes)
Reducción: 72%
```

### Ejemplo 2: Imagen Pequeña (500 KB)
```
Original: 500 KB (512,000 bytes)
   ↓
No requiere compresión (< 5 MB base64)
   ↓
Resultado: 500 KB (conversión directa a base64)
Reducción: 0%
```

### Ejemplo 3: Imagen Muy Grande (25 MB)
```
Original: 25 MB
   ↓
Intento 1: 8.5 MB (calidad 85%) → Aún grande
Intento 2: 6.2 MB (calidad 75%) → Aún grande
Intento 3: 4.8 MB (calidad 65%) → ✅ Éxito!
   ↓
Resultado: 4.8 MB
Reducción: 81%
```

## Logs en Consola

Cuando subes una imagen, verás en la consola del navegador:

```
Imagen optimizada: 8.5 MB → 2.3 MB (73% reducción)
```

Esto te permite monitorear el rendimiento de la compresión.

## Errores Posibles

### "El archivo debe ser una imagen"
- **Causa:** Subiste un archivo que no es JPG, PNG, GIF o WebP
- **Solución:** Usa solo archivos de imagen válidos

### "No se pudo comprimir la imagen lo suficiente"
- **Causa:** La imagen es extremadamente grande o compleja
- **Solución:** Usa una herramienta externa para reducir la imagen antes de subirla

### "Error al procesar la imagen"
- **Causa:** Error interno del navegador o archivo corrupto
- **Solución:** Intenta con otra imagen

## Configuración Personalizada

Si necesitas ajustar los límites, edita `src/lib/imageCompression.ts`:

```typescript
const DEFAULT_OPTIONS: CompressionOptions = {
    maxSizeMB: 5,           // Cambiar tamaño máximo
    maxWidthOrHeight: 1920, // Cambiar dimensiones máximas
    initialQuality: 0.85    // Cambiar calidad inicial
};
```

## Compatibilidad

✅ **Navegadores Soportados:**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

✅ **Formatos de Imagen:**
- JPEG / JPG
- PNG (se convierte a JPEG para mejor compresión)
- GIF
- WebP

## Notas de Rendimiento

- **Tiempo de compresión:** 1-3 segundos para imágenes de 5-10 MB
- **Uso de memoria:** Temporal durante el proceso, se libera automáticamente
- **Calidad visual:** Imperceptible para el ojo humano con calidad > 70%

## Mantenimiento

### Monitoreo
Revisa regularmente la consola del navegador para ver los ratios de compresión. Si ves muchas imágenes con < 30% de reducción, considera aumentar la compresión inicial.

### Actualizaciones Futuras
Posibles mejoras:
- [ ] Barra de progreso visual durante la compresión
- [ ] Previsualización antes/después
- [ ] Soporte para múltiples imágenes simultáneas
- [ ] Compresión en el servidor (Node.js) para mejor rendimiento

---

**Versión:** 1.0
**Última actualización:** 2025-12-23
**Autor:** Sistema de compresión automática de BellaSalón
