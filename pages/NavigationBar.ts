import { type Locator, type Page } from "@playwright/test";

export class NavigationBar {
  readonly loginButton: Locator;
  readonly signupLink: Locator;
  readonly plansLink: Locator;

  constructor(page: Page) {
    this.loginButton = page.getByRole("button", { name: "ログイン" });
    this.signupLink = page.getByRole("link", { name: "会員登録" });
    this.plansLink = page.getByRole("link", { name: "宿泊予約" });
  }

  async goToLoginPage() {
    await this.loginButton.click();
  }

  async goToSignupPage() {
    await this.signupLink.click();
  }

  async goToPlansPage() {
    await this.plansLink.click();
  }
}
