export interface Category {
  name: string,
  id: number,
}

export interface JobPosting {
  id: number,
  title: string,
  company: string,
  job_categoriesId: number,
  job_position_typesId: number,
  city: string,
  state: string,
  industry: string,
  age_in_hours: number,
  logo_file_name: string,
  description: string,
  job_categories: { name: string },
  job_position_types: { name: string }
}

export interface PositionType {
  id: number,
  name: string
}