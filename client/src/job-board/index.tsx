import React, { useState, useEffect, useContext, useCallback } from "react";

import BoardContent from "./board-content"
import { SearchContext, ContextValue } from "../service/search-context";
import { Category, PositionType, JobPosting, JobPostingDetails } from "../service/JobTypes";
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
  const [detailsJob, setRawDetailsJob] = useState<JobPosting | null>(null);
  const { selectedCategories, selectedPositionTypes, tmpSearchText } = useContext<ContextValue>(SearchContext);
  const [isShowApplication, setShowApplication] = useState<boolean>(false);
  const setDetailsJob = useCallback((job: JobPosting | null) => { setSelectedJob(job); setRawDetailsJob(job) }, []);
  useEffect(() => {
    setSelectedJob(null);
    setRawDetailsJob(null);
    setShowApplication(false);
  }, [selectedCategories, selectedPositionTypes, tmpSearchText]);
  const showApplication = useCallback(() => setShowApplication(true), []);

  const containerClass = "job-board-content" + (Boolean(selectedJob) ? " job-selected" : "");
  let back = () => {
    if (Boolean(selectedJob)) {
      setSelectedJob(null);
      setShowApplication(false);
    }
    else {
      props.back();
    }
  }



  const showAppClass = isShowApplication ? "application-ready" : "";
  return (
    <div className={`job-board-container ${showAppClass}`}>
      {renderHeader(Boolean(selectedJob), back)}
      <div className={containerClass}>
        <BoardContent {...props} selectedJob={selectedJob} setSelectedJob={setSelectedJob} back={back} showApplication={showApplication} setSelectedDetailsJob={setDetailsJob} detailsJob={detailsJob} />
      </div>
    </div >
  )
}

const renderHeader = (isSelectedJob: boolean, onClick: () => void) => {
  const headerClass = "job-board-header user-select-none " + ((isSelectedJob) ? "job-selected" : "");
  return (
    <div className={headerClass}>
      <div>
        <img src={Logo} alt="mock jobs board logo" className="d-none d-sm-inline" onClick={onClick} />
        <div className="job-board-header-text" onClick={onClick}>
          <h1>Mock Jobs Board</h1>
        </div>
      </div>
    </div>
  )
}