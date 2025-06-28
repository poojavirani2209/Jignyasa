import * as WalletService from "../../src/services/wallet.service";
import * as mockData from "../test-data/mock-data";
import * as ProfileModels from "../../src/models/profile.models";
import * as TransactionHelper from "../../src/utils/transactionHelper";
import {
  NotFoundError,
  UnProcessabilityEntityError,
} from "../../src/errors/api-errors";
import { Profile as ProfileModel } from "../../src/model";

jest.mock("../../src/model");

describe("Credit Balance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fakeTransaction = {} as any;

  it("should call updateProfileById with the increased balance", async () => {
    const updateSpy = jest
      .spyOn(ProfileModels, "updateProfileById")
      .mockResolvedValue(undefined);

    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => {
        return fn(fakeTransaction);
      });

    await WalletService.creditBalance(mockData.mockClientProfile, 50);

    expect(updateSpy).toHaveBeenCalledWith(
      mockData.mockClientProfile.id,
      { balance: 25050 },
      fakeTransaction
    );
  });

  it("Should throw error, if error occurs while updating wallet details.", async () => {
    jest
      .spyOn(ProfileModels, "updateProfileById")
      .mockRejectedValue("DB Error");

    try {
      await WalletService.creditBalance(mockData.mockContractorProfile, 50);
    } catch (error) {
      expect(error.message).toBe(
        `Error occurred while crediting balance for profile ${mockData.mockContractorProfile.id}. DB Error`
      );
    }
  });
});

describe("Debit Balance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fakeTransaction = {} as any;

  it("should call updateProfileById with decreased balance", async () => {
    const updateSpy = jest
      .spyOn(ProfileModels, "updateProfileById")
      .mockResolvedValue(undefined);

    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    await WalletService.debitBalance(mockData.mockClientProfile, 200);

    expect(updateSpy).toHaveBeenCalledWith(
      mockData.mockClientProfile.id,
      { balance: 24800 },
      fakeTransaction
    );
  });

  it("should throw error, if balance is insufficient", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    try {
      await WalletService.debitBalance(
        mockData.mockClientProfile,
        mockData.mockClientProfile.balance + 2000
      );
    } catch (error) {
      expect(error).toBeInstanceOf(UnProcessabilityEntityError);
      expect(error.message).toBe(
        `The Profile with id ${mockData.mockClientProfile.id} does not have sufficient funds.`
      );
    }
  });

  it("Should throw error, if error occurs while updating wallet details.", async () => {
    jest
      .spyOn(ProfileModels, "updateProfileById")
      .mockRejectedValue("DB Error");

    try {
      await WalletService.debitBalance(mockData.mockContractorProfile, 50);
    } catch (error) {
      expect(error.message).toBe(
        `Error occurred while debitting balance for profile ${mockData.mockContractorProfile.id}. DB Error`
      );
    }
  });
});

describe("Transfer Balance Between Profiles", () => {
  const sender = mockData.mockClientProfile;
  const receiver = mockData.mockContractorProfile;
  const fakeTransaction = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //     const creditSpy = jest
  //       .spyOn(WalletService, "creditBalance")
  //       .mockResolvedValue();
  //     const debitSpy = jest
  //       .spyOn(WalletService, "debitBalance")
  //       .mockResolvedValue();

  //     jest
  //       .spyOn(TransactionHelper, "runWithTransaction")
  //       .mockImplementation(async (fn) => fn(fakeTransaction));

  //     await transferBalance(sender, receiver.id, 200);

  //     expect(creditSpy).toHaveBeenCalledWith(receiver, 200, transaction);
  //     expect(debitSpy).toHaveBeenCalledWith(sender, 200, transaction);
  //   });

  it("should throw error, if sender has insufficient funds", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    try {
      await WalletService.transferBalance(
        sender,
        receiver.id,
        sender.balance + 2000
      );
    } catch (error) {
      expect(error).toBeInstanceOf(UnProcessabilityEntityError);
      expect(error.message).toBe(
        `The Profile with id ${mockData.mockClientProfile.id} does not have sufficient funds.`
      );
    }
  });

  it("should throw not found error, if receiver profile is not found.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(null);

    try {
      await WalletService.transferBalance(
        sender,
        receiver.id,
        sender.balance - 2000
      );
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe(
        `The Profile with id ${receiver.id} does not exists.`
      );
    }
  });

  it("should throw error, if credit balance in receivers wallet fails.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(
      mockData.mockClientProfile
    );

    jest
      .spyOn(WalletService, "creditBalance")
      .mockRejectedValue("Credit Balance Error.");

    try {
      await WalletService.transferBalance(
        sender,
        receiver.id,
        sender.balance - 2000
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Error occurred while transferring balance from profile ${sender.id} to ${receiver.id}. Credit Balance Error.`
      );
    }
  });

  it("should throw error, if debit balance from senders wallet fails.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    (ProfileModel.findOne as jest.Mock).mockResolvedValueOnce(
      mockData.mockClientProfile
    );

    jest.spyOn(WalletService, "creditBalance").mockResolvedValue();
    jest
      .spyOn(WalletService, "debitBalance")
      .mockRejectedValueOnce("Debit Balance Error.");

    try {
      await WalletService.transferBalance(
        sender,
        receiver.id,
        sender.balance - 2000
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Error occurred while transferring balance from profile ${sender.id} to ${receiver.id}. Debit Balance Error.`
      );
    }
  });

  //     jest.spyOn(TransferLogic, "canProfileTransfer").mockReturnValue(true);
  //     jest.spyOn(ProfileModels, "getProfileById").mockResolvedValue(null);

  //     jest
  //       .spyOn(TransactionHelper, "runWithTransaction")
  //       .mockImplementation(async (fn) => fn(transaction));

  //     await expect(transferBalance(sender, receiver.id, 200)).rejects.toThrow(
  //       NotFoundError
  //     );
  //   });

  //   it("should throw a generic error if credit or debit fails", async () => {
  //     jest.spyOn(TransferLogic, "canProfileTransfer").mockReturnValue(true);
  //     jest.spyOn(ProfileModels, "getProfileById").mockResolvedValue(receiver);
  //     jest
  //       .spyOn(WalletService, "creditBalance")
  //       .mockRejectedValue(new Error("Credit failed"));
  //     jest.spyOn(WalletService, "debitBalance").mockResolvedValue();

  //     jest
  //       .spyOn(TransactionHelper, "runWithTransaction")
  //       .mockImplementation(async (fn) => fn(transaction));

  //     await expect(transferBalance(sender, receiver.id, 100)).rejects.toThrow(
  //       `Error occurred while transferring balance from profile ${sender.id} to ${receiver.id}.`
  //     );
  //   });
});
