import React, { ReactElement, useContext } from "react";
import { Button, Card, Alert } from "react-bootstrap";

import SyntheticButton from "../synthetic-button";
import { JobPosting } from "../service/JobTypes";
import { SearchContext, ContextValue } from "../service/search-context";
interface Props {

}

export default function JobsList(props: Props) {
  const { jobPostings, isLoadingJobs, loadJobPostingsError } = useContext<ContextValue>(SearchContext);
  let jobs: JobPosting[] | null = jobPostings ? jobPostings : [];
  if (isLoadingJobs) {
    jobs = Array(15).fill(null);
  }

  if (loadJobPostingsError) {
    return (
      <Alert variant="danger">Unable to find any search results. Please change your search criteria and try again.</Alert>
    )
  }
  return (
    <div className="jobs-list-container">
      {jobs.map((job, index) => renderJob(job, index, isLoadingJobs))}
    </div>
  )
}

let renderJob = (job: JobPosting | null, key: number, isLoading: boolean): ReactElement => {
  const delayIndex = (key * 5) % 12;
  const delayClass = (key === 0) ? "" : "delay-" + delayIndex;

  let imgSrc = (job && !isLoading) ? ("/uploads/" + job.logo_file_name) : undefined;
  let imgAlt = (job && !isLoading) ? `Company ${job.company}` : "loading image";
  let title = (job && !isLoading) ? job.title : <>&nbsp;</>;
  let company = (job && !isLoading) ? job.company : <>&nbsp;</>;
  let age = (job && !isLoading) ? getDisplayAge(job.age_in_hours) : <>&nbsp;</>;
  let positionType = (job && !isLoading) ? job.job_position_types.name : <>&nbsp;</>
  let viewBtnText = (job && !isLoading) ? "View" : <>&nbsp;</>;
  let loadingClass = isLoading ? "loading" : "";
  return (
    <SyntheticButton key={key} hoverClass="bg-light" clickClass="jobs-bg-clicked">
      <Card id={"jobs-list-item" + key} className={"jobs-list-item " + loadingClass}>
        {isLoading && <div className="loading-indicator"><div className={delayClass}></div></div>}
        <object className="job-img" data={imgSrc} type="image/png">{imgAlt}</object>
        <div className="jobs-list-item-primary">
          <span className="title"><span>{title}</span></span>
          <span className="sub-data"><span>{company}</span></span>
          <span className="sub-data">{age}</span>
        </div>
        <div className="d-none d-md-block">
          <span className="sub-data">{positionType}</span>
          <Button className="d-none d-lg-inline">{viewBtnText}</Button>
        </div>
      </Card>
    </SyntheticButton>
  )
}

const getDisplayAge = (ageInHours: number): string => {
  const HOURS_PER_MONTH = 24 * 365 / 12;
  if (ageInHours < 24) {
    return `${ageInHours} Hours`;
  }
  else if (ageInHours < HOURS_PER_MONTH) {
    return `${Math.round(ageInHours / 24)} Days`;
  }
  else {
    return `${Math.round(ageInHours / HOURS_PER_MONTH)} Months`
  }
}