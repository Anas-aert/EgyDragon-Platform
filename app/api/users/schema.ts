import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3, "The name is too short"),
  email: z.email("Invalid email"),
  image: z.url("Invalid image link").optional()
});

export default userSchema;
