import { useEffect, useRef, useState } from "react";

import { Category, JobPosting, PositionType } from "./JobTypes";

export const ENDPOINTS: {
  getCategories: () => string,
  getPositionTypes: () => string,
  getJobPosting: (jobPostingId: number) => string,
  getJobPostings: (categoryIds: number[], positionTypeIds: number[], pageNumber: number, resultsPerPage: number) => string
} = {
  getCategories: () => `${process.env.REACT_APP_SERVICE_URL}/job_categories?_sort=popularity&_order=desc&_limit=100`,
  getPositionTypes: () => `${process.env.REACT_APP_SERVICE_URL}/job_position_types?_sort=name&_order=asc&_limit=100`,
  getJobPosting: (id: number) => `${process.env.REACT_APP_SERVICE_URL}/job_postings/${id}?_expand=job_categories&_expand=job_position_types`,
  getJobPostings: (categoryIds: number[], positionTypeIds: number[], pageNumber: number, resultsPerPage: number) => {
    let response = `${process.env.REACT_APP_SERVICE_URL}/job_postings?_expand=job_categories&_expand=job_position_types&_page=${pageNumber}&_limit=${resultsPerPage}`;
    if (categoryIds && categoryIds.length > 0) {
      response += categoryIds.map((categoryId) => `&job_categoriesId=${encodeURIComponent(categoryId)}`).join("");
    }
    if (positionTypeIds && positionTypeIds.length > 0) {
      response += positionTypeIds.map((positionTypeId) => `&job_position_typesId=${encodeURIComponent(positionTypeId)}`).join("");
    }
    return response;
  }
}

export function useLoadCategories(): { data: Category[] | null, headers: Headers | null, error: Error | null, loading: boolean } {
  return useFetch<Category[]>(ENDPOINTS.getCategories());
}

export function useLoadJobPostings(categories: Category[] | null, positionTypes: PositionType[] | null, pageNumber: number, resultsPerPage: number): { data: JobPosting[] | null, headers: Headers | null, error: Error | null, loading: boolean } {
  let response = useFetch<JobPosting[]>(ENDPOINTS.getJobPostings(getIds(categories), getIds(positionTypes), pageNumber, resultsPerPage));
  return response;
}

export function useLoadPositionTypes(): { data: PositionType[] | null, headers: Headers | null, error: Error | null, loading: boolean } {
  return useFetch<PositionType[]>(ENDPOINTS.getPositionTypes());
}

export function useFetch<T>(url: string): { data: T | null, headers: Headers | null, error: Error | null, loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [headers, setHeaders] = useState<Headers | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const requestMapRef = useRef<{ [name: string]: boolean }>({}); //need a value we can modify, persists across re-renders, and doesn't cause a re-render on change to track concurrent request count.
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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
      console.log("count", Object.keys(requestMapRef.current).length);
      if (Object.keys(requestMapRef.current).length <= 0) {
        setLoading(false);
      }
    })
  }, [url])
  return { data, headers, error, loading: loading }
}

let getIds = (categories: { id: number }[] | null): number[] => {
  return categories ? categories.map(category => category.id) : ([] as number[]);
}