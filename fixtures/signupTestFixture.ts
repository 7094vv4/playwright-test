import { test as base } from "@playwright/test";
import { TopPage } from "pages/TopPage";
import { SignupPage } from "pages/SignupPage";

type MyFixtures = {
  topPage: TopPage;
  signupPage: SignupPage;
};

export const test = base.extend<MyFixtures>({
  topPage: async ({ page }, use) => {
    await use(new TopPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
});

export { expect } from "@playwright/test";
