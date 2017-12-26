//https://www.youtube.com/watch?v=Oz3U38oOcNg&t=1302s
import './brush.scss'
import * as d3 from 'd3';
import crossfilter from 'crossfilter';

import barChart from './reusable-charts/bar';
import timeSeriesChart from './reusable-charts/timeline';


export default (selector) => {
  const timelineChart = timeSeriesChart()
    .width(900)
    .x(d => d.key)
    .y(d => d.value);

  const carBarChart = barChart()
    .width(300)
    .x(d => d.key)
    .y(d => d.value);

  const gatesBarChart = barChart()
    .width(700)
    .x(d => d.key)
    .y(d => d.value);
  const timeFormat = d3.timeParse('%Y-%m-%d %H:%M:%S');

  d3.csv('./data/brush.csv', d => {
    d.Timestamp = timeFormat(d.Timestamp);
    return d;
  },
  (error, data) => {
    if(error) throw error;

    const csData = crossfilter(data);
    csData.dimTime = csData.dimension(d=>d.Timestamp);
    csData.dimGates = csData.dimension(d=>d['gate-name']);
    csData.dimCars = csData.dimension(d=>d['car-type']);

    csData.timeHours = csData.dimTime.group(d3.timeHour);
    csData.gates = csData.dimGates.group();
    csData.cars = csData.dimCars.group();

    carBarChart.onMouseOver(d => {
      csData.dimCars.filter(d.key);
      update();
    }).onMouseOut(_=> {
      csData.dimCars.filterAll();
      update();
    });

    gatesBarChart.onMouseOver(d => {
      csData.dimGates.filter(d.key);
      update();
    }).onMouseOut(_=> {
      csData.dimGates.filterAll();
      update();
    });

    timelineChart.onBrushed((selected)=> {
      console.log('selected', selected);
      csData.dimTime.filter(selected);
      update();
    });

    const update = () => {
      d3.selectAll('#timeline')
        .datum(csData.timeHours.all())
        .call(timelineChart);

      d3.select('#cartypes')
        .datum(csData.cars.all())
        .call(carBarChart);

      d3.select('#gatenames')
        .datum(csData.gates.all())
        .call(gatesBarChart)
    }

    update(csData);
  });
}
