import React, { Component } from 'react';
import {Grid,Row,Col} from 'react-bootstrap';
import getWeb3 from './utils/getWeb3.js';
import bookieContract from './contracts/bookie.json'
import './App.css';



class TeamA extends Component {
  constructor(){
    super();
    this.state={
      web3: '',
      Amount: '',
      InputAmount: '',
      weiConversion : 1000000000000000000
    }

    this.getAmount = this.getAmount.bind(this);
    this.Bet = this.Bet.bind(this);
    this.MakeWin = this.MakeWin.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount(){
    getWeb3.then(results => {
      /*After getting web3, we save the informations of the web3 user by
      editing the state variables of the component */
      results.web3.eth.getAccounts( (error,acc) => {
        //this.setState is used to edit the state variables
        this.setState({
          web3: results.web3
        })
      });
      return results.web3
    }).then(results => {
      console.log("bonjour")
      this.getAmount(results)
    }).catch( () => {
      //If no web3 provider was found, log it in the console
      console.log('Error finding web3.')
    })
  }



  getAmount(web3){
    const contract = require('truffle-contract');
    const bookie = contract(bookieContract);
    bookie.setProvider(web3.currentProvider);
    var bookieInstance;
    web3.eth.getAccounts((error, accounts) => {
    bookie.deployed().then((instance) => {

      //Instanciation du contrat
      bookieInstance = instance

    }).then((result) => {
      // On récupère ensuite la valeur du contrat
      // et on appelle la fonction BuyFirst avec ses paramètres.
      return bookieInstance.AmountOne.call({from: accounts[0]})
    }).then((result) => {
      this.setState({
        Amount : result.c / 10000
      })
    });
  })
  }

  handleInputChange(e) {
    this.setState({InputAmount: e.target.value*this.state.weiConversion});
  }

  Bet(){
    const contract = require('truffle-contract');
    const bookie = contract(bookieContract);
    bookie.setProvider(this.state.web3.currentProvider);
    var bookieInstance;
    this.state.web3.eth.getAccounts((error, accounts) => {
        bookie.deployed().then((instance) => {
          bookieInstance = instance
        }).then((result) => {
          // Get the value from the contract to prove it worked.
          return bookieInstance.bet(1, {from: accounts[0],
          value: this.state.InputAmount})
        }).catch(() => {
          console.log("Error with bookie")
        })
      })
  }

  MakeWin(){
    const contract = require('truffle-contract');
    const bookie = contract(bookieContract);
    bookie.setProvider(this.state.web3.currentProvider);
    var bookieInstance;
    this.state.web3.eth.getAccounts((error, accounts) => {
        bookie.deployed().then((instance) => {
          bookieInstance = instance
        }).then((result) => {
          return bookieInstance.distributePrizes(1, {from: accounts[0]})
        }).catch(() => {
          console.log("Error with distributing prizes")
        })
      })
  }




  render(){
        return(
          <div>
            <h3>Team A</h3>
            <h4> Total amount : {this.state.Amount} ETH</h4>
            <hr/>
            <h5> Enter an amount to bet</h5>
            <div className="input-group">
                    <input type="text" className="form-control" onChange={this.handleInputChange} required pattern="[0-9]*[.,][0-9]*"/>
                    <span className="input-group-addon">ETH</span>
            </div>
            <br/>
            <button onClick={this.Bet}>Bet</button>
            <br/>
            <hr/>
            <button onClick={this.MakeWin}> Make this team win</button>
          </div>
        )

    }



}

export default TeamA;
