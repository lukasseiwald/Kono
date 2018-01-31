import React, { Component } from 'react'
import { ref, firebaseApp } from '../../config/constants'
import './Inventory.css'
import { Link } from 'react-router-dom'
import bottle from '../../images/icons/bottle.png'

export default class Inventory extends Component {

	constructor(props) {
    	super(props)

    	this.state = {
	      	currentItem: '',
	      	username: '',
	      	items: [],
	      	itemsUser: [],
	      	boozeStatus: '',
	      	wishes: [],
	      	amount: '',
	      	what: '',
	      	price: '',
	      	wish: ''
	    }
	    this.baseState = this.state;
    	this.handleChange = this.handleChange.bind(this);
	    this.deleteItem = this.deleteItem.bind(this);
	    this.deleteWish = this.deleteWish.bind(this);
	    this.addToWishlist = this.addToWishlist.bind(this);
	    this.addToInventory = this.addToInventory.bind(this);
  	}

  	componentDidMount() {
    	const currentUser = firebaseApp.auth().currentUser;
    	let currentEvent = this.props.match.params.eventid;
    	let inventoryRef = firebaseApp.database().ref('events/' + currentEvent + '/inventory/');
    	let wishlistRef = firebaseApp.database().ref('events/' + currentEvent + '/wishlist/');

		inventoryRef.on('value', (snapshot) => {
		    let inventory = snapshot.val();
		    let InventoryList = [];
		    for (let item in inventory) {
		    	if(inventory[item]){
		    		InventoryList.push({
				        id: 	item,
				        type: 	inventory[item].type,
				        amount: inventory[item].amount,
				        price: 	inventory[item].price,
				        buyer: 	inventory[item].buyer
			    	});

			    	this.setState({
						items: InventoryList
					});
			    }  
		    }
		});

		wishlistRef.on('value', (snapshot) => {
		    let wishes = snapshot.val();
		    let wishList = [];
		    for (let wish in wishes) {
		    	console.log( wish + ": " + wishes[wish].wish);
		    	if(wishes[wish]){
		    		wishList.push({
		    			id: wish,
		    			wish: wishes[wish].wish  
			    	});
			    	this.setState({
						wishes: wishList
					});
			    }
		    }
		});

		
		var boozeStatusRef = firebaseApp.database().ref('events/' + currentEvent + '/boozeStatus');
		boozeStatusRef.on('value', (snapshot)=>{
			var boozeStatus = snapshot.val();
			this.setState({boozeStatus: boozeStatus});
		});
	}

	deleteItem(id){
		let currentEvent = this.props.match.params.eventid;
		let InventoryListRef = firebaseApp.database().ref('events/' + currentEvent + '/inventory');
		InventoryListRef.child(id).remove();
	}

	deleteWish(id){
		let currentEvent = this.props.match.params.eventid;
		let wishListRef = firebaseApp.database().ref('events/' + currentEvent + '/wishlist');
		wishListRef.child(id).remove();
	}

	addToInventory(event){
		if(sessionStorage.curUser != "null"){
			event.preventDefault();
			let currentEvent = this.props.match.params.eventid;
			let InventoryListRef = firebaseApp.database().ref('events/' + currentEvent + '/inventory');
			var newItem = InventoryListRef.push();
			  	newItem.set({
			    	type: 	event.target.what.value,
					amount: event.target.amount.value,
					price: 	event.target.price.value,
					buyer:  sessionStorage.curUser
			  	});
		}
	}

	handleChange(event){
  		const name = event.target.name;
  		const value = event.target.value;
  		this.setState({
  			[name]: value
  		});
  	}

	addToWishlist(event){
		if(sessionStorage.curUser != "null"){
			event.preventDefault();
			let currentEvent = this.props.match.params.eventid;
			let wishListRef = firebaseApp.database().ref('events/' + currentEvent + '/wishlist');
			var newWish = wishListRef.push();
			  	newWish.set({
			    	wish: event.target.wish.value
			  	});
		}
	}

	render() {
		const { boozeStatus } = this.state

		return (
			<div>
                <h1 className="title"> Inventory </h1>
				<div className="Inventory">
                    <div className="pagecontent">
                        <div className="boozeStatus">
                            <img src={bottle} alt="bottle" className="milkbottle"></img>
                            <div className="boozelist">
                                <h2 className="heading"> Booze Status: { this.state.boozeStatus } </h2>
                                <ul className="eventsList">
                                    {this.state.items.map((item) => {
                                        return (
                                            <li className="inventoryentry" key={item.id}>
                                                {item.amount} {item.type} <div id={item.id} onClick={ () => this.deleteItem(item.id)}>X</div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h2> Add To Inventory </h2>
                            <form className="addToInventory" onSubmit={this.addToInventory}>
                                <div className="formentry">
                                    <input name="amount" className="formitem" value={this.state.amount} onChange={this.handleChange} type="number" min="1" max="500" required/> bottle(s)
                                </div>
                                <div className="formentry">
                                    <input name="what" className="formitem" value={this.state.what} onChange={this.handleChange} type="text" maxLength="15" placeholder="type of drink" required/>
                                </div>
                                <div className="formentry">
                                    <input name="price" className="formitem" value={this.state.price} onChange={this.handleChange} type="number" min="0" max="10000"/> bucks
                                </div>
                                <div>
                                    <button id="button" type="submit" className="submitbutton" value="Submit">+ Add Drink</button>
                                </div>
                            </form>
                        </div>
                        <div className="furtherDetailsInventory">


                        </div>
                    </div>
			   	</div>
			   	<div className="pagecontent">
			   		<div>
						<h1> Wishlist </h1>
						<ul className="eventsList">
						      {this.state.wishes.map((wish) => {
						        return (
						          	<li key={wish.id} className="listentry" >
						          		{wish.wish} <div onClick={ () => this.deleteWish(wish.id)}>X</div>
							        </li>
						        )
						      })}
						</ul>
					</div>
					<div className="addToWishlist">
						<h2> Add To Wishlist </h2>
						<form onSubmit={this.addToWishlist} >
						<input name="wish" className="formelement" value={this.state.wish} onChange={this.handleChange} type="text" placeholder="Pineapple Please?!" />
						<button id="button" type="submit" className="submitbutton" value="Submit">+ Add</button>
						</form>
					</div>
					<button className="submitbutton" id="MakeAWish">Make a Wish</button>
			   	</div>

			   	<div className="back">
			   		<Link to={`/events/${this.props.match.params.eventid}`} >
						Back
					</Link>
		    	</div>
		    </div>
		);
	}
}