import { type Page } from "@playwright/test";
import fs from "fs";

export const formatDate = (date: Date, padZero: boolean = true): string[] => {
  const year = date.getFullYear().toString();
  const month = padZero
    ? ("0" + (date.getMonth() + 1)).slice(-2)
    : (date.getMonth() + 1).toString();
  const day = padZero
    ? ("0" + date.getDate()).slice(-2)
    : date.getDate().toString();
  return [year, month, day];
};

export const saveLocalStorage = async (page: Page): Promise<void> => {
  const localStorageData = await page.evaluate(() =>
    JSON.stringify(localStorage)
  );
  fs.writeFileSync("playwright/.auth/local.json", localStorageData, "utf-8");
};

export const loadLocalStorage = async (page: Page): Promise<void> => {
  const localStorageData = fs.readFileSync(
    "playwright/.auth/local.json",
    "utf-8"
  );
  await page.evaluate((data) => {
    const entries = JSON.parse(data);
    for (const [key, value] of Object.entries(entries)) {
      localStorage.setItem(key, value as string);
    }
  }, localStorageData);
};
