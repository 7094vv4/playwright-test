import { test, expect } from "fixtures/reserveTestFixture";
import { contactMethod, ReservePage } from "pages/ReservePage";
import { ConfirmPage } from "pages/ConfirmPage";
import { User } from "models/User";
import { formatDate } from "utils/utils";

test.describe("宿泊予約", () => {
  const date = new Date();
  const datePlus1 = new Date(date);
  datePlus1.setDate(date.getDate() + 1);

  const MESSAGE_EMPTY = "このフィールドを入力してください。";

  test("画面表示時の初期値が設定されていること_未ログイン", async ({
    page,
    topPage,
    plansPage,
  }) => {
    await topPage.goto();
    await topPage.goToPlansPage();

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      plansPage.openPlanByTitle("お得な特典付きプラン"),
    ]);
    await newPage.waitForLoadState();
    const reservePage = new ReservePage(newPage);

    await expect(reservePage.planName).toHaveText("お得な特典付きプラン");
    const formattedDate = formatDate(datePlus1);
    await expect(reservePage.date).toHaveValue(
      `${formattedDate[0]}/${formattedDate[1]}/${formattedDate[2]}`
    );
    await expect(reservePage.term).toHaveValue("1");
    await expect(reservePage.headCount).toHaveValue("1");
    await expect(reservePage.email).toBeHidden();
    await expect(reservePage.tel).toBeHidden();

    await reservePage.setContact("メールでのご連絡");
    await expect(reservePage.email).toBeVisible();
    await expect(reservePage.tel).toBeHidden();
    await expect(reservePage.email).toBeEmpty();

    await reservePage.setContact("電話でのご連絡");
    await expect(reservePage.email).toBeHidden();
    await expect(reservePage.tel).toBeVisible();
    await expect(reservePage.tel).toBeEmpty();

    await expect(reservePage.roomHeader).toHaveText("スタンダードツイン");
  });

  test("画面表示時の初期値が設定されていること_ログイン済み", async ({
    page,
    topPage,
    loginPage,
    myPage,
    plansPage,
  }) => {
    const user = await User.fromYaml("resources/reserve-test/山田一郎.yml");
    await topPage.goto();
    await topPage.goToLoginPage();
    await loginPage.doLogin(user.email, user.password);
    await myPage.goToPlansPage();

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      plansPage.openPlanByTitle("プレミアムプラン"),
    ]);
    await newPage.waitForLoadState();
    const reservePage = new ReservePage(newPage);

    await expect(reservePage.planName).toHaveText("プレミアムプラン");
    const formattedDate = formatDate(datePlus1);
    await expect(reservePage.date).toHaveValue(
      `${formattedDate[0]}/${formattedDate[1]}/${formattedDate[2]}`
    );
    await expect(reservePage.term).toHaveValue("1");
    await expect(reservePage.headCount).toHaveValue("2");
    await expect(reservePage.email).toBeHidden();
    await expect(reservePage.tel).toBeHidden();

    await reservePage.setContact("メールでのご連絡");
    await expect(reservePage.email).toBeVisible();
    await expect(reservePage.tel).toBeHidden();
    await expect(reservePage.email).toHaveValue(user.email);

    await reservePage.setContact("電話でのご連絡");
    await expect(reservePage.email).toBeHidden();
    await expect(reservePage.tel).toBeVisible();
    await expect(reservePage.tel).toHaveValue(user.tel as string);

    await expect(reservePage.roomHeader).toHaveText("プレミアムツイン");
  });

  const datePlus91 = new Date(date);
  datePlus91.setDate(date.getDate() + 91);
  const parameters1: Array<
    [
      string,
      Date | string | null,
      number | string | null,
      number | string | null,
      string | null,
      string,
      string,
      string
    ]
  > = [
    [
      "入力値が空白でエラーとなること",
      null,
      null,
      null,
      null,
      MESSAGE_EMPTY,
      MESSAGE_EMPTY,
      MESSAGE_EMPTY,
    ],
    [
      "不正な入力値でエラーとなること_小",
      date,
      0,
      0,
      "テスト太郎",
      "翌日以降の日付を入力してください。",
      "1以上の値を入力してください。",
      "1以上の値を入力してください。",
    ],
    [
      "不正な入力値でエラーとなること_大",
      datePlus91,
      10,
      10,
      "テスト太郎",
      "3ヶ月以内の日付を入力してください。",
      "9以下の値を入力してください。",
      "9以下の値を入力してください。",
    ],
    [
      "不正な入力値でエラーとなること_文字列",
      "12/3//345",
      "a", // 入力は弾かれ、inputのvalueはundefinedとなる
      "a", // 入力は弾かれ、inputのvalueはundefinedとなる
      "テスト太郎",
      "有効な値を入力してください。",
      MESSAGE_EMPTY,
      MESSAGE_EMPTY,
    ],
  ];

  parameters1.forEach((parameter) => {
    test(parameter[0], async ({ page, topPage, plansPage }) => {
      await topPage.goto();
      await topPage.goToPlansPage();

      const [newPage] = await Promise.all([
        page.waitForEvent("popup"),
        plansPage.openPlanByTitle("お得な特典付きプラン"),
      ]);
      await newPage.waitForLoadState();
      const reservePage = new ReservePage(newPage);

      await reservePage.setReserveDate(parameter[1]);
      await reservePage.setReserveTerm(parameter[2]);
      await reservePage.setHeadCount(parameter[3]);
      await reservePage.setUsername(parameter[4]);
      await reservePage.moveFocus(); // フォーカスを外し、カレンダーを非表示にする

      await expect(reservePage.reserveDateMessage).toHaveText(parameter[5]);
      await expect(reservePage.reserveTermMessage).toHaveText(parameter[6]);
      await expect(reservePage.headCountMessage).toHaveText(parameter[7]);
    });
  });

  const parameters2: Array<[string, contactMethod]> = [
    ["不正な入力値でエラーとなること_確定時_メール選択", "メールでのご連絡"],
    ["不正な入力値でエラーとなること_確定時_電話選択", "電話でのご連絡"],
  ];

  parameters2.forEach((parameter) => {
    test(parameter[0], async ({ page, topPage, plansPage }) => {
      await topPage.goto();
      await topPage.goToPlansPage();

      const [newPage] = await Promise.all([
        page.waitForEvent("popup"),
        plansPage.openPlanByTitle("お得な特典付きプラン"),
      ]);
      await newPage.waitForLoadState();
      const reservePage = new ReservePage(newPage);

      await reservePage.setUsername(null);
      await reservePage.setContact(parameter[1]);
      switch (parameter[1]) {
        case "メールでのご連絡":
          await reservePage.setEmail(null);
          break;
        case "電話でのご連絡":
          await reservePage.setTel(null);
        default:
          break;
      }
      await reservePage.submit();

      await expect(reservePage.usernameMessage).toHaveText(MESSAGE_EMPTY);
      switch (parameter[1]) {
        case "メールでのご連絡":
          await expect(reservePage.emailMessage).toHaveText(MESSAGE_EMPTY);
          break;
        case "電話でのご連絡":
          await expect(reservePage.telMessage).toHaveText(MESSAGE_EMPTY);
          break;
        default:
          break;
      }
    });
  });

  test("宿泊予約が完了すること_未ログイン_初期値", async ({
    page,
    topPage,
    plansPage,
  }) => {
    const datePlus2 = new Date(date);
    datePlus2.setDate(date.getDate() + 2);

    await topPage.goto();
    await topPage.goToPlansPage();

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      plansPage.openPlanByTitle("お得な特典付きプラン"),
    ]);
    await newPage.waitForLoadState();
    const reservePage = new ReservePage(newPage);

    let expectedTotalBill: string;
    if (
      datePlus1.getDay() === 0 /* 日曜 */ ||
      datePlus1.getDay() === 6 /* 土曜 */
    ) {
      expectedTotalBill = "合計 8,750円（税込み）";
    } else {
      expectedTotalBill = "合計 7,000円（税込み）";
    }
    const start = formatDate(datePlus1, false);
    const end = formatDate(datePlus2, false);
    const expextedTerm = `${start[0]}年${start[1]}月${start[2]}日 〜 ${end[0]}年${end[1]}月${end[2]}日 1泊`;

    await reservePage.setUsername("テスト太郎");
    await reservePage.setContact("希望しない");
    await reservePage.submit();
    const confirmPage = new ConfirmPage(newPage);

    await expect(confirmPage.totalBill).toHaveText(expectedTotalBill);
    await expect(confirmPage.planName).toHaveText("お得な特典付きプラン");
    await expect(confirmPage.term).toHaveText(expextedTerm);
    await expect(confirmPage.headCount).toHaveText("1名様");
    await expect(confirmPage.plans).toHaveText("なし");
    await expect(confirmPage.username).toHaveText("テスト太郎様");
    await expect(confirmPage.contact).toHaveText("希望しない");
    await expect(confirmPage.comment).toHaveText("なし");

    await confirmPage.confirm();
    await expect(confirmPage.modalMessage).toHaveText(
      "ご来館、心よりお待ちしております。"
    );
    await confirmPage.close();
    await confirmPage.page.waitForEvent("close");
    expect(confirmPage.page.isClosed()).toEqual(true);
  });

  test("宿泊予約が完了すること_ログイン", async ({
    page,
    topPage,
    loginPage,
    myPage,
    plansPage,
  }) => {
    const datePlus90 = new Date(date);
    datePlus90.setDate(date.getDate() + 90);
    const datePlus92 = new Date(date);
    datePlus92.setDate(date.getDate() + 92);

    const user = await User.fromYaml("resources/reserve-test/山田一郎.yml");
    await topPage.goto();
    await topPage.goToLoginPage();
    await loginPage.doLogin(user.email, user.password);
    await myPage.goToPlansPage();

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      plansPage.openPlanByTitle("プレミアムプラン"),
    ]);
    await newPage.waitForLoadState();
    const reservePage = new ReservePage(newPage);

    let expectedTotalBill: string;
    if (datePlus90.getDay() === 6 /* 土曜 */) {
      expectedTotalBill = "合計 112,000円（税込み）";
    } else if (
      datePlus90.getDay() === 0 /* 日曜 */ ||
      datePlus90.getDay() === 5 /* 金曜 */
    ) {
      expectedTotalBill = "合計 102,000円（税込み）";
    } else {
      expectedTotalBill = "合計 92,000円（税込み）";
    }
    const start = formatDate(datePlus90, false);
    const end = formatDate(datePlus92, false);
    const expextedTerm = `${start[0]}年${start[1]}月${start[2]}日 〜 ${end[0]}年${end[1]}月${end[2]}日 2泊`;

    await reservePage.setReserveDate(datePlus90);
    await reservePage.moveFocus(); // フォーカスを外し、カレンダーを非表示にする
    await reservePage.setReserveTerm(2);
    await reservePage.setHeadCount(4);
    await reservePage.setBreakfastPlan(true);
    await reservePage.setEarlyCheckInPlan(true);
    await reservePage.setSightseeingPlan(false);
    await reservePage.setContact("メールでのご連絡");
    await reservePage.setComment("あああ\n\nいいいいいいい\nうう");
    await reservePage.submit();
    const confirmPage = new ConfirmPage(newPage);

    await expect(confirmPage.totalBill).toHaveText(expectedTotalBill);
    await expect(confirmPage.planName).toHaveText("プレミアムプラン");
    await expect(confirmPage.term).toHaveText(expextedTerm);
    await expect(confirmPage.headCount).toHaveText("4名様");
    await confirmPage.assertPlansItems([
      "朝食バイキング",
      "昼からチェックインプラン",
    ]);
    await expect(confirmPage.username).toHaveText("山田一郎様");
    await expect(confirmPage.contact).toHaveText("メール：ichiro@example.com");
    await expect(confirmPage.comment).toHaveText(
      "あああ\n\nいいいいいいい\nうう"
    );

    await confirmPage.confirm();
    await expect(confirmPage.modalMessage).toHaveText(
      "ご来館、心よりお待ちしております。"
    );
    await confirmPage.close();
    await confirmPage.page.waitForEvent("close");
    expect(confirmPage.page.isClosed()).toEqual(true);
  });
});
