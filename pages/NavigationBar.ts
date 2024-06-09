import { type Locator, type Page } from "@playwright/test";

export class NavigationBar {
  readonly loginButton: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    this.loginButton = page.getByRole("button", { name: "ログイン" });
    this.signupButton = page.getByRole("link", { name: "会員登録" });
  }

  async goToLoginPage() {
    await this.loginButton.click();
  }

  async goToSignupPage() {
    await this.signupButton.click();
  }
}
