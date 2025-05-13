import z from "zod"

import "dotenv/config"

const ConfigSchema = z.object({
    DATABASE_URL: z.string().nonempty()
})

export const config = ConfigSchema.parse(process.env)