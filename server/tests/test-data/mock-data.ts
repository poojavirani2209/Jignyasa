import { Job } from "../../src/types/jobs";
import { Contract, ContractStatus } from "../../src/types/contracts";
import { Profile, ProfileType } from "../../src/types/profiles";

export const mockNewContract: Contract = {
  id: 1,
  ClientId: 10,
  ContractorId: 20,
  status: ContractStatus.NEW,
  terms:
    "Full time employee as full stack engineer for 6 months. Will be paid $5000.",
};

export const mockInProgressContract: Contract = {
  id: 2,
  ClientId: 20,
  ContractorId: 30,
  status: ContractStatus.IN_PROGRESS,
  terms:
    "Part time employee as full stack engineer for 6 months. Will be paid $2000.",
};

export const mockTerimatedContract: Contract = {
  id: 3,
  ClientId: 10,
  ContractorId: 20,
  status: ContractStatus.TERMINATED,
  terms:
    "Full time employee as backend engineer for 2 months. Will be paid $1000.",
};

export const mockInProgressContract2: Contract = {
  id: 4,
  ClientId: 20,
  ContractorId: 30,
  status: ContractStatus.IN_PROGRESS,
  terms:
    "Part time employee as full stack engineer for 1 months. Will be paid $500.",
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

export const mockLessBalanceClientProfile: Profile = {
  id: 11,
  firstName: "John",
  lastName: "Smoth",
  type: ProfileType.CLIENT,
  profession: "Liver",
  balance: 2,
};

export const mockUnpaidJob: Job = {
  id: 1,
  ContractId: 2,
  description: "",
  price: 10,
  paid: false,
  paymentDate: new Date(),
};

export const mockPaidJob: Job = {
  id: 2,
  ContractId: 4,
  description: "",
  price: 150,
  paid: true,
  paymentDate: new Date(),
};
