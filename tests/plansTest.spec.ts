import { test, expect } from "fixtures/plansTestFixture";
import { User } from "models/User";

test.describe("プラン一覧", () => {
  test("未ログイン状態でプラン一覧が表示されること", async ({
    topPage,
    plansPage,
  }) => {
    await topPage.goto();
    await topPage.goToPlansPage();

    await expect(plansPage.reserveButton).toHaveCount(7);
    await expect(plansPage.planTitle.nth(0)).toHaveText("お得な特典付きプラン");
    await expect(plansPage.planTitle.nth(1)).toHaveText("素泊まり");
    await expect(plansPage.planTitle.nth(2)).toHaveText("出張ビジネスプラン");
    await expect(plansPage.planTitle.nth(3)).toHaveText(
      "エステ・マッサージプラン"
    );
    await expect(plansPage.planTitle.nth(4)).toHaveText(
      "貸し切り露天風呂プラン"
    );
    await expect(plansPage.planTitle.nth(5)).toHaveText("カップル限定プラン");
    await expect(plansPage.planTitle.nth(6)).toHaveText(
      "テーマパーク優待プラン"
    );
  });

  test("一般会員でログイン状態でプラン一覧が表示されること", async ({
    topPage,
    loginPage,
    myPage,
    plansPage,
  }) => {
    const user = await User.fromYaml("resources/plans-test/松本さくら.yml");
    await topPage.goto();
    await topPage.goToLoginPage();
    await loginPage.doLogin(user.email, user.password);
    await myPage.goToPlansPage();

    await expect(plansPage.reserveButton).toHaveCount(9);
    await expect(plansPage.planTitle.nth(0)).toHaveText("お得な特典付きプラン");
    await expect(plansPage.planTitle.nth(1)).toHaveText("ディナー付きプラン");
    await expect(plansPage.planTitle.nth(2)).toHaveText("お得なプラン");
    await expect(plansPage.planTitle.nth(3)).toHaveText("素泊まり");
    await expect(plansPage.planTitle.nth(4)).toHaveText("出張ビジネスプラン");
    await expect(plansPage.planTitle.nth(5)).toHaveText(
      "エステ・マッサージプラン"
    );
    await expect(plansPage.planTitle.nth(6)).toHaveText(
      "貸し切り露天風呂プラン"
    );
    await expect(plansPage.planTitle.nth(7)).toHaveText("カップル限定プラン");
    await expect(plansPage.planTitle.nth(8)).toHaveText(
      "テーマパーク優待プラン"
    );
  });

  test("プレミアム会員でログイン状態でプラン一覧が表示されること", async ({
    topPage,
    loginPage,
    myPage,
    plansPage,
  }) => {
    const user = await User.fromYaml("resources/plans-test/山田一郎.yml");
    await topPage.goto();
    await topPage.goToLoginPage();
    await loginPage.doLogin(user.email, user.password);
    await myPage.goToPlansPage();

    await expect(plansPage.reserveButton).toHaveCount(10);
    await expect(plansPage.planTitle.nth(0)).toHaveText("お得な特典付きプラン");
    await expect(plansPage.planTitle.nth(1)).toHaveText("プレミアムプラン");
    await expect(plansPage.planTitle.nth(2)).toHaveText("ディナー付きプラン");
    await expect(plansPage.planTitle.nth(3)).toHaveText("お得なプラン");
    await expect(plansPage.planTitle.nth(4)).toHaveText("素泊まり");
    await expect(plansPage.planTitle.nth(5)).toHaveText("出張ビジネスプラン");
    await expect(plansPage.planTitle.nth(6)).toHaveText(
      "エステ・マッサージプラン"
    );
    await expect(plansPage.planTitle.nth(7)).toHaveText(
      "貸し切り露天風呂プラン"
    );
    await expect(plansPage.planTitle.nth(8)).toHaveText("カップル限定プラン");
    await expect(plansPage.planTitle.nth(9)).toHaveText(
      "テーマパーク優待プラン"
    );
  });
});
