/**
 * Compression Utilities - Data compression for save files using LZ-String
 */

import LZString from 'lz-string';

/**
 * Compress a string using LZ compression
 * @param {string} str - String to compress
 * @returns {string} Compressed string
 */
export function compress(str) {
  if (!str || str.length === 0) return '';

  try {
    return LZString.compressToUTF16(str);
  } catch (error) {
    console.error('Compression failed:', error);
    return str; // Return original if compression fails
  }
}

/**
 * Decompress a compressed string
 * @param {string} compressed - Compressed string
 * @returns {string} Decompressed string
 */
export function decompress(compressed) {
  if (!compressed || compressed.length === 0) return '';

  try {
    const decompressed = LZString.decompressFromUTF16(compressed);
    return decompressed || compressed;
  } catch (error) {
    console.error('Decompression failed:', error);
    return compressed; // Return original if decompression fails
  }
}

/**
 * Compress JSON object
 * @param {Object} obj - Object to compress
 * @returns {string} Compressed JSON string
 */
export function compressJSON(obj) {
  const json = JSON.stringify(obj);
  return compress(json);
}

/**
 * Decompress JSON object
 * @param {string} compressed - Compressed string
 * @returns {Object} Decompressed object
 */
export function decompressJSON(compressed) {
  const decompressed = decompress(compressed);
  try {
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('JSON parse failed:', error);
    return null;
  }
}

/**
 * Calculate compression ratio
 * @param {string} original - Original string
 * @param {string} compressed - Compressed string
 * @returns {number} Compression ratio (0-1)
 */
export function getCompressionRatio(original, compressed) {
  if (!original || !compressed) return 0;
  return compressed.length / original.length;
}

/**
 * Get size in KB
 * @param {string} str - String to measure
 * @returns {number} Size in KB
 */
export function getSizeKB(str) {
  if (!str) return 0;
  return (new Blob([str]).size / 1024).toFixed(2);
}
