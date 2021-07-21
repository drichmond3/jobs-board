import React, { useState, useCallback } from "react";
import { Category, JobPosting, PositionType } from "./JobTypes";
import debounce from 'lodash.debounce';

import { useLoadJobPostings } from "./service";

export interface ContextValue {
  selectedCategories: Category[] | null,
  selectedPositionTypes: PositionType[] | null,
  jobPostings: JobPosting[] | null,
  tmpSearchText: string,
  toggleCategory: (category: Category) => void,
  setCategory: (cat: Category | null) => void,
  togglePositionType: (positionType: PositionType) => void,
  clearPositionTypes: () => void,
  updateSearchText: (text: string) => void,
  isLoadingJobs: boolean,
  searchResultCount: number,
  loadJobPostingsError: Error | null,
  isEndOfJobsStream: boolean,
  loadMoreJobs: () => void
}

let defaultContextValue: ContextValue = {
  selectedCategories: null,
  selectedPositionTypes: null,
  jobPostings: null,
  tmpSearchText: "",
  toggleCategory: (category: Category) => { throw Error("Search Context not initialized") },
  setCategory: (cat: Category | null) => { throw Error("Search Context not initialized") },
  togglePositionType: (positionType: PositionType) => { throw Error("Search Context not initialized") },
  clearPositionTypes: () => { throw Error("Search Context not initialized") },
  updateSearchText: (text: string) => { throw Error("Search Context not initialized") },
  isLoadingJobs: false,
  searchResultCount: 0,
  loadJobPostingsError: null,
  isEndOfJobsStream: false,
  loadMoreJobs: () => { throw Error("Search Context not initialized") }
}

interface Props {
  children: React.ReactNode,
  maxResultCount: number
  debounceInMilliseconds: number
}

export const SearchContext = React.createContext<ContextValue>(defaultContextValue);

export function SearchProvider(props: Props) {
  let [selectedCategories, setSelectedCategories] = useState<Category[] | null>(null);
  let [selectedPositionTypes, setSelectedPositionTypes] = useState<PositionType[] | null>(null);
  let [tmpSearchText, setTmpSearchText] = useState<string>("");
  let [searchText, setSearchText] = useState<string>("");
  let { data: jobPostings, error: loadJobPostingsError, headers: jobPostingsHeader, loading: isLoadingJobs, loadMoreJobs, isEndOfStream } = useLoadJobPostings(searchText, selectedCategories, selectedPositionTypes, props.maxResultCount);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let debouncedSetSearchText = useCallback(debounce((text: string) => setSearchText(text), props.debounceInMilliseconds), []);

  let updateSearchText = (text: string) => {
    setTmpSearchText(text);
    debouncedSetSearchText(text);
  }

  interface Unique {
    id: number
  }

  const toggle = function <T extends Unique>(entry: T | null, list: T[] | null): (T[] | null) {
    if (entry == null) {
      return null;
    }
    if (!(list?.find(current => current.id === entry.id))) {
      return (list == null) ? [entry] : [...list, entry];
    }
    else {
      let response = [] as T[];
      list.forEach((existingEntry: T) => {
        if (existingEntry.id !== entry.id) {
          response.push(existingEntry);
        }
      });
      return response;
    }
  }

  const toggleCategory = (entry: Category | null) => {
    let updatedCategories = toggle(entry, selectedCategories);
    setSelectedCategories(updatedCategories);
  }

  const togglePositionType = (entry: PositionType | null) => {
    let updatedPositionTypes = toggle(entry, selectedPositionTypes);
    setSelectedPositionTypes(updatedPositionTypes);
  }

  const setCategory = (cat: Category | null) => {
    if (cat === null) {
      setSelectedCategories(null);
    }
    else {
      if (!(selectedCategories?.find(current => current.id === cat.id))) {
        let updatedSelectedCategories = selectedCategories == null ? [cat] : [...selectedCategories, cat];
        setSelectedCategories(updatedSelectedCategories);
      }
    }
    setSelectedPositionTypes(null);
  }

  const clearPositionTypes = (): void => {
    setSelectedPositionTypes(null);
  }

  let searchResultCount = jobPostingsHeader?.get("X-Total-Count") || 0;
  searchResultCount = Number.parseInt(searchResultCount + "");

  return (
    <SearchContext.Provider value={{ selectedCategories, selectedPositionTypes, jobPostings, tmpSearchText, toggleCategory, togglePositionType, setCategory, clearPositionTypes, updateSearchText, isLoadingJobs, searchResultCount, loadJobPostingsError, loadMoreJobs, isEndOfJobsStream: isEndOfStream }}>
      {props.children}
    </SearchContext.Provider>
  )
}