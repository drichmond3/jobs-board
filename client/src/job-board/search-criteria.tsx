import React, { ReactElement } from "react";
import { Card, Col, Container, Row, Dropdown, CloseButton } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons'

import { Category, PositionType } from "../service/JobTypes";

interface Props {
  categories: Category[] | null,
  positionTypes: PositionType[] | null,
  resultCount: number,
  selectedCategories: Category[] | null
}

export default function SearchCriteria(props: Props) {
  return (
    <div id="job-board-search-container" className="job-board-search-container">
      <div className="job-board-search-content">
        <Card border="dark">
          <form className="text-center pt-3 pb-3" onSubmit={(e) => e.preventDefault()}>
            <Container className="p-0">
              <Row>
                <Col lg={12} xs={12}>
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input placeholder="Search..."></input>
                  <div className="search-info d-none d-md-block">{props.resultCount} results</div>
                </Col>
                <Col lg={12} xs={6} id="job-board-category-dropdown">
                  {renderDropdown("Categories", props.categories)}
                  {renderSelectedItems(props.selectedCategories)}
                </Col>
                <Col lg={12} xs={6} id="job-board-tag-dropdown">
                  {renderDropdown("Tags", props.positionTypes)}
                </Col>
              </Row>
            </Container>
          </form>
        </Card>
      </div>
    </div >
  );
}

const renderSelectedItems = (dataList: Category[] | null): JSX.Element[] => {
  if (dataList) {
    return (
      dataList.map(data => {
        return (
          <Card key={data.id} className="d-none d-md-block job-board-search-selections">
            <span><FontAwesomeIcon icon={faTimes} /></span>
            <span className="content">{data.name}</span>
          </Card>
        )
      })
    );
  }
  else {
    return (
      []
    )
  }
}

const renderDropdown = (name: string, dataList: Category[] | PositionType[] | null): JSX.Element => {

  if (dataList && dataList.find(data => data)) {
    return (
      <Dropdown>
        <Dropdown.Toggle>
          <FontAwesomeIcon icon={faChevronDown} />
          <span> {name}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {dataList.filter(data => data).map((data) => renderDropdownItem(data))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  else {
    return (
      <Dropdown>
        <Dropdown.Toggle>
          <FontAwesomeIcon icon={faChevronDown} />
          <span> Loading...</span>
        </Dropdown.Toggle>
      </Dropdown>
    )
  }
}

const renderDropdownItem = (category: Category | PositionType): JSX.Element => {
  return (
    <Dropdown.Item key={category.id}>{category.name}</Dropdown.Item>
  )
}
