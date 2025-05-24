import { z, ZodError } from 'zod';

const fileRefiner1 = (file: File) => {
    return file.type.startsWith('image/');
};

const fileRefiner2 = (file: File) => {
    return file.size > 0 && file.size < 4 * 100 * 1024; //- 400kb  I've seen that images are very little so I could decrease this even more to trigger it more often
};

const imageSchema = z
    .instanceof(File, { message: 'Image is required' })
    .refine(fileRefiner1, { message: 'File must be an image' })
    .refine(fileRefiner2, { message: '⚠️ Image size must be less than 400KB, use Private Rooms to send larger files',});



export const handleBlobMessage = ( payload: ClientPrivateFileMessageWhenReceived)=>{

    try {
        const blob = new File([payload.bytes!], payload.fileName, { type: payload.fileType,});
        imageSchema.parse(blob);
        return {success: true, message: 'success'}

    } catch (e) {
        console.error(e)
        if (e instanceof ZodError) {
            const errorMessages = e.issues.map((issue) => issue.message);
            const msg = errorMessages[0] || 'Invalid file';
            return {success: false, message: msg};
        }
        
        return {success: false, message: 'Something went wrong, see the log.'}
    }
}