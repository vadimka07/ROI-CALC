function correctValue( element, value ) {
  if ( 'correctValue' in element.dataset ) {
    switch ( element.dataset.correctSymbol ) {
      case '/':
        return value / element.dataset.correctValue;
      default:
        return value * element.dataset.correctValue;
    }
  }
  return value;
}

function correctValueAfterChange( element ) {
  if ( 'correctValue' in element.dataset ) {
    const inputValue = element.parentNode.querySelector( '[name=enterPercent]' );
    switch ( element.dataset.correctSymbol ) {
      case '/':
        return element.value * element.dataset.correctValue;
      default:
        return element.value / element.dataset.correctValue;
    }
  }
  return element.value;
}

export { correctValue, correctValueAfterChange };