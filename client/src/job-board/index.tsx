import React from "react";

import { Category, JobPosting, PositionType } from "../service/JobTypes";
import Logo from "../images/Logo.svg";
import "./job-board.css";

interface Props {
  categories: Category[] | null,
  jobs: JobPosting[] | null,
  positionTypes: PositionType[] | null,

}

export default function JobBoard(props: Props) {
  return (
    <div className="job-board-container">
      {renderHeader()}
    </div>
  )
}

const renderHeader = () => {
  return (
    <div className="job-board-header">
      <div>
        <img src={Logo} />
        <h1>Mock Jobs Board</h1>
      </div>
      <hr />
    </div>
  )
}