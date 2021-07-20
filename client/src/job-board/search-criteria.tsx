import React, { useContext } from "react";
import { Card, Col, Container, Row, Dropdown, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons'

import { Category, PositionType } from "../service/JobTypes";
import { SearchContext, ContextValue } from "../service/search-context";

interface Props {
  categories: Category[] | null,
  positionTypes: PositionType[] | null,
  loadCategoriesError: Error | null,
  loadPositionTypesError: Error | null,
  forceCategoriesReload: () => void,
  forcePositionTypesReload: () => void
}

export default function SearchCriteria(props: Props) {
  const { selectedCategories, selectedPositionTypes, tmpSearchText, toggleCategory, togglePositionType, updateSearchText, searchResultCount } = useContext<ContextValue>(SearchContext);
  return (
    <div id="job-board-search-container" className="job-board-search-container">
      <div className="job-board-search-content">
        <Card border="dark">
          <form className="text-center pt-3 pb-3" onSubmit={(e) => e.preventDefault()}>
            <Container fluid>
              <Row>
                <Col lg={12} xs={12} className="p-0">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input placeholder="Search..." value={tmpSearchText} onChange={(e) => updateSearchText(e.target.value)}></input>
                  <div className="search-info d-none d-sm-block">
                    <div>{searchResultCount} results</div>
                  </div>
                </Col>
                <Col lg={12} xs={6} id="job-board-category-dropdown">
                  {renderDropdown("Categories", props.categories, toggleCategory, selectedCategories, props.loadCategoriesError, props.forceCategoriesReload)}
                  {renderSelectedItems(selectedCategories, toggleCategory)}
                </Col>
                <Col lg={12} xs={6} id="job-board-tag-dropdown">
                  {renderDropdown("Tags", props.positionTypes, togglePositionType, selectedPositionTypes, props.loadPositionTypesError, props.forcePositionTypesReload)}
                  {renderSelectedItems(selectedPositionTypes, togglePositionType)}
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

const renderDropdown = (rawTitle: string, dataList: Category[] | PositionType[] | null, toggle: ((c: Category) => void) | ((c: PositionType) => void), selectedData: Category[] | PositionType[] | null, error: Error | null, retryLoad: () => void): JSX.Element => {

  const hasData = dataList && dataList.find(data => data);
  let textClass = (selectedData && selectedData.length) ? "text-primary" : "";
  let name = hasData ? rawTitle : "Loading...";
  let safeDataList = dataList || [];
  if (!error) {
    return (
      <Dropdown>
        <Dropdown.Toggle>
          <FontAwesomeIcon icon={faChevronDown} />
          <span className={textClass}> {name}</span>
        </Dropdown.Toggle>
        {hasData && (
          <Dropdown.Menu>
            {safeDataList.filter(data => data).map((data) => renderDropdownItem(data, selectedData, toggle))}
          </Dropdown.Menu>)}
      </Dropdown>
    );
  }
  else {
    return (
      <Dropdown>
        <Dropdown.Toggle>
          <FontAwesomeIcon icon={faChevronDown} />
          <span className={textClass}> {rawTitle}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Alert variant="danger" onClick={() => retryLoad()}><span>There was an issue loading available options.</span><br></br><b>Click to retry</b></Alert>
        </Dropdown.Menu>
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
