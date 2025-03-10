import { generatePDF } from './pdf-service';
import EntityReceipt, { type EntityReceiptProps } from './entity-receipt';
import EnergyPackageReceipt, { type EnergyPackageReceiptProps } from './energy-package-receipt';
import { sendPDFEmail } from './pdf-mail';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique filenames

const GENERATED_PDF_DIR = path.resolve(__dirname, './generate');

/**
 * Ensure the /pdf/generate directory exists.
 */
async function ensureGenerateDirectory() {
  try {
    await fs.mkdir(GENERATED_PDF_DIR, { recursive: true });
  } catch (error) {
    console.error('Error ensuring generate directory:', error);
  }
}

/**
 * Generate, email, and delete an Entity Receipt PDF.
 */
export const sendEntityReceipt = async (data: EntityReceiptProps) => {
  await ensureGenerateDirectory();

  // Generate a unique filename
  const uniqueFilename = `entity-receipt-${uuidv4()}.pdf`;
  const pdfPath = path.join(GENERATED_PDF_DIR, uniqueFilename);

  try {
    // Generate the PDF
    await generatePDF(EntityReceipt, data, pdfPath);

    // Send the PDF via email
    const emailResult = await sendPDFEmail(
      data.receiver.email,
      'Your Entity Receipt',
      `Dear ${data.receiver.username},\n\nPlease find your entity receipt attached.`,
      pdfPath
    );

    console.log('Entity receipt email result:', emailResult);

    // Delete the PDF
    await fs.unlink(pdfPath);
    console.log('Deleted generated PDF:', pdfPath);
  } catch (error) {
    console.error('Error in sendEntityReceipt:', error);
  }
};

/**
 * Generate, email, and delete an Energy Package Receipt PDF.
 */
export const sendEnergyPackageReceipt = async (data: EnergyPackageReceiptProps) => {
  await ensureGenerateDirectory();

  // Generate a unique filename
  const uniqueFilename = `energy-package-receipt-${uuidv4()}.pdf`;
  const pdfPath = path.join(GENERATED_PDF_DIR, uniqueFilename);

  try {
    // Generate the PDF
    await generatePDF(EnergyPackageReceipt, data, pdfPath);

    // Send the PDF via email
    const emailResult = await sendPDFEmail(
      data.receiver.email,
      'Your Energy Package Receipt',
      `Dear ${data.receiver.username},\n\nPlease find your energy package receipt attached.`,
      pdfPath
    );

    console.log('Energy package receipt email result:', emailResult);

    // Delete the PDF
    await fs.unlink(pdfPath);
    console.log('Deleted generated PDF:', pdfPath);
  } catch (error) {
    console.error('Error in sendEnergyPackageReceipt:', error);
  }
};

export const senderDetails: EnergyPackageReceiptProps['sender'] = {
  name: 'GRWBSOL LLC ',
  address: 'Hope Valley, RI 02832',
  addressline2: 'USA',
};
