import { type Locator, type Page } from "@playwright/test";

export class NavigationBar {
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.loginButton = page.getByRole("button", { name: "ログイン" });
  }

  async goToLoginPage() {
    await this.loginButton.click();
  }
}
