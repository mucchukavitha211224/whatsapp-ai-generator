import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import dotenv from 'dotenv';

dotenv.config();

// Helper to ZIP a directory and return a Promise resolving to a buffer
const zipDirectoryToBuffer = (sourceDir) => {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const buffers = [];

    archive.on('data', (data) => buffers.push(data));
    archive.on('end', () => resolve(Buffer.concat(buffers)));
    archive.on('error', (err) => reject(err));

    archive.directory(sourceDir, false);
    archive.finalize();
  });
};

export const deploySite = async (siteId, siteDir, businessName) => {
  const port = process.env.PORT || 3000;
  const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
  const localUrl = `${baseUrl}/sites/${siteId}`;

  const netlifyToken = process.env.NETLIFY_AUTH_TOKEN;

  if (!netlifyToken) {
    console.log(`[Deployer] No NETLIFY_AUTH_TOKEN configured. Gracefully serving locally: ${localUrl}`);
    return {
      success: true,
      platform: 'local',
      url: localUrl,
      previewUrl: localUrl
    };
  }

  try {
    console.log(`[Deployer] Creating zip archive of generated files at ${siteDir}...`);
    const zipBuffer = await zipDirectoryToBuffer(siteDir);

    console.log('[Deployer] Connecting to Netlify API for Zip deployment...');
    
    // Netlify supports direct binary ZIP upload to /sites endpoint to create and deploy instantly!
    const response = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/zip'
      },
      body: zipBuffer
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Netlify API responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const liveUrl = data.ssl_url || data.url;

    console.log(`[Deployer] Successfully deployed to Netlify! Live URL: ${liveUrl}`);
    return {
      success: true,
      platform: 'netlify',
      url: liveUrl,
      previewUrl: localUrl,
      siteId: data.id
    };
  } catch (error) {
    console.error('[Deployer] Netlify Deployment failed:', error.message);
    console.log(`[Deployer] Falling back to Local Static host: ${localUrl}`);
    return {
      success: true,
      platform: 'local_fallback',
      url: localUrl,
      previewUrl: localUrl,
      error: error.message
    };
  }
};
