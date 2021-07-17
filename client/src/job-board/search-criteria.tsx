import React from "react";
import { Card } from "react-bootstrap";

import { JobPosting, Category, PositionType } from "../service/JobTypes";

interface Props {
  categories: Category[] | null,
  positionTypes: PositionType[] | null
}

export default function SearchCriteria(props: Props) {
  return (
    <div className="job-board-search-container h-100-lg">
      <div className="job-board-search-content">
        <Card border="dark">
          <form className="text-center pt-3">
            <input placeholder="Search..."></input>
          </form>
        </Card>
      </div>
    </div>
  );
}