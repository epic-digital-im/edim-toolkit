/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import FullCalendar from "@fullcalendar/react/dist/main.cjs"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import momentPlugin from '@fullcalendar/moment';

function EventCalendar(props) {
  const { calendarData, initialDate, eventClick } = props;
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      initialDate={initialDate}
      contentHeight="600"
      events={calendarData}
      editable={true}
      minHeight="400px"
      height="100%"
      slotWidth={10}
      customIcons={false}
      eventClick={eventClick}
      headerToolbar={{
        start: 'title', // will normally be on the left. if RTL, will be on the right
        center: '',
        end: 'today prevYear,prev,next,nextYear' // will normally be on the right. if RTL, will be on the left
      }}
    />
  );
}

export default EventCalendar;
