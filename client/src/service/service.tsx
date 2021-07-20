import { useCallback, useEffect, useRef, useState } from "react";

import { Category, JobPosting, PositionType } from "./JobTypes";

export const ENDPOINTS: {
  getCategories: () => string,
  getPositionTypes: () => string,
  getJobPosting: (jobPostingId: number) => string,
  getJobPostings: (searchText: string, categoryIds: number[], positionTypeIds: number[], pageNumber: number, resultsPerPage: number) => string
} = {
  getCategories: () => `${process.env.REACT_APP_SERVICE_URL}/job_categories?_sort=popularity&_order=desc&_limit=100`,
  getPositionTypes: () => `${process.env.REACT_APP_SERVICE_URL}/job_position_types?_sort=name&_order=asc&_limit=100`,
  getJobPosting: (id: number) => `${process.env.REACT_APP_SERVICE_URL}/job_postings/${id}?_expand=job_categories&_expand=job_position_types`,
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

export function useLoadCategories(): UseFetchResponse<Category[]> {
  return useFetch<Category[]>(ENDPOINTS.getCategories());
}

export function useLoadJobPostings(searchText: string, categories: Category[] | null, positionTypes: PositionType[] | null, pageNumber: number, resultsPerPage: number): UseFetchResponse<JobPosting[]> {
  let response = useFetch<JobPosting[]>(ENDPOINTS.getJobPostings(searchText, getIds(categories), getIds(positionTypes), pageNumber, resultsPerPage));
  return response;
}

export function useLoadPositionTypes(): UseFetchResponse<PositionType[]> {
  return useFetch<PositionType[]>(ENDPOINTS.getPositionTypes());
}

/**
 * Makes a GET request to the specified url.
 * This implementation only cares about the most recent request sent. When a response is received, the return values are only updated if the request is the most recent request the client sent out. 
 * If another more recent request is currently in flight, the current response will be ignored.
 * @param url the url to make a GET request to. A new request will be made anytime this value changes.
 * @returns the state of the most recent fetch request.
 */
export function useFetch<T>(url: string): UseFetchResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [headers, setHeaders] = useState<Headers | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const requestCount = useRef<number>(0); //need a value we can modify, persists across re-renders, and doesn't cause a re-render on change to track concurrent request count.
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadFlag, setReloadFlag] = useState<boolean>(false);
  const forceReload = useCallback(() => setReloadFlag(true), []);

  useEffect(() => {
    if (reloadFlag) {
      setReloadFlag(false);
      return;
    }
    requestCount.current++;
    let requestIndex = requestCount.current;
    setLoading(true);
    setError(null);
    fetch(url).then((response: Response) => {
      if (response.ok) {
        response.json().then(
          (parsedObject: T) => {
            if (requestIndex === requestCount.current) {
              setData(parsedObject);
              setHeaders(response.headers);
              setError(null);
            }
          }
        )
      }
    }).catch((error: Error) => {
      setError(error);
    }).finally(() => {
      if (requestIndex === requestCount.current) {
        setLoading(false);
      }
    })
  }, [url, reloadFlag])
  return { data, headers, error, loading: loading, forceReload: forceReload }
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