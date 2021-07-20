import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Details from "./details";
import SearchCriteria from "./search-criteria";
import JobsList from "./jobs-list";
import { Category, PositionType } from "../service/JobTypes";

interface Props {
  categories: Category[] | null,
  positionTypes: PositionType[] | null,
  loadCategoriesError: Error | null,
  loadPositionTypesError: Error | null,
  forceCategoriesReload: () => void,
  forcePositionTypesReload: () => void
}

export default function BoardContent(props: Props) {
  return (
    <Container fluid className="h-100">
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
        <Col lg="6" xs="12"> <JobsList /> </Col>
        <Col lg="3" className="d-none d-lg-block h-100 p-0"> <Details /> </Col>
      </Row>
    </Container>
  );
}