import React, { Component, PropTypes } from 'react';

export default class List extends Component {
  render() {
    const {
      isFetching, nextToken, pageCount,
      items, renderItem, loadingLabel
    } = this.props;

    const isEmpty = items.length === 0;
    if (isEmpty && isFetching) {
      return <h2><i>{loadingLabel}</i></h2>;
    }

    const isLastPage = !nextToken;
    if (isEmpty && isLastPage) {
      return <h1><i>Nothing here!</i></h1>;
    }

    return (
      <div>
        {items.map(renderItem)}
        {pageCount > 0 && !isLastPage && this.renderLoadMore()}
      </div>
    );
  }

  renderLoadMore() {
    const { isFetching, loadMore } = this.props;
    return (
      <button style={{ fontSize: '150%' }}
              onClick={loadMore}
              disabled={isFetching}>
        {isFetching ? 'Loading...' : 'Load More'}
      </button>
    );
  }
}

List.propTypes = {
  loadingLabel: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
  nextToken: PropTypes.string
};

List.defaultProps = {
  isFetching: true,
  loadingLabel: 'Loading...'
};
