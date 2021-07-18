import React, { ReactElement } from "react";
import { Card, Col, Container, Row, Dropdown, CloseButton } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons'

import { Category, PositionType } from "../service/JobTypes";
import { isNull } from "util";

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
            <Container fluid>
              <Row>
                <Col lg={12} xs={12} className="p-0">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input placeholder="Search..."></input>
                  <div className="search-info d-none d-sm-block">
                    <div>{props.resultCount} results</div>
                  </div>
                </Col>
                <Col lg={12} xs={6} id="job-board-category-dropdown">
                  {renderDropdown("Categories", props.categories, props.selectedCategories)}
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
          <Card key={data.id} className="d-none d-lg-inline job-board-search-selections">
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

const renderDropdown = (name: string, dataList: Category[] | PositionType[] | null, selectedData?: Category[] | PositionType[] | null): JSX.Element => {

  if (dataList && dataList.find(data => data)) {
    return (
      <Dropdown>
        <Dropdown.Toggle>
          <FontAwesomeIcon icon={faChevronDown} />
          <span> {name}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {dataList.filter(data => data).map((data) => renderDropdownItem(data, selectedData))}
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

const renderDropdownItem = (category: Category | PositionType, selectedItems: Category[] | PositionType[] | null | undefined): JSX.Element => {
  let selected: boolean = false;
  if (selectedItems) {
    selected = Boolean(selectedItems.find(item => item.id === category.id));
  }
  return (
    <Dropdown.Item active={selected} key={category.id}>{selected && <FontAwesomeIcon icon={faTimes} />} {category.name}</Dropdown.Item>
  )
}
