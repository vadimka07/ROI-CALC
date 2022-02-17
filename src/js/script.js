import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { calculateROI } from './api.service';
import './formaction';
import './range-slider';
import { fillForm } from "./formaction";
import { refs } from "./refs";

Chart.register( ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle );
Chart.register( ChartDataLabels );


const toggleArrow = document.querySelector( '.toggle-arrow' );
const openPopupInfoRangeList = document.querySelector( '.range-list' );
const openPopupInfoAttackPrevented = document.querySelector( '.attacks-prevented__list' );


if ( toggleArrow ) {
  toggleArrow.addEventListener( 'click', () => {
    document.querySelector( '.full-report' ).classList.toggle( 'open' );
  } );
}


if ( openPopupInfoRangeList ) {
  openPopupInfoRangeList.addEventListener( 'click', ( e ) => {
    const iconInfo = document.querySelectorAll( '.range-list__icon' );
    iconInfo.forEach( ( item ) => {
      if ( e.target === item ) {
        const popupInfo = e.target.parentNode.querySelector( '.range-list__pop-up' );
        popupInfo.classList.add( 'open' );

        function listenerPopup( e ) {
          if ( e.target !== popupInfo ) {
            popupInfo.classList.remove( 'open' );
            openPopupInfoRangeList.removeEventListener( 'click', listenerPopup );
          }
        }

        openPopupInfoRangeList.addEventListener( 'click', listenerPopup );
      }
    } );
  } );
}

if ( openPopupInfoAttackPrevented ) {
  openPopupInfoAttackPrevented.addEventListener( 'click', ( e ) => {
    const iconInfo = document.querySelectorAll( '.attacks-prevented__icon' );
    iconInfo.forEach( ( item ) => {
      if ( e.target === item ) {
        const popupInfo = e.target.parentNode.querySelector( '.attacks-prevented__pop-up' );
        popupInfo.classList.add( 'open' );

        function listenerPopup( e ) {
          if ( e.target !== popupInfo ) {
            popupInfo.classList.remove( 'open' );
            openPopupInfoAttackPrevented.removeEventListener( 'click', listenerPopup );
          }
        }

        openPopupInfoAttackPrevented.addEventListener( 'click', listenerPopup );
      }
    } );
  } );
}

if ( refs.savePDFBtn ) {
  refs.savePDFBtn.addEventListener( 'click', () => {
    window.print();
  } )
}

// const barDiagram = document.getElementById( 'myChart' );
// const circleDiagram = document.getElementById( 'myChart2' );
// if ( barDiagram ) {
//   const data = fillForm();
//   new Chart( barDiagram, {
//     type: 'bar',
//     data: {
//       labels: ['Year 1', 'Year 2', 'Year 3'],
//       datasets: [
//         {
//           label: 'Savings',
//           data: [1.392, 2.787, 4.182],
//           backgroundColor: [
//             '#ff4500',
//           ],
//         },
//         {
//           label: 'Costs',
//           data: [-0.392, -0.787, -1.182],
//           backgroundColor: [
//             '#13132B',
//
//           ],
//
//         },
//         {
//           type: 'line',
//           label: 'Cumulative savings',
//           data: [data.CumulativeSaving.first_year, data.CumulativeSaving.second_year, data.CumulativeSaving.third_year],
//           backgroundColor: [
//             '#979797',
//           ],
//           datalabels: {
//             display: true,
//             color: '#FF5400',
//             align: 'top',
//             formatter: function ( value ) {
//               return '$' + value;
//             },
//           },
//         },
//
//       ],
//     },
//     options: {
//       title: {
//         display: true,
//         text: 'ROI  - Annual Breakdown\n',
//         position: 'top',
//         fontColor: 'red',
//       },
//       scales: {
//         x: {
//           stacked: true,
//           // display: false,
//           grid: {
//             display: false,
//           },
//         },
//         y: {
//           stacked: true,
//
//           grid: {
//             display: true,
//             drawBorder: false,
//             color: function ( context ) {
//               if ( context.tick.value === 0 ) {
//                 return '#4F4D5C';
//               }
//             },
//           },
//           ticks: {
//             callback: function ( value ) {
//               return '$' + value + 'k';
//             },
//           },
//
//         },
//
//       },
//       plugins: {
//         title: {
//           display: true,
//           text: 'ROI  - Annual Breakdown\n',
//           position: 'top',
//           color: '#FF5400',
//           padding: 40,
//           align: 'start',
//           font: {
//             size: 15,
//             weight: 'bold',
//           },
//         },
//         subtitle: {
//           display: true,
//           text: 'Thousands',
//           color: '#4F4D5C',
//           align: 'start',
//           padding: 20,
//           font: {
//             size: 15,
//             weight: 'bold',
//           },
//         },
//         legend: {
//           labels: {
//             usePointStyle: true,
//             padding: 50,
//           },
//
//           position: 'bottom',
//         },
//         tooltip: {
//           enabled: false,
//           position: 'nearest',
//         },
//         datalabels: {
//           display: false,
//         },
//       },
//       maxBarThickness: 64,
//       minBarLength: 10,
//     },
//   } );
// }
//
// if ( circleDiagram ) {
//   const myChart2 = new Chart( circleDiagram, {
//     type: 'doughnut',
//     data: {
//       labels: [
//         'Threat reduction savings',
//         'SOC-related savings',
//       ],
//       datasets: [{
//         label: 'My First Dataset',
//         data: [83, 17],
//         backgroundColor: [
//           '#000033',
//           '#FF5400',
//         ],
//         // hoverOffset: 4,
//       }],
//     },
//     options: {
//       plugins: {
//         title: {
//           display: true,
//           text: 'ROI Savings - by Type of Saving\n',
//           position: 'top',
//           color: '#FF5400',
//           align: 'start',
//           padding: 40,
//           font: {
//             size: 15,
//             weight: 'bold',
//           },
//         },
//         legend: {
//           labels: {
//             usePointStyle: true,
//             padding: 20,
//           },
//           fullSize: true,
//           position: 'bottom',
//         },
//         tooltip: {
//           enabled: false,
//           position: 'nearest',
//         },
//         datalabels: {
//           color: '#ffffff',
//         },
//       },
//       cutout: '80%',
//     },
//   } );
// }

