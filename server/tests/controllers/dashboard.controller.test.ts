import request from "supertest";
import app from "../../src/app";
import * as DashboardModels from "../../src/models/dashboard.models";

describe("Get Best Professtion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw bad request error, when no start date is not provided to find the best profession", async () => {
    const response = await request(app).get(
      `/admin/best-profession?end=2029-01-01`
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Error occurred while fetching the best profession."
    );
    expect(response.body.details).toBe(
      "Please ensure to provide start and end date."
    );
  });

  it("should throw bad request error, when no end date is not provided to find the best profession", async () => {
    const response = await request(app).get(
      `/admin/best-profession?start=2029-01-01`
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Error occurred while fetching the best profession."
    );
    expect(response.body.details).toBe(
      "Please ensure to provide start and end date."
    );
  });

  it("should provide not found error, when no profression exists in range of start and end date provided", async () => {
    jest
      .spyOn(DashboardModels, "getBestProfession")
      .mockResolvedValueOnce(undefined as any);

    const response = await request(app).get(
      `/admin/best-profession?start=2029-01-01&end=2030-01-01`
    );

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      "Error occurred while fetching the best profession."
    );
    expect(response.body.details).toBe(
      "No profession found in the provided date range"
    );
  });

  it("should provide best profession, when start and end date is provided to find the best profession", async () => {
    jest.spyOn(DashboardModels, "getBestProfession").mockResolvedValueOnce({
      profession: "Programmer",
      total_earned: "12345678",
    } as any);

    const response = await request(app).get(
      `/admin/best-profession?start=2029-01-01&end=2030-01-01`
    );

    expect(response.status).toBe(200);
    
    expect(response.body.bestProfession).toMatchObject({
      profession: "Programmer",
      total_earned: "12345678",
    });
  });
});
