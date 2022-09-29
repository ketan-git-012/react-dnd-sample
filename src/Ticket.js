import React from "react";

const Ticket = (props) => {
    const { ticket_id, name, profile } = props;
    return ( 
        <div className="ticket">
            <div className="ticket-data">
                <span className="ticket-id">{ticket_id}</span>
                <span className="name">{name}</span>
                <button className="button" onClick={()=> {console.log('ticket id: ', ticket_id)}}>View</button>
            </div>
            
            <div className="ticket-img">
                    <img src={profile} className="img" alt="profile"/>
            </div>
        </div>
     );
}

export default Ticket;