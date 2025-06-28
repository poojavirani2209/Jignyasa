import { ForbiddenError, NotFoundError } from "../../src/errors/api-errors";
import { Contract as ContractModel } from "../../src/model";
import * as ContractService from "../../src/services/contracts.services";
import { Contract, ContractStatus } from "../../src/types/contracts";
import { Profile, ProfileType } from "../../src/types/profiles";

jest.mock("../../src/model");

const mockNewContract: Contract = {
  id: 1,
  ClientId: 10,
  ContractorId: 20,
  status: ContractStatus.NEW,
  terms:
    "Full time employee as full stack engineer for 6 months. Will be paid $5000.",
};

const mockInProgressContract: Contract = {
  id: 2,
  ClientId: 20,
  ContractorId: 30,
  status: ContractStatus.IN_PROGRESS,
  terms:
    "Part time employee as full stack engineer for 6 months. Will be paid $2000.",
};

const mockTerimatedContract: Contract = {
  id: 3,
  ClientId: 10,
  ContractorId: 20,
  status: ContractStatus.TERMINATED,
  terms:
    "Full time employee as backend engineer for 2 months. Will be paid $1000.",
};

export const mockClientProfile: Profile = {
  id: 10,
  firstName: "Pooja",
  lastName: "Virani",
  type: ProfileType.CLIENT,
  profession: "CEO",
  balance: 25000,
};

export const mockContractorProfile: Profile = {
  id: 30,
  firstName: "Shubham",
  lastName: "Kathe",
  type: ProfileType.CONTRACTOR,
  profession: "CEO",
  balance: 25000,
};

describe("Get Contract by id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return contract data, if contract exists and given profile has access.", async () => {
    (ContractModel.findOne as jest.Mock).mockResolvedValue(mockNewContract);

    const contract = await ContractService.getContractById(
      mockNewContract.id,
      mockClientProfile
    );

    expect(contract).toEqual(mockNewContract);
    expect(ContractModel.findOne).toHaveBeenCalledWith({
      where: { id: mockNewContract.id },
    });
  });

  it("Should throw forbidden error, if contract exists but given profile does not have access.", async () => {
    (ContractModel.findOne as jest.Mock).mockResolvedValue(
      mockInProgressContract
    );

    try {
      const contract = await ContractService.getContractById(
        mockInProgressContract.id,
        mockClientProfile
      );
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect(error.message).toBe(
        `This profile ${mockClientProfile.id} does not have access to the contract. Please connect with admin.`
      );
    }
  });

  it("Should throw not found error, if contract does not exists.", async () => {
    const nonExistingContractId = 50;

    (ContractModel.findOne as jest.Mock).mockResolvedValue(null);

    try {
      const contract = await ContractService.getContractById(
        mockInProgressContract.id,
        mockContractorProfile
      );
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe(
        `The Contract with id ${mockInProgressContract.id} does not exists.`
      );
    }
  });

  it("Should throw error, if db error occurs while reading contract details.", async () => {
    (ContractModel.findOne as jest.Mock).mockRejectedValue(
      "Read access not there."
    );

    try {
      const contract = await ContractService.getContractById(
        mockInProgressContract.id,
        mockContractorProfile
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Error occurred while getting contract with id ${mockInProgressContract.id}. Read access not there.`
      );
    }
  });
});

describe("Get All Non Terminated Contracts for a profile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return active contracts data, if contracts exists and given profile has access.", async () => {
    (ContractModel.findAll as jest.Mock).mockResolvedValueOnce([
      mockNewContract,
      mockInProgressContract,
    ]);

    const activeContracts = await ContractService.getAllNonTerminatedContractsByProfile(
      mockContractorProfile
    );

    expect(activeContracts).toMatchObject([
      mockNewContract,
      mockInProgressContract,
    ]);
    expect(ContractModel.findAll).toHaveBeenCalledTimes(1);
  });

  it("Should return empty response, if profile has no non terminated contracts assigned.", async () => {
    (ContractModel.findAll as jest.Mock).mockResolvedValueOnce([]);

    const activeContracts = await ContractService.getAllNonTerminatedContractsByProfile(
      mockContractorProfile
    );

    expect(activeContracts).toMatchObject([]);
    expect(ContractModel.findAll).toHaveBeenCalledTimes(1);
  });

  it("Should throw error, if error occurs while reading contract details.", async () => {
    (ContractModel.findAll as jest.Mock).mockRejectedValue(
      "Read access not there."
    );

    try {
      const contracts = await ContractService.getAllNonTerminatedContractsByProfile(
        mockContractorProfile
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        `Error occurred while getting contracts for profile ${mockContractorProfile.firstName} from table. Read access not there.`
      );
    }
  });
});

describe("If Profile Has Access to Contract - hasAccessToContract", () => {
  it("Should return true if valid client profile is trying to access the contract.", async () => {
    const result = await ContractService.hasAcessToContract(
      mockNewContract,
      10
    );
    expect(result).toBe(true);
  });

  it("Should return true if valid contractor profile is trying to access the contract.", async () => {
    const result = await ContractService.hasAcessToContract(
      mockNewContract,
      20
    );
    expect(result).toBe(true);
  });

  it("Should return true if profile with not access is trying to access the contract.", async () => {
    const result = await ContractService.hasAcessToContract(
      mockInProgressContract,
      1
    );
    expect(result).toBe(false);
  });
});
