import React, { Component } from 'react'
import { ref } from '../../config/constants'
import { Redirect } from 'react-router-dom'
import './CreateEvent.css';
import Location from '../../images/icons/location.png';
import Calendar from '../../images/icons/calendar.png';
import Time from '../../images/icons/time.png';

export default class CreateEvents extends Component {
	
  	constructor(props) {
    	super(props);
    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.handleChange = this.handleChange.bind(this);
    	this.resetForm = this.resetForm.bind(this);
    	this.state = {
	    	title: '',
	    	description: '',
	    	location: "",
  			date: "",
  			time: "",
  			fireRedirectEvents: false,
  			fireRedirectLogin: false
	    }
	    this.baseState = this.state;
  	}

  	handleSubmit(event) {
		if(sessionStorage.curUser != "null"){
			event.preventDefault();
			var newEvent = ref.push();  	
			newEvent.set({
			    host: sessionStorage.curUser,
			    title: event.target.title.value,
			    desc: event.target.description.value,
			    location: event.target.location.value,
			    date: event.target.date.value,
			    time: event.target.time.value,
			    theme: event.target.theme.value,
			    inventory: ["2bVodka", "3bBeer", "1bWine"],
			    wishlist: ["Chips", "Pizza"],
			    guests: []
  			});	
  			this.setState({ fireRedirectEvents: true })
		}
		else{
			console.log("user isnt logged in");
			this.setState({ fireRedirectLogin: true })
		}
  	}

  	handleChange(event){
  		const name = event.target.name;
  		const value = event.target.value;
  		this.setState({
  			[name]: value
  		});
  	}

  	resetForm = () => {
  		this.setState(this.baseState)
  	}

  	render () {
  		const { from } = this.props.location.state || '/'
    	const { fireRedirectEvents } = this.state
    	const { fireRedirectLogin } = this.state

	    return (
	      <div>
	        <h1 className="subtitle">Create New Event</h1>
			<div className="heading eventform">
				<form id="createEventForm" onSubmit={this.handleSubmit} >

					<input name="title" className="formelement" value={this.state.title} onChange={this.handleChange} type="text" id="newEventTitle" placeholder="event title" />

					<textarea name="description" className="formelement" placeholder="tell your guests what your party is about" value={this.state.description} onChange={this.handleChange} type="text" id="newEventDesc"></textarea>
					<div className="formelement_icon">
						<img src={Location} className="formicon" alt="location icon"></img>
						<input name="location"  value={this.state.location} onChange={this.handleChange} type="text" id="newEventLocation" placeholder="location" />
					</div>
					<div className="formelement_icon">
						<img src={Calendar} className="formicon" alt="calendar icon"></img>
						<input name="date" value={this.state.date} onChange={this.handleChange} type="date" id="newEventDate" />
					</div>
					<div className="formelement_icon">
						<img src={Time} className="formicon" alt="time icon"></img>
						<input name="time" value={this.state.time} onChange={this.handleChange} type="time" id="newEventTime" />
					</div>

					<div className="formelement">
						<input name="theme" value={this.state.pTheme} onChange={this.handleChange} type="radio" value="p" defaultChecked="true" id="pineapple"/>
						<label htmlFor="pineapple">Pineapple</label>
						<div className="theme">
							<div className="p1 themecolors"></div>
							<div className="p2 themecolors"></div>
							<div className="p3 themecolors"></div>
							<div className="p4 themecolors"></div>
							<div className="p5 themecolors"></div>
						</div>
						<input name="theme" value={this.state.bTheme} onChange={this.handleChange} type="radio" value="b" id="beach"/>
						<label htmlFor="beach">Beach</label>
						<div className="theme">
							<div className="b1 themecolors"></div>
							<div className="b2 themecolors"></div>
							<div className="b3 themecolors"></div>
							<div className="b4 themecolors"></div>
							<div className="b5 themecolors"></div>
						</div>
						<input name="theme" value={this.state.tTheme} onChange={this.handleChange} type="radio" value="t" id="tropic"/>
						<label htmlFor="tropic">Tropic</label>
						<div className="theme">
							<div className="t1 themecolors"></div>
							<div className="t2 themecolors"></div>
							<div className="t3 themecolors"></div>
							<div className="t4 themecolors"></div>
							<div className="t5 themecolors"></div>
						</div>
					</div>
					<input type="hidden" id="hiddenFieldCreateEvent" value="" name="id"/>
					<button onClick={this.resetForm} type="button">Cancel</button>
					<button id="button" type="submit" className="submitbutton" value="Submit">Create Event</button>
				</form>
				{fireRedirectEvents && (
          		<Redirect to={from || '/events'}/>
        	)}
    		{fireRedirectLogin && (
      			<Redirect to={from || '/login'}/>
    		)}
			</div>
	      </div>
	    )
	}
}