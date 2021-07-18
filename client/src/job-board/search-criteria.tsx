import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { JobPosting, Category, PositionType } from "../service/JobTypes";

interface Props {
  categories: Category[] | null,
  positionTypes: PositionType[] | null
}

export default function SearchCriteria(props: Props) {
  return (
    <div className="job-board-search-container">
      <div className="job-board-search-content">
        <Card border="dark">
          <form className="text-center pt-3 pb-3" onSubmit={(e) => e.preventDefault()}>
            <Container>
              <Row>
                <Col>
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input placeholder="Search..."></input>
                </Col>
              </Row>
            </Container>
          </form>
        </Card>
      </div>
    </div >
  );
}