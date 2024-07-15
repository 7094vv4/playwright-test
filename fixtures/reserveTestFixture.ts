import { test as base } from "@playwright/test";
import { TopPage } from "pages/TopPage";
import { LoginPage } from "pages/LoginPage";
import { MyPage } from "pages/MyPage";
import { PlansPage } from "pages/PlansPage";

type MyFixtures = {
  topPage: TopPage;
  loginPage: LoginPage;
  myPage: MyPage;
  plansPage: PlansPage;
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

  plansPage: async ({ page }, use) => {
    await use(new PlansPage(page));
  },
});

export { expect } from "@playwright/test";
