import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(3, "Very Short Title").max(100, "Very Long Title"),
  content: z.string().min(10, "Very Short Content"),
  authorId: z.string(), 
});



export default postSchema;