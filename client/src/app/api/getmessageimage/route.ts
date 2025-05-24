import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import mime from 'mime'

export const GET = async (NextRequest: NextRequest) => {
	const fileName = NextRequest.nextUrl.searchParams.get('filename');

	if (!fileName) {
		return NextResponse.json(
			{
				success: false,
				error: 'Missing "filepath" query parameter.',
			},
			{ status: 400 }
		);
	}

    const filePath = `media/message-files/${fileName}`;
    const fileMimeType = mime.getType(fileName) || 'application/octet-stream'

	try{
        const stream = fs.createReadStream(filePath)

        return new NextResponse(stream as any, {
            headers: {
                'Content-type': fileMimeType
            }
        })

    }catch(e){
        console.error(e);	
    }
};
