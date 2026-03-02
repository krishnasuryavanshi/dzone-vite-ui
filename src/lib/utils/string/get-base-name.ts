/**
 * Returns the base name of a file by splitting the given fileName string at the last occurrence of the dot (.) character.
 *
 * @param {string} fileName - The name of the file.
 * @return {string} The base name of the file.
 */

export function getBaseName(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex !== -1 && dotIndex !== 0) {
    return fileName.slice(0, dotIndex); // Extract substring from start to dotIndex
  } else {
    return fileName;
  }
}
