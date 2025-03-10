import fs from 'fs/promises';

export async function readPDFFile(filePath: string): Promise<Buffer> {
  try {
    return await fs.readFile(filePath);
  } catch (error) {
    console.error('Error reading PDF file:', error);
    throw error;
  }
}
