import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Element, scroller } from 'react-scroll';

import Home from './home';
import JobBoard from "./job-board";
import { useLoadCategories, useLoadPositionTypes } from './service/service';
import { Category } from "./service/JobTypes";
import { SearchContext, ContextValue } from './service/search-context';
import { debounce } from 'lodash';

const MAX_HOME_CATEGORIES = 5;

interface Page {
  HOME: number,
  BOARD: number
}

function useOnResize(callback: () => void) {
  useEffect(() => {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, [callback]);
}

function App() {
  //TODO Extract state into a context.
  let { data: categories, error: loadCategoriesError, forceReload: forceCategoriesReload } = useLoadCategories();
  let { data: positionTypes, error: loadPositionTypesError, forceReload: forcePositionTypesReload } = useLoadPositionTypes();
  let { clearPositionTypes, setCategory } = useContext<ContextValue>(SearchContext);
  let [activePage, setActivePage] = useState<keyof Page>("HOME");

  let debouncedScrollToActivePage = useCallback(debounce(() => {
    if (activePage === "BOARD") {
      scrollToElementId("jobBoardScrollElement");
    }
    else {
      scrollToElementId("appPageScrollElement");
    }
  }, 300), [activePage]);

  const scrollToElementId = (elementId: string) => {
    scroller.scrollTo(elementId, {
      duration: 500,
      smooth: true,
    });
  }
  useOnResize(debouncedScrollToActivePage);


  const addCategoryAndScroll = (cat: Category | null) => {
    setCategory(cat);
    clearPositionTypes();
    scrollToBoard();
  }

  const scrollToTop = () => {
    scrollToElementId("appPageScrollElement");
    setActivePage("HOME");
  }

  const scrollToBoard = () => {
    scrollToElementId("jobBoardScrollElement");
    setActivePage("BOARD");
  }

  const topCategories = categories == null ? Array(MAX_HOME_CATEGORIES).fill(null) : categories;

  return (
    <main>
      <Element name="appPageScrollElement">
        <div className="app-page">
          <Home categories={topCategories.slice(0, MAX_HOME_CATEGORIES)} changeCategory={addCategoryAndScroll} />
        </div>
      </Element>
      <Element name="jobBoardScrollElement">
        <div className="app-page">
          <JobBoard
            categories={categories}
            positionTypes={positionTypes}
            loadCategoriesError={loadCategoriesError}
            loadPositionTypesError={loadPositionTypesError}
            forceCategoriesReload={forceCategoriesReload}
            forcePositionTypesReload={forcePositionTypesReload}
            back={scrollToTop}
          />
        </div>
      </Element>
    </main >
  );
}

export default App;

