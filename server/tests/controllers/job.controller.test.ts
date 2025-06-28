import request from "supertest";
import app from "../../src/app";
import * as mockData from "../test-data/mock-data";

import * as JobModels from "../../src/models/job.models";
import * as profileModels from "../../src/models/profile.models";
import * as ContractModels from "../../src/models/contracts.models";

import * as TransactionHelper from "../../src/utils/transactionHelper";
import * as WalletService from "../../src/services/wallet.service";

describe("Get All Unpaid Jobs For Active Contract For Profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw bad request error, when no profile is mentioned for accessing the unpaid jobs.", async () => {
    const response = await request(app).get(`/jobs/unpaid`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    console.log(response.body.errors);
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should throw bad request error, when negative profile id  is mentioned for accessing the unpaid jobs.", async () => {
    const response = await request(app)
      .get(`/jobs/unpaid`)
      .set("profile_id", "-1");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should throw bad request error, when profile id 0 is mentioned for accessing the unpaid jobs.", async () => {
    const response = await request(app)
      .get(`/jobs/unpaid`)
      .set("profile_id", "0");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should return bad request error, when invalid profile id is mentioned for accessing the unpaid jobs.", async () => {
    const response = await request(app)
      .get(`/jobs/unpaid`)
      .set("profile_id", "abc");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should return not found error, when non existing profile id is mentioned for accessing the unpaid jobs.", async () => {
    jest.spyOn(profileModels, "getProfileById").mockResolvedValueOnce(null);

    const response = await request(app)
      .get(`/jobs/unpaid`)
      .set("profile_id", "50");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      "Error occurred while getting profile from table. Ensure it exists."
    );
    expect(response.body.details).toBe(
      "The Profile with id 50 does not exists."
    );
  });

  it("should return empty response, when profile does not have any active contracts/any contracts/unpaid or no jobs for active contracts", async () => {
    jest
      .spyOn(profileModels, "getProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(JobModels, "findUnpaidJobsForActiveContractsForProfile")
      .mockResolvedValueOnce([]);

    const response = await request(app)
      .get(`/jobs/unpaid`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.status).toBe(200);
    expect(response.body.jobs).toStrictEqual([]);
  });

  it("should return internal server error, when error occurrs while reading details from database.", async () => {
    jest
      .spyOn(profileModels, "getProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(JobModels, "findUnpaidJobsForActiveContractsForProfile")
      .mockRejectedValueOnce("Read access not there.");

    const response = await request(app)
      .get(`/jobs/unpaid`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      `Error occurred while fetching active contracts unpaid jobs for profile by id ${mockData.mockClientProfile.id}`
    );
    expect(response.body.details).toBe(
      `Error occurred while getting unpaid jobs for active contracts for profile with id ${mockData.mockClientProfile.id}. Read access not there.`
    );
  });
});

describe("Profile to Pay for a Job", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const fakeTransaction = {} as any;

  it("should throw bad request error, when non integer job Id provided as input.", async () => {
    const response = await request(app).post(`/jobs/abc/pay`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("job_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure that job Id is a positive integer."
    );
  });

  it("should throw bad request error, when job Id 0 provided as input.", async () => {
    const response = await request(app).post(`/jobs/0/pay`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("job_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure that job Id is a positive integer."
    );
  });

  it("should throw bad request error, when job Id less than 0 is provided as input.", async () => {
    const response = await request(app).post(`/jobs/-1/pay`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("job_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure that job Id is a positive integer."
    );
  });

  it("should throw bad request error, when no profile is mentioned for paying for a job.", async () => {
    const response = await request(app).post(`/jobs/1/pay`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    console.log(response.body.errors);
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should throw bad request error, when negative profile id  is mentioned for paying for a job.", async () => {
    const response = await request(app)
      .post(`/jobs/1/pay`)
      .set("profile_id", "-1");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should throw bad request error, when profile id 0 is mentioned for paying for a job.", async () => {
    const response = await request(app)
      .post(`/jobs/1/pay`)
      .set("profile_id", "0");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should return bad request error, when invalid profile id is mentioned for paying for a job.", async () => {
    const response = await request(app)
      .post(`/jobs/1/pay`)
      .set("profile_id", "abc");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should return not found error, when non existing profile id is mentioned for paying for a job.", async () => {
    jest.spyOn(profileModels, "getClientProfileById").mockResolvedValueOnce(null);

    const response = await request(app)
      .post(`/jobs/1/pay`)
      .set("profile_id", "50");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      "Error occurred while getting client profile from table. Ensure it exists."
    );
    expect(response.body.details).toBe(
      "The Client Profile with id 50 does not exists."
    );
  });

  it("should throw not found error, when no job is found with given job id", async () => {
    let nonExistingJobId = 100;
    jest.spyOn(JobModels, "getJobByIdForClientProfiile").mockResolvedValueOnce(null);

    jest
      .spyOn(profileModels, "getClientProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    const response = await request(app)
      .post(`/jobs/${nonExistingJobId}/pay`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      `Error occurred while profile with id ${mockData.mockClientProfile.id} paying for job with id ${nonExistingJobId}`
    );
    expect(response.body.details).toBe(
      `The Job with id ${nonExistingJobId} does not exists or the client profile does not have access to the contract mapped to this job.`
    );
  });

  it("should throw conflict error, when profile is trying to pay for an already paid job.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    jest
      .spyOn(JobModels, "getJobByIdForClientProfiile")
      .mockResolvedValueOnce(mockData.mockPaidJob);

    jest
      .spyOn(profileModels, "getClientProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    const response = await request(app)
      .post(`/jobs/${mockData.mockPaidJob.id}/pay`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.body.error).toBe(
      `Error occurred while profile with id ${mockData.mockClientProfile.id} paying for job with id ${mockData.mockPaidJob.id}`
    );
    expect(response.body.details).toBe(`The Job has already been paid for.`);
  });

  it("should throw unprocessable entity error, when job is not mapped to a contract.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    let nonExistingJobId = 100;
    const { ContractId, ...jobWithoutContractId } = mockData.mockUnpaidJob;

    jest
      .spyOn(JobModels, "getJobByIdForClientProfiile")
      .mockResolvedValueOnce(jobWithoutContractId as any);

    jest
      .spyOn(profileModels, "getClientProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    const response = await request(app)
      .post(`/jobs/${nonExistingJobId}/pay`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.status).toBe(422);
    expect(response.body.error).toBe(
      `Error occurred while profile with id ${mockData.mockClientProfile.id} paying for job with id ${nonExistingJobId}`
    );
    expect(response.body.details).toBe(
      `The Job is not mapped to a valid Contract.`
    );
  });

  it("should throw error, when transfer cannot be completed.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    jest
      .spyOn(JobModels, "getJobByIdForClientProfiile")
      .mockResolvedValueOnce(mockData.mockUnpaidJob);

    jest
      .spyOn(profileModels, "getClientProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(ContractModels, "getContractById")
      .mockResolvedValueOnce(mockData.mockInProgressContract);

    jest
      .spyOn(WalletService, "transferBalance")
      .mockRejectedValue("Transfer Balance Failed");

    const response = await request(app)
      .post(`/jobs/${mockData.mockUnpaidJob.id}/pay`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.body.error).toBe(
      `Error occurred while profile with id ${mockData.mockClientProfile.id} paying for job with id ${mockData.mockUnpaidJob.id}`
    );
    expect(response.body.details).toBe(
      `Error occurred while paying for job. Transfer Balance Failed`
    );
  });

  it("should throw unprocessable entity error, when job is mapped to unactive contract.", async () => {
    jest
      .spyOn(TransactionHelper, "runWithTransaction")
      .mockImplementation(async (fn) => fn(fakeTransaction));

    jest
      .spyOn(JobModels, "getJobByIdForClientProfiile")
      .mockResolvedValueOnce(mockData.mockUnpaidJob);

    jest
      .spyOn(profileModels, "getClientProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(ContractModels, "getContractById")
      .mockResolvedValueOnce(mockData.mockTerimatedContract);

    const response = await request(app)
      .post(`/jobs/${mockData.mockUnpaidJob.id}/pay`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.body.error).toBe(
      `Error occurred while profile with id ${mockData.mockClientProfile.id} paying for job with id ${mockData.mockUnpaidJob.id}`
    );
    expect(response.body.details).toBe(
      "The contract to which Job is not active."
    );
  });
});
