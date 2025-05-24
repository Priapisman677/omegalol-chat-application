import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import mime from 'mime'

export const GET = async (NextRequest: NextRequest) => {
    const imageName = NextRequest.nextUrl.searchParams.get('imagename');

    
    if (!imageName) {
        return NextResponse.json(
            {
                success: false,
                error: 'Missing "imageName" query parameter.',
            },
            { status: 400 }
        );
    }

    const imagePath = `media/${'profile-pics'}/${imageName}`;
    const imageMimeType = mime.getType(imageName) || 'application/octet-stream'

    try{
        const stream = fs.createReadStream(imagePath)

        return new NextResponse(stream as any, {
            headers: {
                'Content-type': imageMimeType
            }
        })

    }catch(e){
        console.error(e);	
    }
};
