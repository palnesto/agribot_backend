import fs from 'fs';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';

export const generatePDF = async (DocumentComponent: React.FC<{ receipt: any }>, receiptData: any, outputFileName: string): Promise<string> => {
  const stream = await renderToStream(<DocumentComponent receipt={receiptData} />);
  const writeStream = fs.createWriteStream(outputFileName);

  return new Promise((resolve, reject) => {
    stream.pipe(writeStream);
    writeStream.on('finish', () => resolve(outputFileName));
    writeStream.on('error', (err) => reject(err));
  });
};
