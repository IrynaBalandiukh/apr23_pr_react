import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { ProductTable } from './componets/ProductTable/ProductTable';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    categoryFromServer => categoryFromServer.id === product.categoryId,
  );
  const user = usersFromServer.find(
    userFromServer => userFromServer.id === category.ownerId,
  );

  return ({
    ...product,
    category,
    user,
  });
});

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  const filteredByUser = products.filter((product) => {
    if (!selectedUserId) {
      return product;
    }

    return product.user.id === selectedUserId;
  });

  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const filteredByCategory = filteredByUser.filter((product) => {
    if (!selectedCategoryId) {
      return product;
    }

    return product.category.id === selectedCategoryId;
  });

  const formattedQuery = query.toLowerCase().trim();

  const visibleProducts = filteredByCategory.filter((product) => {
    const productName = product.name.toLowerCase();

    return productName.includes(formattedQuery);
  });

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleDelete = () => {
    setQuery('');
  };

  const handleReset = () => {
    setQuery('');
    setSelectedUserId(null);
    setSelectedCategoryId(null);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUserId(null)}
                className={cn({ 'is-active': selectedUserId === null })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': user.id === selectedUserId })}
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={handleChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleDelete}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedCategoryId(null)}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': category.id === selectedCategoryId,
                  })}
                  href="#/"
                  key={category.id}
                  onClick={() => handleSelectCategory(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : <ProductTable products={visibleProducts} />
          }
        </div>
      </div>
    </div>
  );
};
