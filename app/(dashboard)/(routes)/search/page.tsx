"use client";
import { Fragment, Suspense } from "react";
import Header from "../../_components/_common/Header";

import SearchFeed from "../../_components/SearchFeed";
import SearchForm from "../../_components/SearchForms";

const Search = () => {
  return (
    <Fragment>
      <Header label="Search" showBackArrow ={true} >
        <Suspense fallback={<div>Loading search form...</div>}>
          <SearchForm />
        </Suspense>
      </Header>
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchFeed />
      </Suspense>
    </Fragment>
  );
};

export default Search;
