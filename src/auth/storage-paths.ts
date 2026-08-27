import path from "path";

export const AUTH_DIR = path.join(process.cwd(), "playwright", ".auth");

export const USER_STORAGE_STATE = path.join(AUTH_DIR, "user.json");
