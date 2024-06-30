import { type Locator, type Page } from "@playwright/test";
import { NavigationBar } from "./NavigationBar";

export class PlansPage extends NavigationBar {
  readonly page: Page;
  readonly reserveButton: Locator;
  readonly planTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.reserveButton = page.getByRole("link", { name: "このプランで予約" });
    this.planTitle = page.locator("h5.card-title");
  }
}
