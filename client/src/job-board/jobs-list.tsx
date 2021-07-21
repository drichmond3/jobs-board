import React, { ReactElement, useContext, useEffect, useRef } from "react";
import { Button, Card, Alert } from "react-bootstrap";

import SyntheticButton from "../synthetic-button";
import { JobPosting } from "../service/JobTypes";
import { SearchContext, ContextValue } from "../service/search-context";
interface Props {
  setSelectedJob: (job: JobPosting | null) => void
}

function useOnScreen(ref: React.MutableRefObject<Element | null>, load: () => void) {
  let isIntersecting = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting.current = entry.isIntersecting;
      }
    )
    setInterval(() => isIntersecting.current && load(), 700);
    if (ref.current) {
      observer.observe(ref.current)
      return () => { observer.disconnect() }
    }
  }, [ref, load]);
}


export default function JobsList(props: Props) {
  const { jobPostings, isLoadingJobs, loadJobPostingsError, isEndOfJobsStream, loadMoreJobs } = useContext<ContextValue>(SearchContext);
  const loadIndicatorRef = useRef<HTMLDivElement | null>(null);
  useOnScreen(loadIndicatorRef, loadMoreJobs);

  let jobs: JobPosting[] | null = jobPostings ? jobPostings : [];
  if (isLoadingJobs && (jobs.length === 0)) {
    const content = Array(15).fill(null).map((job, index) => renderJob(job, index, true, props.setSelectedJob));
    content.push(<div key={-1} ref={loadIndicatorRef} className="d-none">---</div>);
    return (
      <div className="jobs-list-container">
        {content}
      </div>
    )
  }

  if (loadJobPostingsError) {
    return (
      <Alert variant="danger">Unable to find any search results. Please change your search criteria and try again.</Alert>
    )
  }
  const content = jobs.map((job, index) => renderJob(job, index, false, props.setSelectedJob));
  let offset = content.length;
  if (isLoadingJobs) {
    Array(5).fill(null).map((job, index) => renderJob(job, offset + index, true, props.setSelectedJob)).map(entry => content.push(entry));
    content.push(<div key={-1} ref={loadIndicatorRef}></div>);
  }
  else if (!isEndOfJobsStream) {
    content.push(<div key={-1} ref={loadIndicatorRef}></div>);
    Array(5).fill(null).map((job, index) => renderJob(job, offset + index, true, props.setSelectedJob)).map(entry => content.push(entry));
  }
  return (
    <div className={"jobs-list-container"}>
      {content}
    </div>
  )
}

let renderJob = (job: JobPosting | null, key: number, isLoading: boolean, selectFunc: (job: JobPosting | null) => void): ReactElement => {
  const delayIndex = (key * 5) % 12;
  const delayClass = (key === 0) ? "" : "delay-" + delayIndex;

  let imgSrc = (job && !isLoading) ? ("/uploads/" + job.logo_file_name) : undefined;
  let imgAlt = (job && !isLoading) ? `Company ${job.company}` : "loading image";
  let title = (job && !isLoading) ? job.title : <>&nbsp;</>;
  let company = (job && !isLoading) ? job.company : <>&nbsp;</>;
  let age = (job && !isLoading) ? getDisplayAge(job.age_in_hours) : <>&nbsp;</>;
  let positionType = (job && !isLoading) ? job.job_position_types.name : <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>
  let viewBtnText = "View";
  let loadingClass = isLoading ? "loading" : "";
  return (
    <SyntheticButton key={key} hoverClass="bg-light" clickClass="jobs-bg-clicked">
      <Card id={"jobs-list-item" + key} className={"jobs-list-item " + loadingClass} onClick={() => selectFunc(job)}>
        {isLoading && <div className="loading-indicator"><div className={delayClass}></div></div>}
        <object className="job-img" data={imgSrc} type="image/png">{imgAlt}</object>
        <div className="jobs-list-item-primary">
          <span className="title"><span>{title}</span></span>
          <span className="sub-data"><span>{company}</span></span>
          <span className="sub-data"><span>{age}</span></span>
        </div>
        <div className="d-none d-md-block">
          <span className="sub-data">{positionType}</span>
          <Button className="d-none d-lg-inline" onClick={() => selectFunc(job)}>{viewBtnText}</Button>
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