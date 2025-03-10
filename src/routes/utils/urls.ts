import { Hono, type Context } from 'hono';
import { getUniqueSignedUrl, deleteAssets } from '@saranshkhulbe/asset-manager-server-utils';

const digitalOceanCreds = {
  region: process.env.DO_SPACES_REGION!,
  key: process.env.DO_SPACES_KEY!,
  secret: process.env.DO_SPACES_SECRET!,
  bucket: process.env.DO_SPACES_BUCKET!,
};

export async function getSignedUrl(c: Context) {
  try {
    // Expect payload: { file: { fileName: "photo.jpg" }, shouldSameUrl?: boolean }
    const { file, shouldSameUrl } = await c.req.json();
    if (!file || !file.fileName) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileName: string = file.fileName;
    // Generate a signed URL for this file.
    const result = await getUniqueSignedUrl(fileName, digitalOceanCreds, !!shouldSameUrl);
    return c.json({ signedUrl: result.signedUrl });
  } catch (err) {
    console.error('Error in getSignedUrl:', err);
    return c.json({ error: 'Failed to generate signed URL' }, 500);
  }
}

export const utilsRouter = new Hono();

utilsRouter.post('/signed-url', getSignedUrl);
