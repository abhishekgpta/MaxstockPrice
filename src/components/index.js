import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import RightPanel from './rightPanel';
import LeftPanel from './leftPanel';
const localizer = momentLocalizer(moment)


class MainComponent extends React.Component {
    
    constructor(...args) {
        super(...args)
        this.state = {
            events: [],
            loader: true,
            startDate:"2019-11-01",
            endDate:"2019-11-30",
            buyDate:"2019-11-01",
            sellDate:"2019-11-30"
        }
    }

    componentWillMount() {
        fetch("https://api.airtable.com/v0/apphulxC8RWCNEjvs/Table%206?view=Grid%20view", {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "Bearer keyfgowUE3cfnr3iX"
            }
        }).then((response) => response.json()).then((data) => {
            let updatedData = data.records.map((record) => {
                return {
                    start: record.fields.date,
                    end: record.fields.date,
                    title: `price: ${record.fields.price}`,
                    allDay:true,
                    ...record.fields
                }
            });
            let maxProfitObj = this.findMaxProfit(updatedData,this.state.startDate,this.state.endDate);
            this.setState({
                events: updatedData,
                loader: false,
                ...maxProfitObj
            })
        })
    }
    findMaxProfit=(data,startDate,endDate)=>{
        let maxProfit = 0,buyDate=0,sellDate=0,tempBuyDate=0;
        data = data.filter((record)=>{
            return moment(record.date,"YYYY-MM-DD").isSameOrAfter(startDate,"YYYY-MM-DD") &&
            moment(record.date,"YYYY-MM-DD").isSameOrBefore(endDate,"YYYY-MM-DD")
        });
        if(data.length > 0){

            let min = data[0].price;
            for(var i = 1; i < data.length; i++){
                let tempProfit = data[i].price-min;
                if(maxProfit < tempProfit){
                    maxProfit = tempProfit;
                    sellDate = i;
                    buyDate = tempBuyDate;
                }
                if(min > data[i].price){
                    tempBuyDate = i;
                    min = data[i].price;
                }
            }
            return {
                maxProfit,buyDate:data[buyDate].start,sellDate:data[sellDate].start
            }
        }
        return {};
    }
    handleDateRange=(e)=>{
        const name = e.target.name;
        const value = e.target.value;
        let maxProfitObj={};
        if(name==="startDate"){
            maxProfitObj = this.findMaxProfit(this.state.events,value,this.state.endDate)
        }
        if(name === "endDate"){
            maxProfitObj = this.findMaxProfit(this.state.events,this.state.startDate,value)
        }
        this.setState({
            [name]:value,
            ...maxProfitObj
        })
    }
    handleSelect = (ee) => {
        let {start,end} = ee;
        const title = window.prompt('New Event name')
        if (title) {
            const data = {
                "fields": {
                    "price": parseInt(title),
                    "date": moment(start).format("YYYY-MM-DD")
                }
            }
            axios.post("https://api.airtable.com/v0/apphulxC8RWCNEjvs/Table%206", data, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Bearer keyfgowUE3cfnr3iX"
                },
            }).then((response) => {
                if (response.data) {
                    let record = response.data.fields;
                        this.setState((prevState) => {
                            let events=[
                                {
                                    start: moment(start).format("YYYY-MM-DD"),
                                    end: moment(start).format("YYYY-MM-DD"),
                                    ...record
                                },
                                ...prevState.events,
                            ]
                            events.sort(function(a,b){
                                if(moment(a.date,"YYYY-MM-DD").isAfter(b.date)){
                                    return 1;
                                }
                                return -1;
                            })
                            let maxProfitObj = this.findMaxProfit(events,this.state.startDate,this.state.endDate);
                        return {
                            events,
                            ...maxProfitObj
                        }
                    })
                }
            })
        }
    }
    handleDelete = (event) => {
        const isdelete = window.confirm("Do you want to delete it?");
        if (isdelete) {
            axios.delete("https://api.airtable.com/v0/apphulxC8RWCNEjvs/Table%206/" + event.Id, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Bearer keyfgowUE3cfnr3iX"
                }
            }).then((response) => {
                let maxProfitObj =this.findMaxProfit(this.state.events.filter((item) => item.Id !== response.data.id),this.state.startDate,this.state.endDate)
                this.setState((prevState) => {
                    return {
                        events: prevState.events.filter((item) => item.Id !== response.data.id),
                        ...maxProfitObj
                    }
                })
            })
        }
    }
    render() {
        let chartdata = this.state.events.filter((record)=>{
            return moment(record.date,"YYYY-MM-DD").isSameOrAfter(this.state.startDate,"YYYY-MM-DD") &&
            moment(record.date,"YYYY-MM-DD").isSameOrBefore(this.state.endDate,"YYYY-MM-DD")
        }).map((record)=>{
            return [
                new Date(record.date).getTime(),
                record.price
            ]
        });
        return (<div className={this.state.loader?"main__container-flex card__container--blur":"main__container-flex"}>
            <RightPanel {...this.state} handleDelete={this.handleDelete} handleSelect={this.handleSelect}/>
            <LeftPanel {...this.state} data={chartdata} handleDateRange={this.handleDateRange}/>
        </div>);
    }
}
export default MainComponent;