import z from "zod";
import "dotenv/config";

const ConfigSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  STRICT_MODE: z
    .string()
    .toLowerCase()
    .transform((t) => JSON.parse(t) as unknown)
    .pipe(z.boolean()),
});

export const config = ConfigSchema.parse(process.env);

export function fixme(message: string): void {
  if (config.STRICT_MODE) {
    throw new Error(`FIXME: ${message}`);
  } else {
    console.warn(`FIXME: ${message}`);
  }
}
