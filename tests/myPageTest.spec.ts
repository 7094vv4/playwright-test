import { test, expect } from "fixtures/myPageTestFixture";
import { formatDate } from "utils/utils";
import { User } from "models/User";
import { saveLocalStorage, loadLocalStorage } from "utils/utils";

const expectedAddress = (address: User["address"]): string =>
  address ?? "未登録";
const expectedTel = (tel: User["tel"]): string => tel ?? "未登録";
const expectedGender = (gender: User["gender"]): string =>
  gender === "回答しない" ? "未登録" : gender;
const expectedBirthday = (birthday: User["birthday"]): string => {
  if (birthday !== null) {
    const ymd = formatDate(birthday, false);
    return `${ymd[0]}年${ymd[1]}月${ymd[2]}日`;
  } else {
    return "未登録";
  }
};
const expectedNotification = (notification: User["notification"]): string =>
  notification ? "受け取る" : "受け取らない";

test.describe("マイページ", () => {
  const parameters: Array<[string, string]> = [
    [
      "定義済みユーザの情報が表示されること_ichiro",
      "resources/my-page-test/山田一郎.yml",
    ],
    [
      "定義済みユーザの情報が表示されること_sakura",
      "resources/my-page-test/松本さくら.yml",
    ],
    [
      "定義済みユーザの情報が表示されること_jun",
      "resources/my-page-test/林潤.yml",
    ],
    [
      "定義済みユーザの情報が表示されること_yoshiki",
      "resources/my-page-test/木村良樹.yml",
    ],
  ];

  parameters.forEach((parameter) => {
    test(parameter[0], async ({ topPage, loginPage, myPage }) => {
      const user = await User.fromYaml(parameter[1]);
      await topPage.goto();
      await topPage.goToLoginPage();
      await loginPage.doLogin(user.email, user.password);

      await expect(myPage.email).toHaveText(user.email);
      await expect(myPage.username).toHaveText(user.username);
      await expect(myPage.rank).toHaveText(user.rank);
      await expect(myPage.address).toHaveText(expectedAddress(user.address));
      await expect(myPage.tel).toHaveText(expectedTel(user.tel));
      await expect(myPage.gender).toHaveText(expectedGender(user.gender));
      await expect(myPage.birthday).toHaveText(expectedBirthday(user.birthday));
      await expect(myPage.notification).toHaveText(
        expectedNotification(user.notification)
      );
    });
  });

  test("新規登録したユーザの情報が表示されること", async ({
    topPage,
    myPage,
    signupPage,
    page,
  }) => {
    const user = await User.fromYaml("resources/my-page-test/田中花子.yml");
    await topPage.goto();
    await topPage.goToSignupPage();

    await signupPage.setEmail(user.email);
    await signupPage.setPassword(user.password);
    await signupPage.setPasswordConfirmation(user.password);
    await signupPage.setUsername(user.username);
    await signupPage.setRank(user.rank);
    await signupPage.setAddress(user.address);
    await signupPage.setTel(user.tel);
    await signupPage.setGender(user.gender);
    await signupPage.setBirthday(user.birthday);
    await signupPage.setNotification(user.notification);
    await signupPage.submit();

    await expect(myPage.email).toHaveText(user.email);
    await expect(myPage.username).toHaveText(user.username);
    await expect(myPage.rank).toHaveText(user.rank);
    await expect(myPage.address).toHaveText(expectedAddress(user.address));
    await expect(myPage.tel).toHaveText(expectedTel(user.tel));
    await expect(myPage.gender).toHaveText(expectedGender(user.gender));
    await expect(myPage.birthday).toHaveText(expectedBirthday(user.birthday));
    await expect(myPage.notification).toHaveText(
      expectedNotification(user.notification)
    );
    saveLocalStorage(page);
  });

  test("アイコン設定で画像以外のファイルはエラーとなること", async ({
    topPage,
    loginPage,
    myPage,
    iconPage,
    page,
  }) => {
    const user = await User.fromYaml("resources/my-page-test/田中花子.yml");
    await topPage.goto();
    await topPage.goToLoginPage();
    await loadLocalStorage(page);
    await loginPage.doLogin(user.email, user.password);

    await myPage.goToIconPage();
    await iconPage.setIcon("resources/my-page-test/dummy.txt");

    await expect(iconPage.invalidFeedback).toHaveText(
      "画像ファイルを選択してください。"
    );
  });

  test("アイコン設定で10KBを越えるファイルはエラーとなること", async ({
    topPage,
    loginPage,
    myPage,
    iconPage,
    page,
  }) => {
    const user = await User.fromYaml("resources/my-page-test/田中花子.yml");
    await topPage.goto();
    await topPage.goToLoginPage();
    await loadLocalStorage(page);
    await loginPage.doLogin(user.email, user.password);

    await myPage.goToIconPage();
    await iconPage.setIcon("resources/my-page-test/11KB.png");

    await expect(iconPage.invalidFeedback).toHaveText(
      "ファイルサイズは10KB以下にしてください。"
    );
  });

  test("設定したアイコンがマイページに表示されること", async ({
    topPage,
    loginPage,
    myPage,
    iconPage,
    page,
  }) => {
    const user = await User.fromYaml("resources/my-page-test/田中花子.yml");
    await topPage.goto();
    await topPage.goToLoginPage();
    await loadLocalStorage(page);
    await loginPage.doLogin(user.email, user.password);

    await myPage.goToIconPage();
    await iconPage.setIcon("resources/my-page-test/9KB.png");
    await iconPage.setZoom(80);
    await iconPage.setColor("#000000");
    await iconPage.submit();

    await expect(myPage.icon).toBeVisible();
    await expect(myPage.icon).toHaveAttribute(
      "style",
      "width: 80px; height: 80px; background-color: rgb(0, 0, 0);"
    );
  });

  test("新規登録したユーザが削除できること", async ({
    topPage,
    loginPage,
    myPage,
    page,
  }) => {
    const user = await User.fromYaml("resources/my-page-test/田中花子.yml");
    await topPage.goto();
    await topPage.goToLoginPage();
    await loadLocalStorage(page);
    await loginPage.doLogin(user.email, user.password);

    await myPage.deleteUser();
    expect(page.url()).toContain("index.html");
  });
});
