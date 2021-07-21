import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons'

import { JobPosting } from "../service/JobTypes";

interface Props {
  job: JobPosting | null
}

export default function Details(props: Props) {
  let title = props.job ? props.job.title : "";
  let description = props.job ? props.job.description : "click 'view' on a job posting to display more details...";
  let parentClass = props.job ? "" : " empty";
  return (
    <div>
      <div className={"job-board-details-content " + parentClass}>
        <Card>
          <Card.Title>{title && <Card.Header>{title}</Card.Header>}</Card.Title>
          <Card.Body><FontAwesomeIcon icon={faBook} size="2x" /><span> {description}</span></Card.Body>
          {props.job && <Card.Footer className="text-center"><Button>Apply!</Button></Card.Footer>}
        </Card>
      </div>
    </div>
  );
}