import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Home from './home';
import { ENDPOINTS } from './service';
import { Category } from "./home/JobTypes";

const MAX_HOME_CATEGORIES = 5;

function App() {
  let [category, setCategory] = useState<Category | null>(null);
  let [categories, setCategories] = useState<Category[]>(Array(MAX_HOME_CATEGORIES).fill(null));

  useEffect(() => {
    fetch(ENDPOINTS.getCategories).then(
      (response) => {
        if (response.ok) {
          response.json().then(
            (parsedData: Category[]) => {
              console.log("Here's the parsed data I found", parsedData);
              setCategories(parsedData);
            });
        }
      }
    ).catch((error) => {
      console.log(error);
    })
  }, []);

  return (
    <main>
      <div className="app-page">
        <Home categories={categories.slice(0, MAX_HOME_CATEGORIES)} changeCategory={setCategory} />
      </div>
      <div className="app-page">
        2nd page
      </div>
    </main>
  );
}

export default App;

