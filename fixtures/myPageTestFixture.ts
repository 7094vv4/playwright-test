import { test as base } from "@playwright/test";
import { TopPage } from "pages/TopPage";
import { LoginPage } from "pages/LoginPage";
import { MyPage } from "pages/MyPage";
import { SignupPage } from "pages/SignupPage";
import { IconPage } from "pages/IconPage";

type MyFixtures = {
  topPage: TopPage;
  loginPage: LoginPage;
  myPage: MyPage;
  signupPage: SignupPage;
  iconPage: IconPage;
};

export const test = base.extend<MyFixtures>({
  topPage: async ({ page }, use) => {
    await use(new TopPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  myPage: async ({ page }, use) => {
    await use(new MyPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  iconPage: async ({ page }, use) => {
    await use(new IconPage(page));
  },
});

export { expect } from "@playwright/test";
