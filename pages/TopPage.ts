import { expect, type Locator, type Page } from "@playwright/test";
import { NavigationBar } from "./NavigationBar";

export class TopPage extends NavigationBar {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  async goto() {
    await this.page.goto(`${process.env.BASEURL}/`);
  }
}
