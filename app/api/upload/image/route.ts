import { NextRequest, NextResponse } from 'next/server';

// Enable Edge Runtime for better performance
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    console.log('🖼️ API Route: POST /api/upload/image');
    
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({
        success: false,
        error: 'No image file provided',
      }, { status: 400 });
    }
    
    console.log('📁 Image file received:', image.name, 'Size:', image.size);
    
    // Forward to backend server
    const backendFormData = new FormData();
    backendFormData.append('image', image);
    
    const backendUrl = 'http://localhost:5000/api/upload/image';
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: backendFormData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend upload error:', errorText);
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Image uploaded successfully:', data.url);

    return NextResponse.json({
      success: true,
      url: data.url,
      filename: data.filename,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in POST /api/upload/image:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
