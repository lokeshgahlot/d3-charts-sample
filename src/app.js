import './app.scss';
import multiSeriesLineChart from './multiSeriesLineChart';
import scalesExample from './scales';
import brush from './brush';
import zoomDomainExample from './zoom-domain';
import zoomAndBrush from './zoom-n-brush';


const App = () => {
  // multiSeriesLineChart('#multi-series-line-chart');
  // scalesExample('#scale-samples');
  // brush('#brush-sample')
  //zoomDomainExample('#zoom-domain');
  zoomAndBrush('#zoom-n-brush');
}

App();
