import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Mail", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "032266",
      email: "velbika@pelome.be",
      name: "Ada Holt",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("velbika@pelome.be");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not able to send an email if user does not exists", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("urieho@zu.hm")
    ).rejects.toEqual(new AppError("User does not exists!"));
  });

  it("should de able to create an users token", async () => {
    const generateTokenMail = jest.spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    await usersRepositoryInMemory.create({
      driver_license: "893207",
      email: "dujda@je.nl",
      name: "Gertrude Jimenez",
      password: "1234",
    });

    await sendForgotPasswordMailUseCase.execute("dujda@je.nl");

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
