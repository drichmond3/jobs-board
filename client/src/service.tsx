export const ENDPOINTS: { getCategories: string } = {
  getCategories: `${process.env.REACT_APP_SERVICE_URL}/job_categories?_sort=popularity&_order=desc&_limit=100`
}