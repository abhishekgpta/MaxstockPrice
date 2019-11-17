import React from 'react';

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'

class LeftPanel extends React.Component {
    
    render() {
        let options = {
            
            
            title: {
                text: 'Yes Bank Stock Price'
            },
            rangeSelector:{
                enabled: false,
                inputEnabled: false,
            },
            series: [{
                name: 'YES Bank',
                data: this.props.data,
                pointStart: this.props.startDate
            }],
            navigator: {
                enabled: false
            },
            scrollbar:{
                enabled: false
            }
        }
        return (<div className="leftpanel__range--block" >
            
            <div className="leftpanel__range__maxProfit--block">
            {
                this.props.loader? "loading": <div style={{
                    display:"flex",
                    justifyContent:"space-around"
                }}>
                <p>MaxProfit: {this.props.maxProfit*10}</p>
                <p>Buy date :{this.props.buyDate}</p>
                <p>Sell date :{this.props.sellDate}</p>
                </div>
            }

            </div>
            <div className="leftpanel__range__chart--block">
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={options}
            />
            </div>
            
            <div className="leftpanel__range">
                <label htmlFor="start">Start date:</label>
                <input type="date" id="start" name="startDate"
                    value={this.props.startDate}
                    onChange={this.props.handleDateRange}
                />
                <label htmlFor="start">End date:</label>
                <input type="date" id="start" name="endDate"
                    value={this.props.endDate}
                    onChange={this.props.handleDateRange}
                />
            </div>
        </div>);
    }
}
export default LeftPanel;