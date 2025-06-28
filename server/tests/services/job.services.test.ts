import * as JobService from "../../src/services/job.services";
import { Job as JobModel } from "../../src/model";
import * as mockData from "../test-data/mock-data";

jest.mock("../../src/model");

describe("Get All Unpaid Jobs of Active Contracts for a profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return unpaid jobs list of active contracts, if contracts exists for given profile.", async () => {
    (JobModel.findAll as jest.Mock).mockResolvedValueOnce([
      mockData.mockUnpaidJob,
    ]);

    const unpaidJobs = await JobService.getUnpaidJobsForActiveContracts(
      mockData.mockContractorProfile
    );

    expect(unpaidJobs).toMatchObject([mockData.mockUnpaidJob]);
    expect(JobModel.findAll).toHaveBeenCalledTimes(1);
  });

  it("Should return empty unpaid jobs list of active contracts, if no contracts exists for given profile.", async () => {
    (JobModel.findAll as jest.Mock).mockResolvedValueOnce([]);

    const unpaidJobs = await JobService.getUnpaidJobsForActiveContracts(
      mockData.mockContractorProfile
    );

    expect(unpaidJobs).toMatchObject([]);
    expect(JobModel.findAll).toHaveBeenCalledTimes(1);
  });

  it("Should return empty unpaid jobs list of active contracts, if no active contracts exists for given profile.", async () => {
    (JobModel.findAll as jest.Mock).mockResolvedValueOnce([]);

    const unpaidJobs = await JobService.getUnpaidJobsForActiveContracts(
      mockData.mockContractorProfile
    );

    expect(unpaidJobs).toMatchObject([]);
    expect(JobModel.findAll).toHaveBeenCalledTimes(1);
  });

  it("Should return empty unpaid jobs list of active contracts, if all jobs are paid for given profile.", async () => {
    (JobModel.findAll as jest.Mock).mockResolvedValueOnce([]);

    const unpaidJobs = await JobService.getUnpaidJobsForActiveContracts(
      mockData.mockContractorProfile
    );

    expect(unpaidJobs).toMatchObject([]);
    expect(JobModel.findAll).toHaveBeenCalledTimes(1);
  });

  it("Should throw error, if error occurs while reading job details.", async () => {
    (JobModel.findAll as jest.Mock).mockRejectedValue("Read access not there.");

    try {
      const unpaidJobs = await JobService.getUnpaidJobsForActiveContracts(
        mockData.mockContractorProfile
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Error occurred while getting unpaid jobs for active contracts for profile with id ${mockData.mockContractorProfile.id}. Read access not there.`
      );
    }
  });
});
