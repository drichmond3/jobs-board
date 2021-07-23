import { useCallback, useEffect, useRef, useState } from "react";

import { Category, JobPosting, JobPostingDetails, PositionType } from "./JobTypes";

export const ENDPOINTS: {
  getCategories: () => string,
  getPositionTypes: () => string,
  getJobPostingDetails: (jobPostingId: number) => string,
  getJobPostings: (searchText: string, categoryIds: number[], positionTypeIds: number[], pageNumber: number, resultsPerPage: number) => string
} = {
  getCategories: () => `${process.env.REACT_APP_SERVICE_URL}/job_categories?_sort=popularity&_order=desc&_limit=100`,
  getPositionTypes: () => `${process.env.REACT_APP_SERVICE_URL}/job_position_types?_sort=name&_order=asc&_limit=100`,
  getJobPostingDetails: (id: number) => `${process.env.REACT_APP_SERVICE_URL}/job_posting_additional_details?job_posting_id=${id}&_limit=1000`,
  getJobPostings: (searchText, categoryIds, positionTypeIds, pageNumber, resultsPerPage) => {
    let response = `${process.env.REACT_APP_SERVICE_URL}/job_postings?_expand=job_categories&_expand=job_position_types&_page=${pageNumber}&_limit=${resultsPerPage}`;
    if (categoryIds && categoryIds.length > 0) {
      response += categoryIds.map((categoryId) => `&job_categoriesId=${encodeURIComponent(categoryId)}`).join("");
    }
    if (positionTypeIds && positionTypeIds.length > 0) {
      response += positionTypeIds.map((positionTypeId) => `&job_position_typesId=${encodeURIComponent(positionTypeId)}`).join("");
    }
    if (searchText) {
      response += `&q=${encodeURIComponent(searchText)}`;
    }
    return response;
  }
}

interface UseFetchResponse<T> {
  data: T | null,
  headers: Headers | null,
  error: Error | null,
  loading: boolean,
  forceReload: () => void
}

interface JobPostingsResponse extends UseFetchResponse<JobPosting[]> {
  loadMoreJobs: () => void,
  isEndOfStream: boolean
}

export function useLoadCategories(): UseFetchResponse<Category[]> {
  return useFetch<Category[]>(ENDPOINTS.getCategories());
}

interface FetchingState {
  QUEUED: number,
  FETCHING: number,
  STORING: number,
  FINISHED: number,
  EMPTY: number
}

export function useLoadJobPostings(searchText: string, categories: Category[] | null, positionTypes: PositionType[] | null, resultsPerPage: number): JobPostingsResponse {
  let [safeSearchCriteria, setSafeSearchCriteria] = useState<{ pageNumber: number, searchText: string, categories: Category[] | null, positionTypes: PositionType[] | null, resultsPerPage: number }>(
    { pageNumber: 1, searchText, categories, positionTypes, resultsPerPage }
  );
  let [lastRequestId, setLastRequestId] = useState<number>(-1);
  let response = useFetch<JobPosting[]>(ENDPOINTS.getJobPostings(safeSearchCriteria.searchText, getIds(safeSearchCriteria.categories), getIds(safeSearchCriteria.positionTypes), safeSearchCriteria.pageNumber, safeSearchCriteria.resultsPerPage));
  let [jobs, setJobs] = useState<JobPosting[] | null>(null);
  let [fetchState, setFetchState] = useState<keyof FetchingState>("FETCHING");

  //QUEUED -> FETCHING
  useEffect(() => {
    if (fetchState === "QUEUED") {
      setSafeSearchCriteria((old) => {
        return { ...safeSearchCriteria, pageNumber: (old.pageNumber + 1) }
      });
      setFetchState("FETCHING");
    }
  }, [fetchState, safeSearchCriteria]);

  //FETCHING -> STORING adds newly loaded lobs to the list of jobs we're displaying.
  useEffect(() => {
    if (response.data && fetchState === "FETCHING" && response.requestId > lastRequestId) {
      setFetchState("STORING");
      setJobs(j => {
        if (response.data && j) {
          return [...j, ...response.data]
        }
        return response.data;
      });
      setLastRequestId(response.requestId);
    }
  }, [response.requestId]);

  //STORING -> FINISHED
  useEffect(() => {
    const timerId = setTimeout(() => {
      //otherwise we've started another request, and we don't want to wreck the state machine by changing its state.
      if (fetchState === "STORING") {
        if ((!response.data || response.data.length === 0) && !(response.error) && (!response.loading)) {
          setFetchState("EMPTY");
        } else {
          setFetchState("FINISHED")
        }
      }
    }, 1000);
    return () => {
      clearTimeout(timerId);
    }
  }, [lastRequestId, response.data, response.loading, response.error, fetchState]);

  //FINISHED -> QUEUED
  let loadMoreJobs = () => {
    setFetchState((fetchState) => {
      if (fetchState === "FINISHED") {
        return "QUEUED"
      }
      return fetchState;
    });
  }

  //ANY -> FETCHING :: BREAK DATA STREAM conditions. clears jobs list anytime we change our search criteria.
  useEffect(() => {
    setJobs([]);
    setSafeSearchCriteria({ pageNumber: 1, searchText, categories, positionTypes, resultsPerPage });
    setFetchState("FETCHING"); //circumvents the request 1 page at a time state machine process.
  }, [searchText, categories, positionTypes, resultsPerPage]);

  return { data: jobs, headers: response.headers, error: response.error, loading: response.loading, forceReload: loadMoreJobs, loadMoreJobs, isEndOfStream: (fetchState === "EMPTY") }
}

export function useLoadJobPostingDetails(id: number | undefined | null): UseFetchResponse<JobPostingDetails[]> {
  const url = id ? ENDPOINTS.getJobPostingDetails(id) : null;
  return useFetch<JobPostingDetails[]>(url);
}

export function useLoadPositionTypes(): UseFetchResponse<PositionType[]> {
  return useFetch<PositionType[]>(ENDPOINTS.getPositionTypes());
}

interface RawFetchResponse<T> extends UseFetchResponse<T> {
  requestId: number
}
/**
 * Makes a GET request to the specified url.
 * This implementation only cares about the most recent request sent. When a response is received, the return values are only updated if the request is the most recent request the client sent out. 
 * If another more recent request is currently in flight, the current response will be ignored.
 * @param url the url to make a GET request to. A new request will be made anytime this value changes.
 * @returns the state of the most recent fetch request.
 */
export function useFetch<T>(url: string | null): RawFetchResponse<T> {
  const requestCount = useRef<number>(0); //need a value we can modify, persists across re-renders, and doesn't cause a re-render on change to track concurrent request count.
  const [reloadFlag, setReloadFlag] = useState<boolean>(false);
  const forceReload = useCallback(() => setReloadFlag(true), []);
  const [responseData, setResponseData] = useState<{ data: T | null, headers: Headers | null, error: Error | null, loading: boolean, requestId: number }>({ data: null, headers: null, error: null, loading: false, requestId: requestCount.current });
  useEffect(() => {
    if (reloadFlag) {
      setReloadFlag(false);
      return;
    }
    if (!url) {
      return;
    }
    requestCount.current++;
    let requestIndex = requestCount.current;
    setResponseData(old => ({ ...old, loading: true, error: null }));
    fetch(url).then((response: Response) => {
      if (response.ok) {
        response.json().then(
          (parsedObject: T) => {
            if (requestIndex === requestCount.current) {
              setResponseData(old => ({ data: parsedObject, headers: response.headers, error: null, loading: false, requestId: requestCount.current }))
            }
          }
        )
      }
    }).catch((error: Error) => {
      setResponseData(old => ({ ...old, error: error }));
    }).finally(() => {
      if (requestIndex === requestCount.current) {
        setResponseData(old => ({ ...old, loading: false }));
      }
    })
  }, [url, reloadFlag])
  return { data: responseData.data, headers: responseData.headers, error: responseData.error, loading: responseData.loading, forceReload: forceReload, requestId: responseData.requestId }
}

/**
 * Makes a GET request to the specified url and updates its state with every response received, regardless of the order the requests were sent/or received in. Use this when the client needs to be notified every time a response
 * is received, even if a more recent request has been sent and the current response could be considered stale.
 * However in the case of concurrent requests, the loading state will only be set to false once all requests have completed.
 * @param url the url to make a GET request to. A new request will be made anytime this value changes.
 * @returns 
 */
export function useFetchIncludeAll<T>(url: string): UseFetchResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [headers, setHeaders] = useState<Headers | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const requestMapRef = useRef<{ [name: string]: boolean }>({}); //need a value we can modify, persists across re-renders, and doesn't cause a re-render on change to track concurrent request count.
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadFlag, setReloadFlag] = useState<boolean>(false);
  const forceReload = useCallback(() => setReloadFlag(true), []);

  useEffect(() => {
    if (reloadFlag) {
      setReloadFlag(false);
      return;
    }
    requestMapRef.current[url] = true;
    setLoading(true);
    fetch(url).then((response: Response) => {
      if (response.ok) {
        response.json().then(
          (parsedObject: T) => {
            setData(parsedObject);
            setHeaders(response.headers);
            setError(null);
          }
        )
      }
    }).catch((error: Error) => {
      setError(error);
    }).finally(() => {
      delete requestMapRef.current[url];
      if (Object.keys(requestMapRef.current).length <= 0) {
        setLoading(false);
      }
    })
  }, [url, reloadFlag])
  return { data, headers, error, loading: loading, forceReload }
}


let getIds = (categories: { id: number }[] | null): number[] => {
  return categories ? categories.map(category => category.id) : ([] as number[]);
}