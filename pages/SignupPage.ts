import { expect, type Locator, type Page } from "@playwright/test";
import { Rank, Gender } from "models/User";

export class SignupPage {
  readonly page: Page;
  readonly email: Locator;
  readonly emailMessage: Locator;
  readonly password: Locator;
  readonly passwordMessage: Locator;
  readonly passwordConfirmation: Locator;
  readonly passwordConfirmationMessage: Locator;
  readonly username: Locator;
  readonly usernameConfirmationMessage: Locator;
  readonly rankPremium: Locator;
  readonly rankNormal: Locator;
  readonly address: Locator;
  readonly addressMessage: Locator;
  readonly tel: Locator;
  readonly telMessage: Locator;
  readonly gender: Locator;
  readonly genderMessage: Locator;
  readonly birthday: Locator;
  readonly birthdayMessage: Locator;
  readonly notification: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.locator("#email");
    this.emailMessage = page.locator("#email ~ .invalid-feedback");
    this.password = page.locator("#password");
    this.passwordMessage = page.locator("#password ~ .invalid-feedback");
    this.passwordConfirmation = page.locator("#password-confirmation");
    this.passwordConfirmationMessage = page.locator(
      "#password-confirmation ~ .invalid-feedback"
    );
    this.username = page.locator("#username");
    this.usernameConfirmationMessage = page.locator(
      "#username ~ .invalid-feedback"
    );
    this.rankPremium = page.locator("#rank-premium");
    this.rankNormal = page.locator("#rank-normal");
    this.address = page.locator("#address");
    this.addressMessage = page.locator("#address ~ .invalid-feedback");
    this.tel = page.locator("#tel");
    this.telMessage = page.locator("#tel ~ .invalid-feedback");
    this.gender = page.locator("#gender");
    this.genderMessage = page.locator("#gender ~ .invalid-feedback");
    this.birthday = page.locator("#birthday");
    this.birthdayMessage = page.locator("#birthday ~ .invalid-feedback");
    this.notification = page.locator("#notification");
    this.submitButton = page.getByRole("button", { name: "登録" });
  }

  async setEmail(email: string) {
    await this.email.fill(email);
  }

  async setPassword(password: string) {
    await this.password.fill(password);
  }

  async setPasswordConfirmation(password: string) {
    await this.passwordConfirmation.fill(password);
  }

  async setUsername(username: string) {
    await this.username.fill(username);
  }

  async setRank(rank: Rank) {
    if (rank === "プレミアム会員") {
      await this.rankPremium.check();
    } else if (rank === "一般会員") {
      await this.rankNormal.check();
    }
  }

  async setAddress(address: string) {
    await this.address.fill(address);
  }

  async setTel(tel: string) {
    await this.tel.fill(tel);
  }

  async setGender(gender: Gender) {
    await this.gender.selectOption({ label: gender });
  }

  async setBirthday(birthday: Date | null) {
    if (birthday !== null) {
      const ymd = this.formatDateToYYYYMMDD(birthday);
      await this.birthday.fill(`${ymd[0]}-${ymd[1]}-${ymd[2]}`);
    }
  }

  formatDateToYYYYMMDD(date: Date): string[] {
    const year = date.getFullYear().toString();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return [year, month, day];
  }

  async setNotification(notification: boolean) {
    await this.notification.setChecked(notification);
  }

  async submit() {
    await this.submitButton.click();
  }
}
