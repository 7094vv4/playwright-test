import { type Locator, type Page, expect } from "@playwright/test";

export class ConfirmPage {
  readonly page: Page;
  readonly totalBill: Locator;
  readonly planName: Locator;
  readonly term: Locator;
  readonly headCount: Locator;
  readonly plans: Locator;
  readonly plansItems: Locator;
  readonly username: Locator;
  readonly contact: Locator;
  readonly comment: Locator;
  readonly confirmButton: Locator;
  readonly modalMessage: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalBill = page.locator("#total-bill");
    this.planName = page.locator("#plan-name");
    this.term = page.locator("#term");
    this.headCount = page.locator("#head-count");
    this.plans = page.locator("#plans");
    this.plansItems = page.locator("#plans ul > li");
    this.username = page.locator("#username");
    this.contact = page.locator("#contact");
    this.comment = page.locator("#comment");
    this.confirmButton = page.getByRole("button", {
      name: "この内容で予約する",
    });
    this.modalMessage = page.locator("#success-modal .modal-body > p");
    this.closeButton = page.getByRole("button", { name: "閉じる" });
  }

  async assertPlansItems(list: Array<string>) {
    await expect(this.plansItems).toHaveText(list);
  }

  async confirm() {
    await this.confirmButton.click();
  }

  async close() {
    await this.closeButton.click();
  }
}
