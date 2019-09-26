import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"1": {"status": false, "color": "black"},
			"2": {"status": false, "color": "black"},
			"3": {"status": false, "color": "black"},
			"4": {"status": false, "color": "black"},
			"5": {"status": false, "color": "black"},
			"6": {"status": false, "color": "black"},
			"7": {"status": false, "color": "black"},
			"8": {"status": false, "color": "black"},
			"9": {"status": false, "color": "black"},
			"10": {"status": false, "color": "black"},
			"11": {"status": false, "color": "black"},
			"12": {"status": false, "color": "black"},
			"13": {"status": false, "color": "black"},
			"14": {"status": false, "color": "black"},
			"15": {"status": false, "color": "black"},
			"16": {"status": false, "color": "black"}
		};
		this.handleClick = this.handleClick.bind(this);
		this._handleTileMatches = this._handleTileMatches.bind(this);
		this.resetGame = this.resetGame.bind(this);

		this.tilesMatched = [];
		this.matchLookup = {
			"1": "9",
			"2": "10",
			"3": "11",
			"4": "12",
			"5": "13",
			"6": "14",
			"7": "15",
			"8": "16",
			"9": "1",
			"10": "2",
			"11": "3",
			"12": "4",
			"13": "5",
			"14": "6",
			"15": "7",
			"16": "8"
		};

		for (let i = 0; i < 16; i++)
			this.tilesMatched.push(false);

		this.prevClickId = "";
		this.timerId = null;
		this.clickCount = 0;
		// Attribution: Defaulting the state as reset is to bring the object to default state. Reference link: https://stackoverflow.com/questions/34845650/clearing-state-es6-react
		this.defaultState = {...this.state};
	}

	_handleTileMatches(tileNum) {
		let tileState = true;
		let matchedTileState = this.state[this.matchLookup[tileNum]]["status"]
		let handledTileMatch = false;
		if (tileState && matchedTileState) {
			this.tilesMatched[parseInt(tileNum) - 1] = true;
			this.tilesMatched[parseInt(this.matchLookup[tileNum]) - 1] = true;
			handledTileMatch = true;
		}
		
		return handledTileMatch;
	}

	resetGame() {
		for (let i = 1; i < 17; i++) {
			this.tilesMatched[i - 1] = false;
		}

		this.prevClickId = "";
		clearTimeout(this.timerId);
		this.timerId = null;
		this.clickCount = 0;
		this.setState(this.defaultState);
	}

	handleClick(tileId) {
		if (this.timerId != null || this.tilesMatched[parseInt(tileId) - 1] || this.prevClickId == tileId) {
			return;
		}

		this.clickCount += 1;
		let tileEle = document.getElementById(tileId);
		let bFoundMatch = this._handleTileMatches(tileId);
		if (this.prevClickId === "") {
			this.prevClickId = tileId;
			this.setState({[tileId]: {"status": !this.state[tileId]["status"], "color": "lightgray"}, [this.previClickId]: {"status": bFoundMatch}});
		}
		else {
			let prev = this.prevClickId;
			this.prevClickId = "";
			let timerDelay = bFoundMatch ? 0 : 2000;
			let color = bFoundMatch ? "green" : "red";
			this.setState({[tileId]: {"status": !this.state[tileId]["status"], "color": color}, [prev]: {"status": this.state[prev]["status"], "color": color}});
			if (!bFoundMatch) {
				this.timerId = setTimeout(() => {
					this.setState({[prev]: {"status": bFoundMatch, "color": "black"}, [tileId]: {"status": bFoundMatch, "color": "black"}}); 
					this.timerId = null;
				}, timerDelay);
			}
		}
	}

	render() {
		let isComplete = true;
		for (let i = 0; i < 16; i++)
			isComplete &= this.tilesMatched[i];

		let resetButton = <button className="reset" onClick={this.resetGame}>Reset Game</button>;
		let titleEle = <div className="titleContainer">Memory Game - Match the tiles</div>;
		let gameEle = 
			<div className="tileContainer">
				{titleEle}
				<div className={"tiles " + this.state["1"]["color"]} id="1" onClick={() => this.handleClick("1")}>{this.state["1"]["status"] ? "A" : ""}</div>
				<div className={"tiles " + this.state["2"]["color"]} id="2" onClick={() => this.handleClick("2")}>{this.state["2"]["status"] ? "B" : ""}</div>
				<div className={"tiles " + this.state["3"]["color"]} id="3" onClick={() => this.handleClick("3")}>{this.state["3"]["status"] ? "C" : ""}</div>
				<div className={"tiles " + this.state["4"]["color"]} id="4" onClick={() => this.handleClick("4")}>{this.state["4"]["status"] ? "D" : ""}</div>
				<div className={"tiles " + this.state["5"]["color"]} id="5" onClick={() => this.handleClick("5")}>{this.state["5"]["status"] ? "E" : ""}</div>
				<div className={"tiles " + this.state["6"]["color"]} id="6" onClick={() => this.handleClick("6")}>{this.state["6"]["status"] ? "F" : ""}</div>
				<div className={"tiles " + this.state["7"]["color"]} id="7" onClick={() => this.handleClick("7")}>{this.state["7"]["status"] ? "G" : ""}</div>
				<div className={"tiles " + this.state["8"]["color"]} id="8" onClick={() => this.handleClick("8")}>{this.state["8"]["status"] ? "H" : ""}</div>
				<div className={"tiles " + this.state["9"]["color"]} id="9" onClick={() => this.handleClick("9")}>{this.state["9"]["status"] ? "A" : ""}</div>
				<div className={"tiles " + this.state["10"]["color"]} id="10" onClick={() => this.handleClick("10")}>{this.state["10"]["status"] ? "B" : ""}</div>
				<div className={"tiles " + this.state["11"]["color"]} id="11" onClick={() => this.handleClick("11")}>{this.state["11"]["status"] ? "C" : ""}</div>
				<div className={"tiles " + this.state["12"]["color"]} id="12" onClick={() => this.handleClick("12")}>{this.state["12"]["status"] ? "D" : ""}</div>
				<div className={"tiles " + this.state["13"]["color"]} id="13" onClick={() => this.handleClick("13")}>{this.state["13"]["status"] ? "E" : ""}</div>
				<div className={"tiles " + this.state["14"]["color"]} id="14" onClick={() => this.handleClick("14")}>{this.state["14"]["status"] ? "F" : ""}</div>	
				<div className={"tiles " + this.state["15"]["color"]} id="15" onClick={() => this.handleClick("15")}>{this.state["15"]["status"] ? "G" : ""}</div>
				<div className={"tiles " + this.state["16"]["color"]} id="16" onClick={() => this.handleClick("16")}>{this.state["16"]["status"] ? "H" : ""}</div>
			{resetButton}
			</div>;

		let gameOver = <div className="doneText">Game Completed</div>;
			
		if (isComplete) { 
			let score = 100 - ((this.clickCount - 16) * 0.5);
			return (<div className="doneRoot">
				{titleEle}
				{gameOver}
				{resetButton}
				<div className="score">Total Score: {score}</div> 
				</div>);
		}
		

		return gameEle;
  	}
}

