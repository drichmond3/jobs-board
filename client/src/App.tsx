import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Home from './home';
import JobBoard from "./job-board";
import { useLoadCategories, useLoadJobPostings, useLoadPositionTypes } from './service/service';
import { Category } from "./service/JobTypes";
var Scroll = require('react-scroll');
var Element = Scroll.Element;
var scroller = Scroll.scroller;

const MAX_HOME_CATEGORIES = 5;

function App() {
  let [category, setCategory] = useState<Category | null>(null);
  let { data: categories, error: loadCategoriesError } = useLoadCategories();
  let { data: positionTypes, error: loadPositionsError } = useLoadPositionTypes();
  let { data: jobPostings, error: loadJobPostingsError } = useLoadJobPostings(1, 10);

  const scrollToJobBoard = () => {
    scroller.scrollTo('jobBoardScrollElement', {
      duration: 500,
      smooth: true,
    });

  }

  const setCategoryAndScroll = (cat: Category | null) => {
    setCategory(cat);
    scrollToJobBoard();
  }

  categories = categories == null ? Array(MAX_HOME_CATEGORIES).fill(null) : categories;

  let errors = [loadCategoriesError];
  return (
    <>
      {renderErrors(errors)}
      <main>
        <div className="app-page">
          <Home categories={categories.slice(0, MAX_HOME_CATEGORIES)} changeCategory={setCategoryAndScroll} />
        </div>
        <Element name="jobBoardScrollElement">
          <div className="app-page">
            <JobBoard categories={categories} jobs={jobPostings} positionTypes={positionTypes} />
          </div>
        </Element>
      </main >
    </>
  );
}

const renderErrors = (errors: (Error | null)[]) => {
  return errors.map((error: Error | null, id: number) => {
    if (error == null) {
      return <></>
    }

    const message = error.message ? error.message : "Unexpected Error";
    return (
      <Alert key={id} variant="danger">{message}</Alert>
    )
  })
}

export default App;

