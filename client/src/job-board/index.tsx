import React from "react";

import BoardContent from "./board-content"
import { Category, JobPosting, PositionType } from "../service/JobTypes";
import Logo from "../images/Logo.svg";
import "./job-board.css";

interface Props {
  categories: Category[] | null,
  jobs: JobPosting[] | null,
  positionTypes: PositionType[] | null,
  back: () => void
}

export default function JobBoard(props: Props) {
  return (
    <div className="job-board-container">
      {renderHeader(props.back)}
      <div className="job-board-content">
        <BoardContent {...props} />
      </div>
    </div>
  )
}

const renderHeader = (onClick: () => void) => {
  return (
    <div className="job-board-header">
      <div>
        <img src={Logo} alt="mock jobs board logo" onClick={onClick} />
        <div className="job-board-header-text" onClick={onClick}>
          <h1>Mock Jobs Board</h1>
        </div>
      </div>
    </div>
  )
}