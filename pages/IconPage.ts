import { type Locator, type Page } from "@playwright/test";
import { NavigationBar } from "./NavigationBar";

export class IconPage extends NavigationBar {
  readonly page: Page;
  readonly icon: Locator;
  readonly invalidFeedback: Locator;
  readonly zoom: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.icon = page.locator("#icon");
    this.invalidFeedback = page.locator("div.invalid-feedback");
    this.zoom = page.locator("#zoom");
    this.submitButton = page.getByRole("button", { name: "確定" });
  }

  async setIcon(path: string) {
    await this.icon.setInputFiles(path);
  }

  async setZoom(value: number) {
    if (value < 0 || value > 100) return;

    await this.page.evaluate((value) => {
      const zoom = document.querySelector("#zoom") as HTMLInputElement;
      if (zoom) {
        zoom.value = value.toString();
        zoom.dispatchEvent(new Event("input", { bubbles: true }));
        zoom.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, value);
  }

  async setColor(value: string) {
    const hexColorPattern = /^#([0-9A-F]{3}){1,2}$/i;
    if (!hexColorPattern.test(value)) return;

    await this.page.evaluate((value) => {
      const color = document.querySelector("#color") as HTMLInputElement;
      if (color) {
        color.value = value;
        color.dispatchEvent(new Event("input", { bubbles: true }));
        color.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, value);
  }

  async submit() {
    await this.submitButton.click();
  }
}
