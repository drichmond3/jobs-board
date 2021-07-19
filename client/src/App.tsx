import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Home from './home';
import JobBoard from "./job-board";
import { useLoadCategories, useLoadJobPostings, useLoadPositionTypes } from './service/service';
import { Category, PositionType } from "./service/JobTypes";
var Scroll = require('react-scroll');
var Element = Scroll.Element;
var scroller = Scroll.scroller;

const MAX_HOME_CATEGORIES = 5;
const MAX_RESULTS_PER_PAGE = 15;

function App() {
  //TODO Extract state into a context.
  let [selectedCategories, setSelectedCategories] = useState<Category[] | null>(null);
  let [selectedPositionTypes, setSelectedPositionTypes] = useState<PositionType[] | null>(null);
  let { data: categories, error: loadCategoriesError } = useLoadCategories();
  let { data: positionTypes, error: loadPositionsError } = useLoadPositionTypes();
  let { data: jobPostings, error: loadJobPostingsError, headers: jobPostingsHeader, loading: isLoadingJobs } = useLoadJobPostings(selectedCategories, selectedPositionTypes, 1, MAX_RESULTS_PER_PAGE);

  const scrollToElementId = (elementId: string) => {
    scroller.scrollTo(elementId, {
      duration: 500,
      smooth: true,
    });
  }

  interface Unique {
    id: number
  }

  const toggle = function <T extends Unique>(entry: T | null, list: T[] | null): (T[] | null) {
    if (entry == null) {
      return null;
    }
    if (!(list?.find(current => current.id === entry.id))) {
      return (list == null) ? [entry] : [...list, entry];
    }
    else {
      let response = [] as T[];
      list.forEach((existingEntry: T) => {
        if (existingEntry.id !== entry.id) {
          response.push(existingEntry);
        }
      });
      return response;
    }
  }

  const toggleCategory = (entry: Category | null) => {
    let updatedCategories = toggle(entry, selectedCategories);
    setSelectedCategories(updatedCategories);
  }

  const togglePositionType = (entry: PositionType | null) => {
    let updatedPositionTypes = toggle(entry, selectedPositionTypes);
    setSelectedPositionTypes(updatedPositionTypes);
  }

  const addCategoryAndScroll = (cat: Category | null) => {
    if (cat === null) {
      setSelectedCategories(null);
    }
    else {
      if (!(selectedCategories?.find(current => current.id === cat.id))) {
        let updatedSelectedCategories = selectedCategories == null ? [cat] : [...selectedCategories, cat];
        setSelectedCategories(updatedSelectedCategories);
      }
    }
    setSelectedPositionTypes(null);
    scrollToElementId("jobBoardScrollElement");
  }

  const scrollToTop = () => scrollToElementId("appPageScrollElement");

  categories = categories == null ? Array(MAX_HOME_CATEGORIES).fill(null) : categories;

  let searchResultCount = jobPostingsHeader?.get("X-Total-Count") || 0;
  searchResultCount = Number.parseInt(searchResultCount + "");

  let errors = [loadCategoriesError];
  return (
    <>
      {renderErrors(errors)}
      <main>
        <Element name="appPageScrollElement">
          <div className="app-page">
            <Home categories={categories.slice(0, MAX_HOME_CATEGORIES)} changeCategory={addCategoryAndScroll} />
          </div>
        </Element>
        <Element name="jobBoardScrollElement">
          <div className="app-page">
            <JobBoard
              categories={categories}
              jobs={jobPostings}
              positionTypes={positionTypes}
              back={scrollToTop}
              resultCount={searchResultCount}
              selectedCategories={selectedCategories}
              selectedPositionTypes={selectedPositionTypes}
              toggleCategory={toggleCategory}
              togglePositionType={togglePositionType}
              isLoadingJobs={isLoadingJobs} />
          </div>
        </Element>
      </main >
    </>
  );
}

const renderErrors = (errors: (Error | null)[]) => {
  return errors.map((error: Error | null, id: number) => {
    if (error == null) {
      return null;
    }
    const message = error.message ? error.message : "Unexpected Error";
    return (
      <Alert key={id} variant="danger">{message}</Alert>
    )
  }).filter(error => Boolean(error))
}

export default App;

