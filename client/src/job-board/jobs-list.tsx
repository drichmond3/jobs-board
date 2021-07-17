import React, { ReactElement } from "react";
import { ListGroup, Button, Card } from "react-bootstrap";

import SyntheticButton from "../synthetic-button";
import { JobPosting } from "../service/JobTypes";

interface Props {
  jobs: JobPosting[] | null;
}

export default function JobsList(props: Props) {
  let jobs = props.jobs ? props.jobs : [];
  return (
    <div className="jobs-list-container">
      {jobs.map((job, index) => renderJob(job))}
    </div>
  );
}

let renderJob = (job: JobPosting): ReactElement => {
  return (
    <SyntheticButton hoverClass="bg-light" clickClass="jobs-bg-clicked">
      <Card className="jobs-list-item">
        <img src={"/uploads/" + job.logo_file_name} alt={`Company ${job.company}`}></img>
        <div className="jobs-list-item-primary">
          <span className="title">{job.title}</span>
          <span className="sub-data">{job.company}</span>
          <span className="sub-data">{getDisplayAge(job.age_in_hours)}</span>
        </div>
        <div>
          <span className="sub-data">{job.job_position_types.name}</span>
          <Button variant="primary">View</Button>
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