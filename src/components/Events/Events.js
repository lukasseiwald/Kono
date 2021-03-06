import React, { Component } from 'react'
import { ref, firebaseApp } from '../../config/constants'
import './Events.css';
import Arrow from '../../images/icons/arrowright.png'
import {
  	Link
} from 'react-router-dom'


export default class Events extends Component {
	constructor() {
	    super();
	    this.state = {
	      currentItem: '',
	      username: '',
	      eventsHosted: [],
	      eventsGuest: [],
	      isLoggedIn: false,
	      tryingLogout: false,
	      profileImg: ''
	    }
	    this.tryingLogout = this.tryingLogout.bind(this);
	}

    componentDidMount = (events) => {
    	firebaseApp.auth().onAuthStateChanged((user) => {
		  	if (user) {
		  		this.setState({
		  			isLoggedIn: true,
		  			profileImg: user.photoURL
		  		});
				ref.on('value', (snapshot) => {
				    let events = snapshot.val();
				    let newStateHost = [];
				    let newStateGuests = [];
				    for (let event in events) {
				    	if(events[event].host === user.uid){
				    		newStateHost.push({
						        id: 	event,
						        title: 	events[event].title,
						        date: 	events[event].date,
						        host: 	events[event].host
					    	});  	
					    }
					    else{	
				    		let guestListRef = firebaseApp.database().ref('events/' + event + '/guests/');
				    		guestListRef.on('value', (snapshot) => {
			  					let guests = snapshot.val();
								for (let guest in guests) {
				    				if(guest === user.uid){
				    					newStateGuests.push({
								        id: 	event,
								        title: 	events[event].title,
								        date: 	events[event].date,
								        host: 	events[event].host
							    		});
				    				}
				    			}
				    		});
							    	
					    }	
					}
					this.setState({
						eventsHosted: newStateHost,
						eventsGuest: newStateGuests
					});
				});
			}
			else{
				if(!(this.state.tryingLogout)){
					this.props.history.push('/login');	
				}
			}
		});
	}

	tryingLogout(){
		this.setState({
			tryingLogout: !(this.state.tryingLogout)
		});
	}
  	
	render () {
	    return (
			<section className="display-item pagecontent">
				<div className="logoutWrapper">
				{this.state.tryingLogout &&
					<Link className="LinktoLogout" to={`/logout`} >
						<button className="clearbutton">Logout</button>
					</Link>
				}
				{this.state.isLoggedIn &&
					<div onClick={this.tryingLogout}>
						<img className="profileImg" src={this.state.profileImg} alt="Profile Pic of the current logged in User"/>
					</div>
				}			
				</div>
		 		<div className="eventsHosted">
		 			<h1 className="heading listtitle"> Events As Host </h1>
				    <ul className="eventsList">
				      {this.state.eventsHosted.map((item) => {
					        return (
								<Link className="No-Link" to={`/events/${item.id}`} key={item.id}>
						          	<li className="listentry" id={item.id} >
						          		<div className="rightalignedList">
		                                  	<p>{item.date}</p>
		                                  	<h3 className="listheading">{item.title}</h3>
		                              	</div>
							            <img src={Arrow} className="forwardArrow" alt="arrow icon"></img>
							        </li>
						        </Link>
					        )
				      	})}
				    </ul>
		  		</div>
		  		<div className="eventsGuest">
		 			<h1 className="heading listtitle"> Events As Guest </h1>
				    <ul className="eventsList">
				    	{this.state.eventsGuest.map((item) => {
					        return (
								<Link className="No-Link" to={`/events/${item.id}`} key={item.id}>
						          	<li className="listentry" id={item.id} >
						          		<div className="rightalignedList">
		                                  	<p>{item.date}</p>
		                                  	<h3 className="listheading">{item.title}</h3>
		                              	</div>
							            <img src={Arrow} className="forwardArrow" alt="arrow icon"></img>
							        </li>
						        </Link>
					        )
				      	})}
				    </ul>
		  		</div>
		  		<Link className="LinktoCE" to={`/create-event`} >
					<button className="openInventoryFormButton" id="addItemButton">Create New Event</button>
				</Link>
			</section> 
    	); 
	}
}