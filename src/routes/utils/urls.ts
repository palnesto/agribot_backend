import { Hono, type Context } from 'hono';
import { digitalOceanCreds } from '@/db/configs/digital-ocean-creds';
import { getUniqueSignedUrl } from '@saranshkhulbe/asset-manager-server-utils';
import { S3Client, PutObjectAclCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

async function makePublic(c: Context) {
  try {
    const { file } = await c.req.json();
    if (!file || !file.fileName) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Create a new S3 client using your DigitalOcean Spaces credentials.
    const s3Client = new S3Client({
      region: digitalOceanCreds.region,
      endpoint: `https://${digitalOceanCreds.region}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId: digitalOceanCreds.key,
        secretAccessKey: digitalOceanCreds.secret,
      },
    });

    // Create and send the PutObjectAclCommand to set the object to public-read.
    const command = new PutObjectAclCommand({
      Bucket: digitalOceanCreds.bucket,
      Key: file.fileName,
      ACL: 'public-read',
    });
    await s3Client.send(command);

    console.log('Object updated successfully', file.fileName);

    return c.json({ status: true, message: 'Object is now public-read' });
  } catch (err) {
    console.error('Error updating ACL:', err);
    return c.json({ error: 'Failed to update ACL' }, 500);
  }
}

export const utilsRouter = new Hono();

utilsRouter.post('/signed-url', getSignedUrl);
utilsRouter.post('/make-public', makePublic);
