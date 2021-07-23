import React, { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faClock, faGlobe, faSearchLocation, faCalendarDay, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Button, Alert, Fade } from "react-bootstrap";

import { JobPosting, JobPostingDetails } from "../../service/JobTypes";
import { getDisplayAge } from "../../Utils";
import "./application.css";

interface Props {
  details: JobPostingDetails[] | null,
  job: JobPosting | null,
  isLoading: boolean,
  back: () => void
}

export default function Application(props: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const startApplication = useCallback(() => { setErrorMessage("This is a demo site. To have a custom built responsive website of your own, contact Darrien Richmond [darrien.richmond@gmail.com]") }, [])
  useEffect(() => { setErrorMessage(null) }, [props]);

  return (
    <div className="job-application-container" >
      {renderContent(props, errorMessage, startApplication)}
    </div>
  )
}
const renderContent = (props: Props, errorMessage: string | null, startApplication: () => void) => {
  if (!props.details || !props.job) {
    if (props.isLoading) {
      return (
        <div className="loading-page">
          <FontAwesomeIcon icon={faSpinner} size="4x" pulse></FontAwesomeIcon>
        </div>
      )
    } else {
      return (<div />);
    }
  }

  return (
    <div className="job-application-content">
      <div className="job-application-back-button">
        <span onClick={props.back}><FontAwesomeIcon icon={faArrowLeft} /> Back to job postings</span>
      </div>
      <div className="job-application-logo">
        <img src={"/uploads/" + props.job.logo_file_name} alt={props.job.company + " " + props.job.title + " logo"} />
      </div>
      <div className="job-application-header">
        <h2>{props.job.title}</h2>
        <h3>{props.job.company}</h3>
        <Container fluid>
          <Row className="job-application-sub-data">
            <Col className="ps-0">
              <div><FontAwesomeIcon icon={faClock} /><span className="ps-2">{props.job.job_position_types.name}</span></div>
              <div><FontAwesomeIcon icon={faSearchLocation} /><span className="ps-2">{props.job.city}, {props.job.state}</span></div>
            </Col>
            <Col>
              <div><FontAwesomeIcon icon={faGlobe} /><span className="ps-2">{props.job.industry}</span></div>
              <div><FontAwesomeIcon icon={faCalendarDay} /><span className="ps-2">{getDisplayAge(props.job.age_in_hours)}</span></div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="job-application-description">
        <h3>Job Description</h3>
        <p>{props.job.description}</p>
        <ul>
          {props.details.map(detail => <li key={detail.id}>{detail.content}</li>)}
        </ul>
        <div className="job-application-footer">
          {
            (() => {
              if (errorMessage) {
                return (<Alert variant="info">{errorMessage}</Alert>)
              } else {
                return (<Button onClick={startApplication}>Apply</Button>);
              }
            })()
          }
        </div>
      </div>
    </div>
  );
}