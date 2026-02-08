import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

/**
 * Handler for /uploads/* routes that provides fallback to .webp and R2 storage
 * while preventing path traversal vulnerabilities.
 */
export const handleUploads = (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqPath = decodeURIComponent(req.path);
    // Normalize path to prevent traversal (e.g., /uploads/../.env)
    const normalizedPath = path.normalize(reqPath).replace(/\\/g, '/');

    // SECURITY: Ensure the path stays within the /uploads directory
    if (!normalizedPath.startsWith('/uploads/')) {
      console.warn(`🚨 Path traversal attempt blocked: ${reqPath}`);
      return res.status(403).json({ error: 'Access denied' });
    }

    const relPath = normalizedPath.replace(/^\/+/, ''); // remove leading /
    const absPath = path.join(process.cwd(), relPath);

    fs.access(absPath, fs.constants.R_OK, (err) => {
      if (!err) return next(); // file exists; let static middleware handle it

      // If R2 public base is configured, redirect to it as a primary fallback
      const publicBase = process.env.R2_PUBLIC_BASE_URL;
      if (publicBase) {
        const target = `${publicBase}/${relPath}`;
        return res.redirect(302, target);
      }

      // Try .webp counterpart
      const webpRel = relPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      if (webpRel === relPath) return next();
      const webpAbs = path.join(process.cwd(), webpRel);

      // SECURITY: Double check webpAbs is still within uploads directory
      const uploadsPath = path.join(process.cwd(), 'uploads');
      if (!webpAbs.startsWith(uploadsPath)) {
        return next();
      }

      fs.access(webpAbs, fs.constants.R_OK, (err2) => {
        if (!err2) {
          res.type('image/webp').sendFile(webpAbs);
        } else {
          next();
        }
      });
    });
  } catch {
    next();
  }
};
