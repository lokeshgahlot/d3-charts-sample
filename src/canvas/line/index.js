import * as d3 from 'd3';




export default (selector) => {
  const container = document.querySelector(selector);
  const canvas = container.querySelector('canvas');
  const context = canvas.getContext('2d');

  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  };

  const width = canvas.width - margin.left - margin.right;
  const height = canvas.height - margin.top - margin.bottom;

  const parseTime = d3.timeParse('%d-%b-%y');

  const x = d3.scaleTime()
    .range([0, width]);
  const y = d3.scaleLinear()
    .range([height, 0]);

  const line =d3.line()
    .x(d=>x(d.date))
    .y(d=>y(d.close))
    .curve(d3.curveStep)
    .context(context);

  context.translate(margin.left, margin.top);


  const xAxis = ()=> {
    const tickCount = 10;
    const tickSize = 6;
    const ticks = x.ticks(tickCount);
    const tickFormat = x.tickFormat();

    context.beginPath();
    ticks.forEach(d => {
      context.moveTo(x(d), height);
      context.lineTo(x(d), height+tickSize)
    });

    context.strokeStyle = 'black';
    context.stroke();

    context.textAlign = 'center';
    context.textBaseline = 'top';

    tick.forEach(d=> {
      context.fillText(tickFormar(d), x(d), height+tickSize);
    })
  }

  const yAxis = () => {

  }

  d3.tsv('data/canvas-line-data.tsv',
    d => {
      d.date = parseTime(d.date);
      d.close = +d.close;
      return d;
    },(error, data)=> {
      if(error) throw error;

      x.domain(d3.extent(data, d => d.date));
      y.domain(d3.extent(data, d => d.close));

      xAxis();
      yAxis();

      context.beginPath();
      line(data);
      context.lineWidth = 1.5;
      context.strokeStyle = 'steelblue';
      context.stroke();


    });
}
