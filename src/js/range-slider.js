import { refs } from './refs';
import { correctValue, correctValueAfterChange } from './correctValues';

const settings = {
  fill: '#FF5400',
  background: '#d7dcdf',
};

function updateRange() {
  Array.prototype.forEach.call( refs.sliders, ( slider ) => {
    slider.querySelector( 'input' ).addEventListener( 'input', ( event ) => {
      const inputPercent = event.target.parentNode.querySelector( '.enter-percent' );

      let value = event.target.value;
      if ( 'correctValue' in inputPercent.dataset ) {
        if ( 'correctSymbol' in inputPercent.dataset && inputPercent.dataset.correctSymbol === '/' ) {
          // value = value * inputPercent.dataset.correctValue;
        } else {
          value = value / inputPercent.dataset.correctValue;
        }
      }

      // else if ( 'dataThousand' in event.target.dataset ) {
      //   value = parseInt( ( value / event.target.dataset.dataThousand ).toString() ) + 'K';
      // }: 'dataThousand' in event.target.dataset ? 'K'
      inputPercent.value = value + ( 'percentage' in event.target.dataset ? '%' : '' );
      applyFill( event.target );
    } );
    applyFill( slider.querySelector( 'input' ) );
  } );
}

updateRange();

function applyFill( slider ) {
  const percentage = 100 * ( slider.value - slider.min ) / ( slider.max - slider.min );
  const bg = `linear-gradient(90deg, ${ settings.fill } ${ percentage }%, ${ settings.background } ${ percentage + 0.1 }%)`;
  slider.style.background = bg;
}

export { applyFill, updateRange };