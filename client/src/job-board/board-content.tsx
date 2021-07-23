import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Details from "./details";
import SearchCriteria from "./search-criteria";
import JobsList from "./jobs-list";
import { Category, PositionType, JobPosting } from "../service/JobTypes";
import { useLoadJobPostingDetails } from "../service/service";
import Application from "./application";

interface Props {
  categories: Category[] | null,
  positionTypes: PositionType[] | null,
  loadCategoriesError: Error | null,
  selectedJob: JobPosting | null,
  detailsJob: JobPosting | null,
  loadPositionTypesError: Error | null,
  forceCategoriesReload: () => void,
  forcePositionTypesReload: () => void,
  setSelectedJob: (job: JobPosting | null) => void,
  setSelectedDetailsJob: (job: JobPosting | null) => void,
  showApplication: (job?: JobPosting | null) => void,
  back: () => void
}

export default function BoardContent(props: Props) {
  const { data: additionalDetails, error: detailsError, loading: isDetailsLoading } = useLoadJobPostingDetails(props.selectedJob?.id);
  const containerClass = "job-board-sub-container h-100 " + (Boolean(props.selectedJob) ? " job-selected" : "");

  return (
    <>
      <Application job={props.selectedJob} details={isDetailsLoading ? null : additionalDetails} back={props.back} isLoading={isDetailsLoading} />
      <Container fluid className={containerClass}>
        <Row>
          <Col lg="3" xs="12" className="h-100 p-0">
            <SearchCriteria
              categories={props.categories}
              positionTypes={props.positionTypes}
              loadCategoriesError={props.loadCategoriesError}
              loadPositionTypesError={props.loadPositionTypesError}
              forceCategoriesReload={props.forceCategoriesReload}
              forcePositionTypesReload={props.forcePositionTypesReload}
            />
          </Col>
          <Col lg="6" xs="12"> <JobsList setSelectedJob={props.setSelectedJob} showApplication={props.showApplication} setSelectedDetailsJob={props.setSelectedDetailsJob} /> </Col>
          <Col lg="3" className="d-none d-lg-block h-100 p-0"> <Details job={props.detailsJob} showApplication={props.showApplication} /> </Col>
        </Row>
      </Container>
    </>

  );
}