import React, { ReactElement } from "react";
import { Card, Col, Container, Row, Dropdown, CloseButton } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons'

import { Category, PositionType } from "../service/JobTypes";

interface Props {
  categories: Category[] | null,
  positionTypes: PositionType[] | null,
  resultCount: number,
  selectedCategories: Category[] | null,
  selectedPositionTypes: PositionType[] | null,
  searchText: string,
  setSearchText: (text: string) => void,
  toggleCategory: (category: Category) => void,
  togglePositionType: (positionType: PositionType) => void
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
                  <input placeholder="Search..." value={props.searchText} onChange={(e) => props.setSearchText(e.target.value)}></input>
                  <div className="search-info d-none d-sm-block">
                    <div>{props.resultCount} results</div>
                  </div>
                </Col>
                <Col lg={12} xs={6} id="job-board-category-dropdown">
                  {renderDropdown("Categories", props.categories, props.toggleCategory, props.selectedCategories)}
                  {renderSelectedItems(props.selectedCategories, props.toggleCategory)}
                </Col>
                <Col lg={12} xs={6} id="job-board-tag-dropdown">
                  {renderDropdown("Tags", props.positionTypes, props.togglePositionType, props.selectedPositionTypes)}
                  {renderSelectedItems(props.selectedPositionTypes, props.togglePositionType)}
                </Col>
              </Row>
            </Container>
          </form>
        </Card>
      </div>
    </div >
  );
}

const renderSelectedItems = (dataList: Category[] | null, toggle: (c: Renderable) => void): JSX.Element[] => {
  if (dataList) {
    return (
      dataList.map(data => {
        return (
          <Card key={data.id} className="d-none d-lg-inline job-board-search-selections user-select-none" onClick={() => toggle(data)}>
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

const renderDropdown = (name: string, dataList: Category[] | PositionType[] | null, toggle: ((c: Category) => void) | ((c: PositionType) => void), selectedData?: Category[] | PositionType[] | null): JSX.Element => {

  let textClass = (selectedData && selectedData.length) ? "text-primary" : "";
  if (dataList && dataList.find(data => data)) {
    return (
      <Dropdown>
        <Dropdown.Toggle>
          <FontAwesomeIcon icon={faChevronDown} />
          <span className={textClass}> {name}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {dataList.filter(data => data).map((data) => renderDropdownItem(data, selectedData, toggle))}
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

interface Renderable {
  id: number,
  name: string
}
const renderDropdownItem = function (category: Renderable, selectedItems: Renderable[] | null | undefined, toggle: (selected: Renderable) => void): JSX.Element {
  let selected: boolean = false;
  if (selectedItems) {
    selected = Boolean(selectedItems.find(item => item.id === category.id));
  }
  return (
    <Dropdown.Item active={selected} key={category.id} onSelect={(() => toggle(category))}>
      {selected && <FontAwesomeIcon icon={faTimes} />} {category.name}
    </Dropdown.Item>
  )
}
