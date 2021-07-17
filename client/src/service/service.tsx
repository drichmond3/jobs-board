import { useEffect, useState } from "react";

import { Category, JobPosting, PositionType } from "./JobTypes";

export const ENDPOINTS: {
  getCategories: () => string,
  getPositionTypes: () => string,
  getJobPosting: (jobPostingId: number) => string,
  getJobPostings: (pageNumber: number, resultsPerPage: number) => string
} = {
  getCategories: () => `${process.env.REACT_APP_SERVICE_URL}/job_categories?_sort=popularity&_order=desc&_limit=100`,
  getPositionTypes: () => `${process.env.REACT_APP_SERVICE_URL}/job_position_types?_sort=name&_order=asc&_limit=100`,
  getJobPosting: (id: number) => `${process.env.REACT_APP_SERVICE_URL}/job_postings/${id}?_expand=job_categories&_expand=job_position_types`,
  getJobPostings: (pageNumber: number, resultsPerPage: number) => `${process.env.REACT_APP_SERVICE_URL}/job_postings?_expand=job_categories&_expand=job_position_types&_page=${pageNumber}&_limit=${resultsPerPage}`
}

export function useLoadCategories(): { data: Category[] | null, headers: Headers | null, error: Error | null, loading: boolean } {
  return useFetch<Category[]>(ENDPOINTS.getCategories());
}

export function useLoadJobPostings(pageNumber: number, resultsPerPage: number): { data: JobPosting[] | null, headers: Headers | null, error: Error | null, loading: boolean } {
  return useFetch<JobPosting[]>(ENDPOINTS.getJobPostings(pageNumber, resultsPerPage));
}

export function useLoadPositionTypes(): { data: PositionType[] | null, headers: Headers | null, error: Error | null, loading: boolean } {
  return useFetch<PositionType[]>(ENDPOINTS.getPositionTypes());
}

export function useFetch<T>(url: string): { data: T | null, headers: Headers | null, error: Error | null, loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [headers, setHeaders] = useState<Headers | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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
      setLoading(false);
    })
  }, [url])

  return { data, headers, error, loading }
}