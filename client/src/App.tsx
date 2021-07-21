import React, { useContext } from 'react';
import { Element, scroller } from 'react-scroll';

import Home from './home';
import JobBoard from "./job-board";
import { useLoadCategories, useLoadPositionTypes } from './service/service';
import { Category } from "./service/JobTypes";
import { SearchContext, ContextValue } from './service/search-context';

const MAX_HOME_CATEGORIES = 5;

function App() {
  //TODO Extract state into a context.
  let { data: categories, error: loadCategoriesError, forceReload: forceCategoriesReload } = useLoadCategories();
  let { data: positionTypes, error: loadPositionTypesError, forceReload: forcePositionTypesReload } = useLoadPositionTypes();
  let { clearPositionTypes, setCategory } = useContext<ContextValue>(SearchContext)
  const scrollToElementId = (elementId: string) => {
    scroller.scrollTo(elementId, {
      duration: 500,
      smooth: true,
    });
  }

  const addCategoryAndScroll = (cat: Category | null) => {
    setCategory(cat);
    clearPositionTypes();
    scrollToElementId("jobBoardScrollElement");
  }

  const scrollToTop = () => scrollToElementId("appPageScrollElement");

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

