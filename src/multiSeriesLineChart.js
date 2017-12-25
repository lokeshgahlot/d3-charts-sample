import './multiSeriesLineChart.scss';
import * as d3 from 'd3';

export default (selector) => {
  const svgWidth = 960;
  const svgHeight = 500;

  const svg = d3.select(selector || '.root')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  const margin = {
    top:20,
    right: 80,
    bottom: 30,
    left: 50
  };

  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const parseTime = d3.timeParse('%Y%m%d');

  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);
  const z = d3.scaleOrdinal(d3.schemeCategory10);

  const line = d3.line()
    .curve(d3.curveBasis)
    .x(d => x(d.date))
    .y(d => y(d.temperature));

    d3.tsv('./data/multiSeriesLineChart.tsv', (d, _, columns) => {
      d.date = parseTime(d.date);
      // converts string to number
      for (let i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
      return d;
    }, (error, data) => {
      if(error) throw error;
      var cities = data.columns.slice(1).map(id =>
        ({ id: id, values: data.map(d=>({date: d.date, temperature: d[id]}))}) );

      x.domain(d3.extent(data, (d) => d.date));
      y.domain([
        d3.min(cities, c => d3.min(c.values, d => d.temperature)),
        d3.max(cities, c => d3.max(c.values, d => d.temperature))
      ]);

      z.domain(cities.map(c => c.id));

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Temperature, ºF");

      const city = g.selectAll('.city')
        .data(cities)
        .enter()
        .append('g')
        .attr('class', 'city');

      city.append('path')
        .attr('class','line')
        .attr('d', d => line(d.values))
        .style('stroke', d => z(d.id));

    });
  }
