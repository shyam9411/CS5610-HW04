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
			"1": false,
			"2": false,
			"3": false,
			"4": false,
			"5": false,
			"6": false,
			"7": false,
			"8": false,
			"9": false,
			"10": false,
			"11": false,
			"12": false,
			"13": false,
			"14": false,
			"15": false,
			"16": false
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
	}

	_handleTileMatches(tileNum) {
		let tileState = true;
		let matchedTileState = this.state[this.matchLookup[tileNum]]
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
			this.tilesMatched["" + i] = false;
			this.state["" + i] = false;
		}
		this.clickCount = 0;
		this.setState(this.state);
	}

	handleClick(tileId) {
		if (this.timerId != null || this.tilesMatched[parseInt(tileId) - 1])
			return;

		this.clickCount += 1;
		let tileEle = document.getElementById(tileId);
		let bFoundMatch = this._handleTileMatches(tileId);
		if (this.prevClickId === "") {
			this.prevClickId = tileId;
			this.setState({[tileId]: !this.state[tileId], [this.previClickId]: bFoundMatch});
		}
		else {
			let prev = this.prevClickId;
			this.prevClickId = "";
			let timerDelay = bFoundMatch ? 0 : 2000;
			this.timerId = setTimeout(() => {this.setState({[prev]: bFoundMatch, [tileId]: bFoundMatch}); this.timerId = null;}, timerDelay);
		}
	}

	render() {
		let secondaryClassName = "hideTile";
		let isComplete = true;
		for (let i = 0; i < 16; i++)
			isComplete &= this.tilesMatched[i];

		let resetButton = <button className="reset" onClick={this.resetGame}>Reset Game</button>;
		let titleEle = <div className="titleContainer">Memory Game - Match the tiles</div>;
		let gameEle = 
			<div className="tileContainer">
				{titleEle}
				<div className="tiles" id="1" onClick={() => this.handleClick("1")}>{this.state["1"] ? "A" : ""}</div>
				<div className="tiles" id="2" onClick={() => this.handleClick("2")}>{this.state["2"] ? "B" : ""}</div>
				<div className="tiles" id="3" onClick={() => this.handleClick("3")}>{this.state["3"] ? "C" : ""}</div>
				<div className="tiles" id="4" onClick={() => this.handleClick("4")}>{this.state["4"] ? "D" : ""}</div>
				<div className="tiles" id="5" onClick={() => this.handleClick("5")}>{this.state["5"] ? "E" : ""}</div>
				<div className="tiles" id="6" onClick={() => this.handleClick("6")}>{this.state["6"] ? "F" : ""}</div>
				<div className="tiles" id="7" onClick={() => this.handleClick("7")}>{this.state["7"] ? "G" : ""}</div>
				<div className="tiles" id="8" onClick={() => this.handleClick("8")}>{this.state["8"] ? "H" : ""}</div>
				<div className="tiles" id="9" onClick={() => this.handleClick("9")}>{this.state["9"] ? "A" : ""}</div>
				<div className="tiles" id="10" onClick={() => this.handleClick("10")}>{this.state["10"] ? "B" : ""}</div>
				<div className="tiles" id="11" onClick={() => this.handleClick("11")}>{this.state["11"] ? "C" : ""}</div>
				<div className="tiles" id="12" onClick={() => this.handleClick("12")}>{this.state["12"] ? "D" : ""}</div>
				<div className="tiles" id="13" onClick={() => this.handleClick("13")}>{this.state["13"] ? "E" : ""}</div>
				<div className="tiles" id="14" onClick={() => this.handleClick("14")}>{this.state["14"] ? "F" : ""}</div>	
				<div className="tiles" id="15" onClick={() => this.handleClick("15")}>{this.state["15"] ? "G" : ""}</div>
				<div className="tiles" id="16" onClick={() => this.handleClick("16")}>{this.state["16"] ? "H" : ""}</div>
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

