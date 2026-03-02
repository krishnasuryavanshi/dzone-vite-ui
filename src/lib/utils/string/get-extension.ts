/**
 * Retrieves the file extension from the given fileName.
 *
 * @param {string} fileName - The name of the file.
 * @return {string} The extension of the file.
 */
export function getExtension(fileName: string): string {
    const dotIndex = fileName.lastIndexOf('.');
    
    if (dotIndex !== -1 && dotIndex !== fileName.length - 1) {
        return fileName.slice(dotIndex + 1); // Extract substring from dotIndex + 1 to end of string
    } else {
        return '';
    }
}