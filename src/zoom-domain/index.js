import * as d3 from 'd3';
import './index.scss';

export default (selector) => {
  const svgWidth = 960;
  const svgHeight = 500;

  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const svg = d3.select(selector || document.body)
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  svg.append('defs')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);


  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const parseDate = d3.timeParse('%b %Y');

  // scale
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  //axis
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  const zoom = d3.zoom()
    .scaleExtent([1, 32])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on('zoom', zoomed);

    console.log('zoom', zoom);

  const area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(d => x(d.date))
    .y0(height)
    .y1(d => y(d.price));

  d3.csv('./data/sp500.csv', d => {
    d.date = parseDate(d.date);
    d.price = +d.price;
    return d;
  }, (error, data) => {
    if(error) throw error;
    x.domain(d3.extent(data, d => d.date));
    y.domain(d3.extent([0, d3.max(data, d => d.price)]));

    console.log('g = ', g);
    g.append('path')
      .datum(data)
      .attr('class','area')
      .attr('d', area);

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    const d0 = new Date(2003, 0, 1);
    const d1 = new Date(2004, 0, 1);

    svg.call(zoom).transition()
      .duration(1500)
      .call(zoom.transform, d3.zoomIdentity
          .scale(width / (x(d1) - x(d0)))
          .translate(-x(d0), 0));

  });

  const zoomed = _ => {
    console.log('zoomed');
    const t = d3.event.transform;
    const xt = t.rescaleX(x);
    g.select(".area").attr("d", area.x(d => xt(d.date)));
    g.select(".axis--x").call(xAxis.scale(xt));
  }



}
