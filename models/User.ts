import { promises as fs } from "fs";
import yaml from "js-yaml";

type Rank = "一般会員" | "プレミアム会員";

type Gender = "回答しない" | "男性" | "女性" | "その他";

type UserProps = {
  email: string;
  password: string;
  username: string;
  rank: Rank;
  address: string | null;
  tel: string | null;
  gender: Gender;
  birthday: Date | null;
  notification: boolean;
};

export class User {
  constructor(
    private _email: string,
    private _password: string,
    private _username: string,
    private _rank: Rank,
    private _address: string | null,
    private _tel: string | null,
    private _gender: Gender,
    private _birthday: Date | null,
    private _notification: boolean
  ) {}

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get username(): string {
    return this._username;
  }

  get rank(): Rank {
    return this._rank;
  }

  get address(): string | null {
    return this._address;
  }

  get tel(): string | null {
    return this._tel;
  }

  get gender(): Gender {
    return this._gender;
  }

  get birthday(): Date | null {
    return this._birthday;
  }

  get notification(): boolean {
    return this._notification;
  }

  static async fromYaml(path: string): Promise<User> {
    try {
      const file = await fs.readFile(path, "utf-8");
      const data = yaml.load(file) as UserProps;
      return new User(
        data.email,
        data.password,
        data.username,
        data.rank,
        data.address,
        data.tel,
        data.gender,
        data.birthday,
        data.notification
      );
    } catch (e) {
      throw e;
    }
  }
}
