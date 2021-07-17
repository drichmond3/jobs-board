import React from "react";
import { Button } from "react-bootstrap";

import { Category } from "./JobTypes";
import "./home.css";

interface Props {
  categories: Category[],
  changeCategory: (category: Category) => void
}

export default function Home(props: Props) {

  return (
    <div className="home-container">
      <header className="home-header">
        <div>
          <h1>Mock Jobs Board</h1>
          <p>Your next career move is just a few clicks away</p>
        </div>
      </header>
      <div>
        <button>Start</button>
      </div>
      <div className="home-category-container">
        {props.categories.map((category, index) => renderCategory(index, category, props.changeCategory))}
      </div>
    </div>
  )
}

const renderCategory = (key: number, category: Category, changeCategory: Props["changeCategory"]) => {
  let callback = (category == null) ? () => { } : () => changeCategory(category);
  let content = (category == null) ? "..." : category.name;
  return (
    <Button key={key} variant="outline-secondary" onClick={callback}>{content}</Button>
  )
}