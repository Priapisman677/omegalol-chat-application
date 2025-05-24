import { z } from "zod"
export const TextMessageSchema = z.object({
    textContent: z.string({ required_error: 'Text message is required' }).min(1).max(1000),
    messageType: z.enum(['text', 'file']),
    roomId: z.string(),
  });