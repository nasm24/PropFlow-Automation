export type UserRole = "user";

export type TestUser = {
  role: UserRole;
  email: string;
  password: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getUser(): TestUser {
  return {
    role: "user",
    email: requiredEnv("USER_EMAIL"),
    password: requiredEnv("USER_PASSWORD"),
  };
}
