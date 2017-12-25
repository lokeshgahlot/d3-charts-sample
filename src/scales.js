//http://bl.ocks.org/d3noob/8dc93bce7e7200ab487d
import * as d3 from 'd3';

export default () => {
  const margin = {
    top: 20,
    left: 20,
    bottom: 20,
    right: 20
  };

  const svgWidth = 800;
  const svgHeight = 600;
  const svg = d3.select('.root')
    .append('svg')
    .attr('width', svgWidth + margin.left+margin.right)
    .attr('height', svgHeight + margin.top + margin.bottom);

  const scales = ['Linear', 'Ordinal', 'Point', 'Band', 'Log', 'Pow'];
  const dataSet = [1, 3, 8, 9];
  const color = d3.scaleOrdinal()
    .domain([0, scales.length])
    .range(d3.schemeCategory10);


  const draw = (scaleType, i, elements) => {
    const height = 80;
    const width = 800;
    const grp = d3.select(elements[i])
      .attr("width", width)
      .attr("height", height)
      .attr('transform', `translate(${margin.left}, ${ (margin.top + height)  * i })`);

    const scale = d3['scale' + scaleType]();

    switch(scaleType) {
      case 'Linear':
        scale.domain(d3.extent(dataSet), d => d)
          .range([0, width]);
      break;
      case 'Ordinal':
        scale.domain(dataSet)
          .range([0, 80, 60, width]);
      break;
      case 'Point':
        scale.domain(dataSet)
          .padding(2)
          .rangeRound([0, width]);
      break;

      case 'Band':
        scale.domain(dataSet)
          .padding(0.5)
          .rangeRound([0, width]);
      break;

      case 'Log':
        scale.range([0, width]);
      break;

      case 'Pow':
        scale.domain(d3.extent(dataSet), d => d)
          .exponent(0.1)
          .range([0, width]);
      break;
    }

    grp.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(scale));

    grp.append('text')
      .attr('y', 50)
      .attr('fill', (d) => color(i))
      .text(scaleType);

    grp.selectAll('.'+scaleType)
      .data(dataSet)
      .enter()
      .append('circle')
      .attr('fill', (d) => color(i))
      .attr('r', 5)
      .attr('cy', 80)
      .attr('cx', d => scale(d));

  }

  svg.selectAll('g')
    .data(scales)
    .enter()
    .append('g')
    .attr('scale-type', (d, i) => scales[i])
    .each(draw);
}
