import {ResultSummary} from "@haapi/typescript-client";
import {yearlyResultL2Mock, yearlyResultMock} from "./grades-mocks";

export const summaryResultMocks: ResultSummary = {
  obtained_credits: 54,
  status: "IN_PROGRESS",
  total_credits: 100,
  weighted_average: 12.45,
  yearly_results: [yearlyResultMock, yearlyResultL2Mock],
};
