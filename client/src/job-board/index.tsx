import React, { useState, useEffect, useContext } from "react";

import BoardContent from "./board-content"
import { SearchContext, ContextValue } from "../service/search-context";
import { Category, PositionType, JobPosting } from "../service/JobTypes";
import Logo from "../images/Logo.svg";
import "./job-board.css";

interface Props {
  categories: Category[] | null,
  positionTypes: PositionType[] | null,
  back: () => void,
  loadCategoriesError: Error | null,
  loadPositionTypesError: Error | null,
  forceCategoriesReload: () => void,
  forcePositionTypesReload: () => void
}

export default function JobBoard(props: Props) {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const { selectedCategories, selectedPositionTypes, tmpSearchText } = useContext<ContextValue>(SearchContext);
  useEffect(() => setSelectedJob(null), [selectedCategories, selectedPositionTypes, tmpSearchText]);
  return (
    <div className="job-board-container">
      {renderHeader(props.back)}
      <div className="job-board-content">
        <BoardContent {...props} selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
      </div>
    </div>
  )
}

const renderHeader = (onClick: () => void) => {
  return (
    <div className="job-board-header user-select-none">
      <div>
        <img src={Logo} alt="mock jobs board logo" className="d-none d-sm-inline" onClick={onClick} />
        <div className="job-board-header-text" onClick={onClick}>
          <h1>Mock Jobs Board</h1>
        </div>
      </div>
    </div>
  )
}