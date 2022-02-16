import { refs } from './refs';
import { calculateROI } from './api.service';
import { applyFill, updateRange } from './range-slider';
import { correctValue, correctValueAfterChange } from './correctValues';
import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart,
  Decimation,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController, SubTitle,
  TimeScale,
  TimeSeriesScale,
  Title, Tooltip
} from "chart.js";
import axios from "axios";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register( ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle );
Chart.register( ChartDataLabels );

if ( refs.formFullReport ) {
  const data = fillForm();
  calculateROI( data ).then( ( response ) => {
    buildContent( response );
  } ).catch( ( error ) => {
    console.log( error )
  } );
}

function getDataForm() {
  const formData = new FormData( refs.mainForm );
  const data = {};
  formData.forEach( ( value, key ) => {
    data[key] = value;
  } );
  return data;
}

export function fillForm() {
  const dataFromSessionStorage = JSON.parse( sessionStorage.getItem( 'formData' ) );
  for ( const key in dataFromSessionStorage ) {
    if ( !!dataFromSessionStorage[key] && !!refs.mainForm.elements[key] ) {
      refs.mainForm.elements[key].value = dataFromSessionStorage[key];
    }
  }
  return dataFromSessionStorage;
}

function lockEmailVol(event) {
  const checkInputs = ['Country', 'Industry', 'NumberOfEmployees'];
  let inputValues = [];
  checkInputs.forEach(name => {
    inputValues.push(
      refs.mainForm.elements[name].value !== ''
    );
  })
  if (inputValues.every(value => value === true)) {
    refs.inputMonthlyEmailVolume.removeAttribute('readonly');
    refs.inputMonthlyEmailVolume.closest('label').style.display = 'block';
  } else {
    refs.inputMonthlyEmailVolume.setAttribute('readonly', true);
    refs.inputMonthlyEmailVolume.closest('label').style.display = 'none';
  }
}

refs.mainForm.addEventListener('input', lockEmailVol);
refs.mainForm.addEventListener('change', lockEmailVol);


refs.mainForm.addEventListener('submit', async (e) => {
  let roiFormError = document.querySelector('.roi-form__error');
  e.preventDefault();
  const data = getDataForm();
  if ( data.NumberOfEmployees > 2000000 ) {
    alert( 'Number Of Employees can\'t be more than 2 million' );
    return;
  }
  if ( data.Country === 'Country' || data.Country === 'Industry' || data.NumberOfEmployees === '' ) {
    roiFormError.style.display = 'block';
    return;
  } else {
    roiFormError.style.display = 'none';
  }
  const result = await calculateROI( data );
  buildContent( result );
  console.log( result );
} );

refs.rangeList.addEventListener( 'change', async ( e ) => {

  e.target.classList.add( 'touched' );
  const data = { ...getDataForm(), ...getRangeData() };
  if ( data.NumberOfEmployees > 2000000 ) {
    alert( 'Number Of Employees can\'t be more than 2 million' );
    return;
  }
  const result = await calculateROI( data );
  // console.log( data );

  buildContent( result );
  console.log( result );
} );

const wpcf7Elm = document.querySelector( '.hbs-form__calculator .wpcf7' );

wpcf7Elm?.addEventListener( 'wpcf7submit', function ( event ) {

  if ( event.detail.status === "mail_sent" ) {
    const data = { ...getDataForm(), ...getRangeData() };
    sessionStorage.setItem( 'formData', JSON.stringify( data ) );
    window.location.href = 'https://perception-point.io/email-security-roi-calculator2';
  }
} );

function getRangeData() {
  const data = {};
  refs.rangeList.querySelectorAll( '[type=range]' ).forEach( ( range ) => {
    if ( range.classList.contains( 'touched' ) ) {
      // let value = range.value;
      // if ( 'correctValue' in range.dataset ) {
      //   value = value / range.dataset.correctValue;
      // }
      data[range.name] = correctValueAfterChange( range );
    }
  } );
  return data;
}

function buildContent( data ) {

  refs.threeYearsROIDollars.textContent = '$' + new Intl.NumberFormat('en-EN').format(data.ThreeYearsROIDollars);
  refs.threeYearsROIPercents.textContent = data.ThreeYearsROIPercents.toFixed( 2 ) + '%';
  refs.paybackPeriodMonths.textContent = data.PaybackPeriodMonths;
  //
  refs.rangeList.querySelectorAll( '.range-slider' ).forEach( ( item ) => {

    const range = item.querySelector( '[type=range]' );
    const input = item.querySelector( '[name=enterPercent]' );
    range.value = correctValue( range, data[range.name] );
    if ('nextsymbol' in input.dataset) {
      input.value = correctValue( input, data[range.name] ).toFixed( 1 ) + input.dataset.nextsymbol;
    } else {
      input.value = correctValue( input, data[range.name] ).toFixed( 1 );
    }
  } );
  if ( refs.attacksPreventedList ) {
    function renderDataROI( listSaveData, selectorForData ) {
      const resultListData = [...listSaveData.children].map( ( element ) => {
        if ( data.hasOwnProperty( element.dataset.name ) ) {
          return data[element.dataset.name];
        }
      } );
      [...listSaveData.children].forEach( ( item, index ) => {
        item.querySelector( selectorForData ).textContent =  new Intl.NumberFormat('en-EN').format(resultListData[index]);
      } );
    }

    renderDataROI( refs.attacksPreventedList, '.attacks-prevented__count' );

    function renderDataROIMetrics() {
      const renderDataROIMetricsNetThreeYearThreatReductionSavings = document.querySelector( '[data-name=NetThreeYearThreatReductionSaving]' );
      const renderDataROIMetricsThreeYearDirectSOCRelatedSavings = document.querySelector( '[data-name=ThreeYearsSOCRelatedSavings]' );
      const renderDataROIMetricsSOCFTESaved = document.querySelector( '[data-name=SOCFTESaved]' );
      renderDataROIMetricsNetThreeYearThreatReductionSavings.querySelector( '.roi-metrics__data' ).textContent = new Intl.NumberFormat('en-EN').format(data.NetThreeYearThreatReductionSavings.third_year);
      renderDataROIMetricsThreeYearDirectSOCRelatedSavings.querySelector( '.roi-metrics__data' ).textContent = new Intl.NumberFormat('en-EN').format(data.ThreeYearDirectSOCRelatedSavings.third_year);
      renderDataROIMetricsSOCFTESaved.querySelector( '.roi-metrics__data' ).textContent = data.SOCFTESaved.toFixed( 1 );
    }

    renderDataROIMetrics();

    function renderDataSummary() {
      const renderDataThreeYearsROIDollars = document.querySelector( '[data-name=ThreeYearsROIDollars]' );
      const renderDataThreeYearsROIPercents = document.querySelector( '[data-name=ThreeYearsROIPercents]' );
      const renderDataPaybackPeriodMonths = document.querySelector( '[data-name=PaybackPeriodMonths]' );
      const renderDataTotalSavings = document.querySelector( '[data-name=TotalSavings]' );
      const renderDataTotalCostOfOwnership = document.querySelector( '[data-name=TotalCostOfOwnership]' );
      const renderDataNPV = document.querySelector( '[data-name=NPV]' );
      renderDataThreeYearsROIDollars.querySelector( '.summary__data' ).textContent = new Intl.NumberFormat('en-EN').format(data.ThreeYearsROIDollars);
      renderDataThreeYearsROIPercents.querySelector( '.summary__data' ).textContent = data.ThreeYearsROIPercents.toFixed( 2 );
      renderDataPaybackPeriodMonths.querySelector( '.summary__data' ).textContent = data.PaybackPeriodMonths;
      renderDataTotalSavings.querySelector( '.summary__data' ).textContent = new Intl.NumberFormat('en-EN').format(data.TotalSavings.third_year);
      renderDataTotalCostOfOwnership.querySelector( '.summary__data' ).textContent = new Intl.NumberFormat('en-EN').format(data.TotalCostOfOwnership.third_year);
      renderDataNPV.querySelector( '.summary__data' ).textContent = new Intl.NumberFormat('en-EN').format(data.NPV);
    }

    renderDataSummary();
  }
  const barDiagram = document.getElementById( 'myChart' );
  const circleDiagram = document.getElementById( 'myChart2' );
  if ( barDiagram ) {
    new Chart( barDiagram, {
      type: 'bar',
      data: {
        labels: ['Year 1', 'Year 2', 'Year 3'],
        datasets: [
          {
            label: 'Savings',
            data: [1.392, 2.787, 4.182],
            backgroundColor: [
              '#ff4500',
            ],
          },
          {
            label: 'Costs',
            data: [-0.392, -0.787, -1.182],
            backgroundColor: [
              '#13132B',

            ],

          },
          {
            type: 'line',
            label: 'Cumulative savings',
            data: [data.CumulativeSaving.first_year, data.CumulativeSaving.second_year, data.CumulativeSaving.third_year],
            backgroundColor: [
              '#979797',
            ],
            datalabels: {
              display: true,
              color: '#FF5400',
              align: 'top',
              formatter: function ( value ) {
                return '$' + value;
              },
            },
          },

        ],
      },
      options: {
        title: {
          display: true,
          text: 'ROI  - Annual Breakdown\n',
          position: 'top',
          fontColor: 'red',
        },
        scales: {
          x: {
            stacked: true,
            // display: false,
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true,

            grid: {
              display: true,
              drawBorder: false,
              color: function ( context ) {
                if ( context.tick.value === 0 ) {
                  return '#4F4D5C';
                }
              },
            },
            ticks: {
              callback: function ( value ) {
                return '$' + value + 'k';
              },
            },

          },

        },
        plugins: {
          title: {
            display: true,
            text: 'ROI  - Annual Breakdown\n',
            position: 'top',
            color: '#FF5400',
            padding: 40,
            align: 'start',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
          subtitle: {
            display: true,
            text: 'Thousands',
            color: '#4F4D5C',
            align: 'start',
            padding: 20,
            font: {
              size: 15,
              weight: 'bold',
            },
          },
          legend: {
            labels: {
              usePointStyle: true,
              padding: 50,
            },

            position: 'bottom',
          },
          tooltip: {
            enabled: false,
            position: 'nearest',
          },
          datalabels: {
            display: false,
          },
        },
        maxBarThickness: 64,
        minBarLength: 10,
      },
    } );
  }

  if ( circleDiagram ) {
    const myChart2 = new Chart( circleDiagram, {
      type: 'doughnut',
      data: {
        labels: [
          'Threat reduction savings',
          'SOC-related savings',
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [(data.SavingsByTypeOfThreatReduction * 100).toFixed(2), (data.SavingsBySOCReduction * 100).toFixed(2)],
          backgroundColor: [
            '#000033',
            '#FF5400',
          ],
          // hoverOffset: 4,
        }],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'ROI Savings - by Type of Saving\n',
            position: 'top',
            color: '#FF5400',
            align: 'start',
            padding: 40,
            font: {
              size: 15,
              weight: 'bold',
            },
          },
          legend: {
            labels: {
              usePointStyle: true,
              padding: 20,
            },
            fullSize: true,
            position: 'bottom',
          },
          tooltip: {
            enabled: false,
            position: 'nearest',
          },
          datalabels: {
            color: '#ffffff',
          },
        },
        cutout: '80%',
      },
    } );
  }

  updateRange();
}


export { buildContent };