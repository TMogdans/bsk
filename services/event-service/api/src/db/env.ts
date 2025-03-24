import dotenv from "dotenv";
export function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        dotenv.config();
        if (!process.env[name]) {
            throw new Error(`Environment variable ${name} is required`);
        }
        return process.env[name];
    }
    return value;
}
