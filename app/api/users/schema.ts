import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3, "The name is too short"),
  email: z.string().email("Invalid email"),
  image: z.string().url("Invalid image link").optional()
});

export default userSchema;
