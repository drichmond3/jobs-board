import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Details from "./details";
import SearchCriteria from "./search-criteria";
import JobsList from "./jobs-list";
import { JobPosting, Category, PositionType } from "../service/JobTypes";

interface Props {
  categories: Category[] | null,
  jobs: JobPosting[] | null,
  positionTypes: PositionType[] | null,
}

export default function BoardContent(props: Props) {
  return (
    <Container fluid className="h-100">
      <Row className="h-100-lg">
        <Col lg="3" xs="12" className="h-100"> <SearchCriteria categories={props.categories} positionTypes={props.positionTypes} /> </Col>
        <Col lg="6" xs="12"> <JobsList jobs={props.jobs} /> </Col>
        <Col lg="3" className="d-none d-lg-block h-100"> <Details /> </Col>
      </Row>
    </Container>
  );
}