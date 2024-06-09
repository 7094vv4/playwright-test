import { test, expect } from "fixtures/loginTextFixture";
import { User } from "models/User";

test.describe("ログイン", () => {
  test("定義済みユーザでログインができること", async ({
    topPage,
    loginPage,
    page,
  }) => {
    const user = await User.fromYaml("resources/login-test/山田一郎.yml");
    await topPage.goto();
    await topPage.goToLoginPage();
    await loginPage.doLogin(user.email, user.password);

    await expect(page.locator("h2")).toHaveText("マイページ");
  });

  test("未入力でエラーとなること", async ({ topPage, loginPage }) => {
    await topPage.goto();
    await topPage.goToLoginPage();
    await loginPage.doLogin("", "");

    await expect(loginPage.emailMessage).toHaveText(
      "このフィールドを入力してください。"
    );
    await expect(loginPage.passwordMessage).toHaveText(
      "このフィールドを入力してください。"
    );
  });

  test("未登録のユーザでエラーとなること", async ({ topPage, loginPage }) => {
    await topPage.goto();
    await topPage.goToLoginPage();
    await loginPage.doLogin("error@example.com", "error");

    await expect(loginPage.emailMessage).toHaveText(
      "メールアドレスまたはパスワードが違います。"
    );
    await expect(loginPage.passwordMessage).toHaveText(
      "メールアドレスまたはパスワードが違います。"
    );
  });
});
