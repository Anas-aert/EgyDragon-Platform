import { z } from "zod";

const followSchema = z.object({
  userId: z.uuid({ message: "Invalid User Id" }),
  name: z.string().min(3, "Name too short").max(50, "Name too long").optional(),
  postUserId: z.uuid({ message: "Invalid Post User Id" }),
});

export default followSchema;
