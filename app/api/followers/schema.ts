import { z } from "zod";

const followSchema = z.object({
  userId: z.uuid({ message: "Invalid User Id" }),
  postUserId: z.uuid({ message: "Invalid Post User Id" }),
});

export default followSchema;