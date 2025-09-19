import z from "zod";

const schema = z.object({
  id: z.uuid(),
});

export default schema;
