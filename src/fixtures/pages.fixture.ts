import { HomePage } from "../pages/home.page";
import { LoginPage } from "../pages/login.page";
import { test as authTest } from "./auth.fixture";

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  app: {
    home: HomePage;
    login: LoginPage;
  };
};

export const test = authTest.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  app: async ({ homePage, loginPage }, use) => {
    await use({ home: homePage, login: loginPage });
  },
});

export { expect } from "@playwright/test";
