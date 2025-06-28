import request from "supertest";
import app from "../../src/app";
import * as mockData from "../test-data/mock-data";

import * as JobModels from "../../src/models/job.models";
import * as profileModels from "../../src/models/profile.models";
jest.mock("../../src/model");

import * as TransactionHelper from "../../src/utils/transactionHelper";

describe("Deposit money for a client profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const fakeTransaction = {} as any;

  it("should throw bad request error, when non integer userId is provided", async () => {
    const response = await request(app).post(`/balances/deposit/abc`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    console.log(response.body.errors);
    expect(response.body.errors[0].path).toBe("userId");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a user Id."
    );
  });

  it("should throw bad request error, when negative user id is mentioned for depositing money.", async () => {
    const response = await request(app).post(`/balances/deposit/-1`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    console.log(response.body.errors);
    expect(response.body.errors[0].path).toBe("userId");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a user Id."
    );
  });

  it("should throw bad request error, when user id 0 is mentioned for depositing money.", async () => {
    const response = await request(app).post(`/balances/deposit/0`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    console.log(response.body.errors);
    expect(response.body.errors[0].path).toBe("userId");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a user Id."
    );
  });

  it("should throw bad request error, when invalid amount is provided for depositing money.", async () => {
    const response = await request(app)
      .post(`/balances/deposit/1`)
      .send({ amount: "abcd" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    console.log(response.body.errors);
    expect(response.body.errors[0].path).toBe("amount");
    expect(response.body.errors[0].msg).toBe(
      "Amount must be a positive number."
    );
  });

  it("should throw bad request error, when negative amount is provided for depositing money.", async () => {
    const response = await request(app)
      .post(`/balances/deposit/1`)
      .send({ amount: -1 });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    console.log(response.body.errors);
    expect(response.body.errors[0].path).toBe("amount");
    expect(response.body.errors[0].msg).toBe(
      "Amount must be a positive number."
    );
  });

  it("should throw bad request error, when amount is not provided for depositing money.", async () => {
    const response = await request(app).post(`/balances/deposit/1`);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    console.log(response.body.errors);
    expect(response.body.errors[0].path).toBe("amount");
    expect(response.body.errors[0].msg).toBe(
      "Amount must be a positive number."
    );
  });

  it("should return not found error, when non existing client user id is mentioned for depositing money.", async () => {
    jest
      .spyOn(profileModels, "getClientProfileById")
      .mockResolvedValueOnce(null);

    const response = await request(app)
      .post(`/balances/deposit/1`)
      .send({ amount: 100 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      "Error occurred while getting client profile from table. Ensure it exists."
    );
    expect(response.body.details).toBe(
      "The Client Profile with id 1 does not exists."
    );
  });

  it("should return internal server error, when error occurs while getting unpaid jobs for depositing money.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    jest
      .spyOn(profileModels, "getClientProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(JobModels, "findUnpaidJobsForAllContractsForProfile")
      .mockRejectedValueOnce("Read access error.");

    const response = await request(app)
      .post(`/balances/deposit/${mockData.mockClientProfile.id}`)
      .send({ amount: 100 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      `Error occurred while depositing money for client with id ${mockData.mockClientProfile.id}`
    );
    expect(response.body.details).toBe(
      "Error occurred while getting unpaid jobs for all contracts for profile with id 10. Read access error."
    );
  });

  it("should return unprocessable entity error, when provided deposit amount is greater than max limit allowed.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    jest
      .spyOn(profileModels, "getClientProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(JobModels, "findUnpaidJobsForAllContractsForProfile")
      .mockResolvedValueOnce(
        mockData.mockUnpaidJob.price + mockData.mockUnpaidJob.price
      );

    const response = await request(app)
      .post(`/balances/deposit/${mockData.mockClientProfile.id}`)
      .send({ amount: 100 });

    expect(response.status).toBe(422);
    expect(response.body.error).toBe(
      `Error occurred while depositing money for client with id ${mockData.mockClientProfile.id}`
    );
    expect(response.body.details).toBe(
      `You cannot deposit more than 25% of the total of jobs to pay at the time of deposit. Maximum amount you can deposit now is 25.`
    );
  });

  it("should return internal server error, when error occurrs while crediting balance.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    jest
      .spyOn(profileModels, "getClientProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(JobModels, "findUnpaidJobsForAllContractsForProfile")
      .mockResolvedValueOnce([
        mockData.mockUnpaidJob,
        mockData.mockUnpaidJob,
      ] as any);

    jest
      .spyOn(profileModels, "updateProfileById")
      .mockRejectedValueOnce("Write access error.");

    const response = await request(app)
      .post(`/balances/deposit/${mockData.mockClientProfile.id}`)
      .send({ amount: mockData.mockUnpaidJob.price });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      `Error occurred while depositing money for client with id ${mockData.mockClientProfile.id}`
    );
    expect(response.body.details).toBe(
      `Error occurred while crediting balance for profile ${mockData.mockClientProfile.id}. Write access error.`
    );
  });

  it("should return success response, when money is depositted successfully in client profile balance.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    jest
      .spyOn(profileModels, "getClientProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(JobModels, "findUnpaidJobsForAllContractsForProfile")
      .mockResolvedValueOnce([
        mockData.mockUnpaidJob,
        mockData.mockUnpaidJob,
      ] as any);

    jest
      .spyOn(profileModels, "updateProfileById")
      .mockResolvedValueOnce(undefined);

    const response = await request(app)
      .post(`/balances/deposit/${mockData.mockClientProfile.id}`)
      .send({ amount: mockData.mockUnpaidJob.price });

    expect(response.status).toBe(200);
  });
});
