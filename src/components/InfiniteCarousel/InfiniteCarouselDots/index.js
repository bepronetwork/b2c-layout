import React from 'react';
import PropTypes from 'prop-types';
import '../index.css';

function InfiniteCarouselDots({ carouselName, numberOfDots, activePage, onClick }) {
  const dots = [];
  let classNameIcon;
  let dotName;

  for (let i = 0; i < numberOfDots; i += 1) {
    classNameIcon = `InfiniteCarouselDotIcon ${
      i === activePage ? 'InfiniteCarouselDotActiveIcon' : ''
    }`;
    dotName = `${carouselName}-dots-${i}`;
    dots.push(
      <button
        name={dotName}
        data-testid={dotName}
        styleName="InfiniteCarouselDot"
        data-index={i}
        key={i + 1}
        onClick={onClick}
        type="button"
      >
        <i styleName={classNameIcon} />
      </button>
    )
  }

  return (
    <ul data-testid={`${carouselName}-dots`} styleName="InfiniteCarouselDots">
      {dots}
    </ul>
  );
}

InfiniteCarouselDots.propTypes = {
  carouselName: PropTypes.string.isRequired,
  numberOfDots: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default InfiniteCarouselDots;
