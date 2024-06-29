import { test, expect } from "fixtures/signupTestFixture";
import { User } from "models/User";

test.describe("会員登録", () => {
  test("ユーザの新規登録ができること", async ({
    topPage,
    signupPage,
    page,
  }) => {
    const user = await User.fromYaml("resources/signup-test/新規ユーザ１.yml");
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

    await expect(page.locator("h2")).toHaveText("マイページ");
  });

  test("必須項目を未入力にするとエラーとなること", async ({
    topPage,
    signupPage,
  }) => {
    await topPage.goto();
    await topPage.goToSignupPage();

    await signupPage.setEmail("");
    await signupPage.setPassword("");
    await signupPage.setPasswordConfirmation("");
    await signupPage.setRank("プレミアム会員");
    await signupPage.setAddress("");
    await signupPage.setTel("");
    await signupPage.setGender("回答しない");
    await signupPage.setBirthday(null);
    await signupPage.setNotification(false);
    await signupPage.submit();

    const message = "このフィールドを入力してください。";

    await expect(signupPage.emailMessage).toHaveText(message);
    await expect(signupPage.passwordMessage).toHaveText(message);
    await expect(signupPage.passwordConfirmationMessage).toHaveText(message);
    await expect(signupPage.usernameConfirmationMessage).toHaveText(message);
    await expect(signupPage.addressMessage).toBeEmpty();
    await expect(signupPage.telMessage).toBeEmpty();
    await expect(signupPage.genderMessage).toBeEmpty();
    await expect(signupPage.birthdayMessage).toBeEmpty();
  });

  test("指定のフォーマット外の入力でエラーとなること", async ({
    topPage,
    signupPage,
  }) => {
    await topPage.goto();
    await topPage.goToSignupPage();

    await signupPage.setEmail("a");
    await signupPage.setPassword("1234567");
    await signupPage.setPasswordConfirmation("1");
    await signupPage.setUsername("テストテスト");
    await signupPage.setRank("一般会員");
    await signupPage.setAddress("千葉県千葉市");
    await signupPage.setTel("1234567890");
    await signupPage.setGender("その他");
    await signupPage.setBirthday(new Date("2000-01-01"));
    await signupPage.setNotification(true);
    await signupPage.submit();

    await expect(signupPage.emailMessage).toHaveText(
      "メールアドレスを入力してください。"
    );
    await expect(signupPage.passwordMessage).toHaveText(
      "8文字以上で入力してください。"
    );
    await expect(signupPage.passwordConfirmationMessage).toHaveText(
      "8文字以上で入力してください。"
    );
    await expect(signupPage.usernameConfirmationMessage).toBeEmpty();
    await expect(signupPage.addressMessage).toBeEmpty();
    await expect(signupPage.telMessage).toHaveText(
      "指定されている形式で入力してください。"
    );
    await expect(signupPage.genderMessage).toBeEmpty();
    await expect(signupPage.birthdayMessage).toBeEmpty();
  });

  test("登録済みのメールアドレスはエラーとなること", async ({
    topPage,
    signupPage,
  }) => {
    const user = await User.fromYaml("resources/signup-test/山田一郎.yml");
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

    await expect(signupPage.emailMessage).toHaveText(
      "このメールアドレスはすでに登録済みです。"
    );
  });

  test("入力パスワードが一致しないとエラーとなること", async ({
    topPage,
    signupPage,
  }) => {
    const user = await User.fromYaml("resources/signup-test/新規ユーザ１.yml");
    await topPage.goto();
    await topPage.goToSignupPage();

    await signupPage.setEmail(user.email);
    await signupPage.setPassword(user.password);
    await signupPage.setPasswordConfirmation("123456789");
    await signupPage.setUsername(user.username);
    await signupPage.setRank(user.rank);
    await signupPage.setAddress(user.address);
    await signupPage.setTel(user.tel);
    await signupPage.setGender(user.gender);
    await signupPage.setBirthday(user.birthday);
    await signupPage.setNotification(user.notification);
    await signupPage.submit();

    await expect(signupPage.passwordConfirmationMessage).toHaveText(
      "入力されたパスワードと一致しません。"
    );
  });
});
