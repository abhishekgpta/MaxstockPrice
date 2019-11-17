import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const localizer = momentLocalizer(moment)

const customDayPropGetter = (date,props) => {
    if( moment(date,"YYYY-MM-DD").isSameOrAfter(props.buyDate,"YYYY-MM-DD") &&
    moment(date,"YYYY-MM-DD").isSameOrBefore(props.sellDate,"YYYY-MM-DD")){
        return {
            className: 'calender__container--highlight',
        }
    }
}
class RightPanel extends React.Component {

    render() {
        return (<div className="calender__container--block">
            {
                <div className={this.props.loader ? "card__container--blur card__container" : " card__container"}>
                    <Calendar
                        selectable
                        localizer={localizer}
                        // allDayAccessor={(ee) => console.log(ee)}
                        getNow={() => new Date(this.props.startDate)}
                        titleAccessor={(object) => { return `price: ${object.price}`; }}
                        events={this.props.events}
                        views={['month']}
                        defaultView={Views.MONTH}
                        // defaultDate={new Date(this.props.startDate)}
                        // date={new Date(this.props.startDate)}
                        onView={() => { }}
                        scrollToTime={new Date(1970, 1, 1, 6)}
                        // startAccessor={(obj)=>{
                        //     console.log(obj);
                        //     return
                        // }}
                        
                        dayPropGetter={(date)=>customDayPropGetter(date,this.props)}
                        onSelectEvent={this.props.handleDelete}
                        onSelectSlot={this.props.handleSelect}
                    />
                </div>
            }
        </div>);
    }
}
export default RightPanel;