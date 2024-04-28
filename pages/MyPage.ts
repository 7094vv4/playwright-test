import { expect, type Locator, type Page } from "@playwright/test";
import { NavigationBar } from "./NavigationBar";

export class MyPage extends NavigationBar {
  readonly page: Page;
  readonly email: Locator;
  readonly username: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.email = page.locator("id=email");
    this.username = page.locator("id=username");
  }
}
