import { type Locator, type Page, expect } from "@playwright/test";
import { NavigationBar } from "./NavigationBar";

export class MyPage extends NavigationBar {
  readonly page: Page;
  readonly email: Locator;
  readonly username: Locator;
  readonly rank: Locator;
  readonly address: Locator;
  readonly tel: Locator;
  readonly gender: Locator;
  readonly birthday: Locator;
  readonly notification: Locator;
  readonly iconLink: Locator;
  readonly icon: Locator;
  readonly deleteButton: Locator;
  readonly deleteMessage1 =
    "退会すると全ての情報が削除されます。\nよろしいですか？";
  readonly deleteMessage2 =
    "退会処理を完了しました。ご利用ありがとうございました。";
  private message = "";

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.email = page.locator("#email");
    this.username = page.locator("#username");
    this.rank = page.locator("#rank");
    this.address = page.locator("#address");
    this.tel = page.locator("#tel");
    this.gender = page.locator("#gender");
    this.birthday = page.locator("#birthday");
    this.notification = page.locator("#notification");
    this.iconLink = page.locator("#icon-link");
    this.icon = page.getByRole("img");
    this.deleteButton = page.getByRole("button", { name: "退会する" });
  }

  async goToIconPage() {
    await this.iconLink.click();
  }

  async deleteUser() {
    this.page.on("dialog", (dialog) => {
      this.message = dialog.message();
      if (
        this.message === this.deleteMessage1 ||
        this.message === this.deleteMessage2
      ) {
        dialog.accept();
      }
    });
    await this.deleteButton.click();
  }
}
