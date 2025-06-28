import request from "supertest";
import app from "../../src/app";
import * as contractModels from "../../src/models/contracts.models";
import * as profileModels from "../../src/models/profile.models";

import * as mockData from "../test-data/mock-data";

describe("Get Contract by id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw bad request error, when non integer contract Id provided as input.", async () => {
    const response = await request(app).get(`/contracts/abc`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure that contract Id is a positive integer."
    );
  });

  it("should throw bad request error, when contract Id 0 provided as input.", async () => {
    const response = await request(app).get(`/contracts/0`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure that contract Id is a positive integer."
    );
  });

  it("should throw bad request error, when contract Id less than 0 is provided as input.", async () => {
    const response = await request(app).get(`/contracts/-1`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure that contract Id is a positive integer."
    );
  });

  it("should throw bad request error, when no profile is mentioned for accessing the contract.", async () => {
    const response = await request(app).get(`/contracts/1`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should throw bad request error, when negative profile id  is mentioned for accessing the contract.", async () => {
    const response = await request(app)
      .get(`/contracts/1`)
      .set("profile_id", "-1");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should throw bad request error, when profile id 0 is mentioned for accessing the contract.", async () => {
    const response = await request(app)
      .get(`/contracts/1`)
      .set("profile_id", "0");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should return bad request error, when invalid profile id is mentioned for accessing the contract.", async () => {
    const response = await request(app)
      .get(`/contracts/1`)
      .set("profile_id", "abc");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should return not found error, when non existing profile id is mentioned for accessing the contract.", async () => {
    jest.spyOn(profileModels, "getProfileById").mockResolvedValueOnce(null);

    const response = await request(app)
      .get(`/contracts/1`)
      .set("profile_id", "50");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      "Error occurred while getting profile from table. Ensure it exists."
    );
    expect(response.body.details).toBe(
      "The Profile with id 50 does not exists."
    );
  });

  it("should return not found error, when non existing contract is being accessed.", async () => {
    const nonExistingContractId = 1;

    jest
      .spyOn(profileModels, "getProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest.spyOn(contractModels, "getContractById").mockResolvedValueOnce(null);

    const response = await request(app)
      .get(`/contracts/${nonExistingContractId}`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      `Error occurred while fetching contract by id ${nonExistingContractId}.`
    );
    expect(response.body.details).toBe(
      `The Contract with id ${nonExistingContractId} does not exists.`
    );
  });

  it("should return forbidden error, when profile does not have access to contract.", async () => {
    jest
      .spyOn(profileModels, "getProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(contractModels, "getContractById")
      .mockResolvedValueOnce(mockData.mockInProgressContract);

    const response = await request(app)
      .get(`/contracts/${mockData.mockInProgressContract.id}`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.status).toBe(403);
    expect(response.body.error).toBe(
      `Error occurred while fetching contract by id ${mockData.mockInProgressContract.id}.`
    );
    expect(response.body.details).toBe(
      `This profile ${mockData.mockClientProfile.id} does not have access to the contract. Please connect with admin.`
    );
  });

  it("should return internal server error, when error occurrs while reading details from database.", async () => {
    jest
      .spyOn(profileModels, "getProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(contractModels, "getContractById")
      .mockRejectedValueOnce("Read access not there.");

    const response = await request(app)
      .get(`/contracts/${mockData.mockInProgressContract.id}`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      `Error occurred while fetching contract by id ${mockData.mockInProgressContract.id}.`
    );
    expect(response.body.details).toBe(
      `Error occurred while getting contract with id ${mockData.mockInProgressContract.id}. Read access not there.`
    );
  });
});

describe("Get All Active Contract For Profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw bad request error, when no profile is mentioned for accessing the contract.", async () => {
    const response = await request(app).get(`/contracts`);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    console.log(response.body.errors);
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should throw bad request error, when negative profile id  is mentioned for accessing the contract.", async () => {
    const response = await request(app)
      .get(`/contracts`)
      .set("profile_id", "-1");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should throw bad request error, when profile id 0 is mentioned for accessing the contract.", async () => {
    const response = await request(app)
      .get(`/contracts`)
      .set("profile_id", "0");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should return bad request error, when invalid profile id is mentioned for accessing the contract.", async () => {
    const response = await request(app)
      .get(`/contracts`)
      .set("profile_id", "abc");
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].path).toBe("profile_id");
    expect(response.body.errors[0].msg).toBe(
      "Please ensure to provide a profile Id for authentication."
    );
  });

  it("should return not found error, when non existing profile id is mentioned for accessing the contract.", async () => {
    jest.spyOn(profileModels, "getProfileById").mockResolvedValueOnce(null);

    const response = await request(app)
      .get(`/contracts`)
      .set("profile_id", "50");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      "Error occurred while getting profile from table. Ensure it exists."
    );
    expect(response.body.details).toBe(
      "The Profile with id 50 does not exists."
    );
  });

  it("should return empty response, when profile does have access to just terminated ones", async () => {
    jest
      .spyOn(profileModels, "getProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(contractModels, "getAllNonTerminatedContractsByProfile")
      .mockResolvedValueOnce([]);
    jest
      .spyOn(contractModels, "getAllContractsByProfile")
      .mockResolvedValueOnce([mockData.mockTerimatedContract]);

    const response = await request(app)
      .get(`/contracts`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.status).toBe(200);
    expect(response.body.contracts).toStrictEqual([]);
  });

  it("should return internal server error, when error occurrs while reading details from database.", async () => {
    jest
      .spyOn(profileModels, "getProfileById")
      .mockResolvedValueOnce(mockData.mockClientProfile);

    jest
      .spyOn(contractModels, "getAllNonTerminatedContractsByProfile")
      .mockRejectedValueOnce("Read access not there.");

    const response = await request(app)
      .get(`/contracts`)
      .set("profile_id", mockData.mockClientProfile.id.toString());

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      `Error occurred while fetching non terminated contracts for profile by id ${mockData.mockClientProfile.id}`
    );
    expect(response.body.details).toBe(
      `Error occurred while getting contracts for profile ${mockData.mockClientProfile.firstName} from table. Read access not there.`
    );
  });
});
