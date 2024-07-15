import { test as base } from "@playwright/test";
import { TopPage } from "pages/TopPage";
import { LoginPage } from "../pages/LoginPage";

type MyFixtures = {
  topPage: TopPage;
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  topPage: async ({ page }, use) => {
    await use(new TopPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from "@playwright/test";
