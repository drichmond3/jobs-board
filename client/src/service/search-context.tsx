import React from "react";
import { Category, JobPosting, PositionType } from "./JobTypes";

interface ContextValue {
  selectedCategories: Category[] | null,
  selectedPositionTypes: PositionType[] | null,
  jobPostings: JobPosting[] | null,
  tmpSearchText: string,
  toggleCategory: (category: Category) => void,
  togglePositionType: (positionType: PositionType) => void,
  updateSearchText: (text: string) => void,
  isLoadingJobs: boolean,
  searchResultCount: number
}

export const SearchContext = React.createContext<ContextValue | null>(null);