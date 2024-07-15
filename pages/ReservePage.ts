import { type Locator, type FrameLocator, type Page } from "@playwright/test";
import { formatDate } from "utils/utils";

export type contactMethod =
  | "希望しない"
  | "メールでのご連絡"
  | "電話でのご連絡";

export class ReservePage {
  readonly page: Page;
  readonly h2: Locator;
  readonly planName: Locator;
  readonly date: Locator;
  readonly reserveDateMessage: Locator;
  readonly term: Locator;
  readonly reserveTermMessage: Locator;
  readonly headCount: Locator;
  readonly headCountMessage: Locator;
  readonly breakfast: Locator;
  readonly earlyCheckIn: Locator;
  readonly sightseeing: Locator;
  readonly username: Locator;
  readonly usernameMessage: Locator;
  readonly contact: Locator;
  readonly email: Locator;
  readonly emailMessage: Locator;
  readonly tel: Locator;
  readonly telMessage: Locator;
  readonly comment: Locator;
  readonly submitButton: Locator;
  readonly room: FrameLocator;
  readonly roomHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.h2 = page.locator("h2");
    this.planName = page.locator("#plan-name");
    this.date = page.locator("#date");
    this.reserveDateMessage = page.locator("#date ~ .invalid-feedback");
    this.term = page.locator("#term");
    this.reserveTermMessage = page.locator("#term ~ .invalid-feedback");
    this.headCount = page.locator("#head-count");
    this.headCountMessage = page.locator("#head-count ~ .invalid-feedback");
    this.breakfast = page.locator("#breakfast");
    this.earlyCheckIn = page.locator("#early-check-in");
    this.sightseeing = page.locator("#sightseeing");
    this.username = page.locator("#username");
    this.usernameMessage = page.locator("#username ~ .invalid-feedback");
    this.contact = page.locator("#contact");
    this.email = page.locator("#email");
    this.emailMessage = page.locator("#email ~ .invalid-feedback");
    this.tel = page.locator("#tel");
    this.telMessage = page.locator("#tel ~ .invalid-feedback");
    this.comment = page.locator("#comment");
    this.submitButton = page.locator("#submit-button");
    this.room = page.frameLocator(".embed-responsive-item");
    this.roomHeader = this.room.locator("h5");
  }

  async setReserveDate(date: Date | string | null) {
    if (date instanceof Date) {
      const ymd = formatDate(date);
      await this.date.fill(`${ymd[0]}/${ymd[1]}/${ymd[2]}`);
    } else if (typeof date === "string") {
      await this.date.fill(date);
    } else {
      await this.date.clear();
    }
  }

  async setReserveTerm(term: number | string | null) {
    if (typeof term === "number") {
      await this.term.fill(term.toString());
    } else if (typeof term === "string") {
      this.page.evaluate((term) => {
        const termElem = document.querySelector("#term") as HTMLInputElement;
        termElem.value = term;
      }, term);
    } else {
      await this.term.clear();
    }
  }

  async setHeadCount(headCount: number | string | null) {
    if (typeof headCount === "number") {
      await this.headCount.fill(headCount.toString());
    } else if (typeof headCount === "string") {
      this.page.evaluate((headCount) => {
        const headCountElem = document.querySelector(
          "#head-count"
        ) as HTMLInputElement;
        headCountElem.value = headCount;
      }, headCount);
    } else {
      await this.headCount.clear();
    }
  }

  async setBreakfastPlan(breakfast: boolean) {
    await this.breakfast.setChecked(breakfast);
  }

  async setEarlyCheckInPlan(earlyCheckIn: boolean) {
    await this.earlyCheckIn.setChecked(earlyCheckIn);
  }

  async setSightseeingPlan(sightseeing: boolean) {
    await this.sightseeing.setChecked(sightseeing);
  }

  async setUsername(username: string | null) {
    await this.username.fill(username ?? "");
  }

  async setContact(contactMethod: contactMethod) {
    await this.contact.selectOption({ label: contactMethod });
  }

  async setEmail(email: string | null) {
    await this.email.fill(email ?? "");
  }

  async setTel(tel: string | null) {
    await this.tel.fill(tel ?? "");
  }

  async setComment(comment: string) {
    await this.comment.fill(comment);
  }

  async moveFocus() {
    await this.h2.click();
  }

  async submit() {
    await this.submitButton.click();
  }
}
