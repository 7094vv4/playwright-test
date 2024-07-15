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

  async openPlanByTitle(title: string) {
    const reserveButton = this.page.locator(
      `xpath=//h5[text()='${title}']/following-sibling::a[contains(concat(' ', normalize-space(@class), ' '), ' btn-primary ')]`
    );
    await reserveButton.click();
  }
}
