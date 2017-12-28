import * as d3 from 'd3';
import './index.scss';
export default (selector) => {
  const svgWidth = 960;
  const svgHeight = 500;

  const margin = {
    top: 20,
    right: 20,
    bottom: 110,
    left: 40
  };

  const margin2 = {
    top: 430,
    right: 20,
    bottom: 30,
    left: 40
  };

  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;
  const height2 = svgHeight - margin2.top - margin2.bottom;

  const svg = d3.select(selector || document.body)
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  const parseDate = d3.timeParse('%b %Y');

  const x = d3.scaleTime().range([0, width]);
  const x2 = d3.scaleTime().range([0, width]);

  const y = d3.scaleLinear().range([height, 0]);
  const y2 = d3.scaleLinear().range([height2, 0]);

  const xAxis = d3.axisBottom(x);
  const xAxis2 = d3.axisBottom(x2);
  const yAxis = d3.axisLeft(y);

  const brushed = ()=> {
    const event = d3.event;
    if(event.sourceEvent && event.sourceEvent.type === 'zoom') return;
    const s = event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select('.area')
      .attr('d', area);
    focus.select('.axis--x')
      .call(xAxis);
    svg.select('.zoom')
    .call(
      zoom.transform,
      d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0)
    );
  }
  const brush = d3.brushX()
    .extent([[0,0],[width, height2]])
    .on('brush end', brushed);

  const zoomed = () => {
    const event = d3.event;
    if(event.sourceEvent && event.sourceEvent.type === 'brush') return;
    const t = event.transform;
    x.domain(t.rescaleX(x2).domain())
    focus.select('.area')
      .attr('d', area);
    focus.select('.axis--x')
      .call(xAxis);
    context.select('.brush')
      .call(brush.move, x.range().map(t.invertX, t));
  }
  const zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0,0],[width, height]])
    .extent([[0,0],[width, height]])
    .on('zoom', zoomed);

  const area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(d => x(d.date))
    .y0(height)
    .y1(d => y(d.price))

  const area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(d=>x2(d.date))
    .y0(height2)
    .y1(d=>y2(d.price));

  svg.append('defs')
    .append('clipPath')
      .attr('id', 'clip')
    .append('rect')
      .attr('width', width)
      .attr('height', height);

  const focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const context = svg.append('g')
    .attr('class', 'context')
    .attr('transform', `translate(${margin2.left},${margin2.top})`);

  d3.csv('data/sp500.csv',
    (d) =>{
      d.date = parseDate(d.date);
      d.price = +d.price;
      return d;
    },
    (error, data) => {
      if(error) throw error;

      x.domain(d3.extent(data, d => d.date));
      y.domain([0, d3.max(data, d=> d.price)]);
      x2.domain(x.domain())
      y2.domain(y.domain())

      focus.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('d', area);

      focus.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);
      focus.append('g')
        .attr('class', 'axis axis--y')
        .call(yAxis);

      context.append('path')
        .datum(data)
        .attr('class','area')
        .attr('d', area2);

      context.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${height2})`)
        .call(xAxis2);

      context.append('g')
        .attr('class', 'brush')
        .call(brush)
        .call(brush.move, x.range());

      svg.append('rect')
        .attr('class', 'zoom')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(zoom);
    }
  );



}
