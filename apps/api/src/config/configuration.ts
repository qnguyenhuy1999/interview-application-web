import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  PORT: z.string().default("3001"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: "7d",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
  server: {
    port: parseInt(process.env.PORT || "3001", 10),
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
};

export const validateEnv = () => {
  try {
    envSchema.parse(process.env);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const missing = err.errors.map((e) => e.path.join(".")).join(", ");
      throw new Error(`Missing required env vars: ${missing}`);
    }
    throw err;
  }
};
