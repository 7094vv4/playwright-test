import { type Locator, type Page } from "@playwright/test";
import { NavigationBar } from "./NavigationBar";

export class LoginPage extends NavigationBar {
  readonly page: Page;
  readonly emailMessage: Locator;
  readonly passwordMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.emailMessage = page.locator("#email-message");
    this.passwordMessage = page.locator("#password-message");
  }

  async doLogin(email: string, password: string) {
    await this.page.getByLabel("メールアドレス").fill(email);
    await this.page.getByLabel("パスワード").fill(password);
    await this.page.locator("#login-button").click();
  }
}
