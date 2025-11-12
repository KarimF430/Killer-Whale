export async function uploadImage(file: File): Promise<string | null> {
  if (!file) return null;
  const backendBase = 'http://localhost:5001';
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const presignHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) presignHeaders['Authorization'] = `Bearer ${token}`;
  try {
    // 1) Ask backend for a presigned PUT URL
    const presignRes = await fetch(`${backendBase}/api/uploads/presign`, {
      method: 'POST',
      headers: presignHeaders,
      body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream' })
    });
    if (!presignRes.ok) {
      const t = await presignRes.text();
      throw new Error(`presign failed: ${t}`);
    }
    const { uploadUrl, publicUrl } = await presignRes.json();

    // 2) Upload bytes directly to R2 via signed URL
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!putRes.ok) {
      const t = await putRes.text();
      throw new Error(`upload failed: ${t}`);
    }

    // 3) Return public URL for storage in DB
    return publicUrl as string;
  } catch (error) {
    console.warn('R2 upload failed, falling back to local endpoint:', error);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const localHeaders: Record<string, string> = {};
      if (token) localHeaders['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${backendBase}/api/upload/image`, {
        method: 'POST',
        headers: localHeaders,
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.url as string;
    } catch (e) {
      console.error('Local upload fallback failed:', e);
      return null;
    }
  }
}

export async function uploadMultipleImages(images: { file?: File; caption: string; previewUrl?: string }[]): Promise<{ url: string; caption: string }[]> {
  console.log('🖼️ Uploading multiple images:', images.length, 'images');
  
  const uploadPromises = images.map(async (img, index) => {
    if (img.file) {
      console.log(`📤 Uploading NEW image ${index + 1}:`, img.file.name, 'Caption:', img.caption);
      const url = await uploadImage(img.file);
      if (url) {
        console.log(`✅ Image ${index + 1} uploaded successfully:`, url);
        return { url, caption: img.caption };
      } else {
        console.error(`❌ Failed to upload image ${index + 1}`);
        return null; // Return null for failed uploads
      }
    } else if (img.previewUrl) {
      // Keep existing images (may already be public R2 URLs)
      console.log(`💾 Keeping existing image ${index + 1}:`, img.previewUrl, 'Caption:', img.caption);
      return { url: img.previewUrl, caption: img.caption };
    } else {
      console.log(`⏭️ Skipping empty image slot ${index + 1}`);
      return null; // Return null for empty slots
    }
  });

  const results = await Promise.all(uploadPromises);
  // Filter out null results (failed uploads or empty slots)
  const validResults = results.filter((result): result is { url: string; caption: string } => result !== null);
  console.log('🎯 Upload results:', validResults.length, 'valid images out of', images.length);
  return validResults;
}
