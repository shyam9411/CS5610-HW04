import React from 'react';
import ReactDOM from 'react-dom';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

// Default mapping of tiles, for which the values are expected to be same.
const matchLookup = {
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


class Starter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"tileInfo": [
				{"tileNo": "1", "status": false, "color": "black", "val": "A"},
				{"tileNo": "2", "status": false, "color": "black", "val": "B"},
				{"tileNo": "3", "status": false, "color": "black", "val": "C"},
				{"tileNo": "4", "status": false, "color": "black", "val": "D"},
				{"tileNo": "5", "status": false, "color": "black", "val": "E"},
				{"tileNo": "6", "status": false, "color": "black", "val": "F"},
				{"tileNo": "7", "status": false, "color": "black", "val": "G"},
				{"tileNo": "8", "status": false, "color": "black", "val": "H"},
				{"tileNo": "9", "status": false, "color": "black", "val": "A"},
				{"tileNo": "10", "status": false, "color": "black", "val": "B"},
				{"tileNo": "11", "status": false, "color": "black", "val": "C"},
				{"tileNo": "12", "status": false, "color": "black", "val": "D"},
				{"tileNo": "13", "status": false, "color": "black", "val": "E"},
				{"tileNo": "14", "status": false, "color": "black", "val": "F"},
				{"tileNo": "15", "status": false, "color": "black", "val": "G"},
				{"tileNo": "16", "status": false, "color": "black", "val": "H"}
			],
			timerId: null,
			clickCount: 0,
			prevClickId: ""
		};

		this.handleClick = this.handleClick.bind(this);
		this._handleTileMatches = this._handleTileMatches.bind(this);
		this.resetGame = this.resetGame.bind(this);

		this.tilesMatched = [];

		for (let i = 0; i < 16; i++)
			this.tilesMatched.push(false);

		// Attribution: Shuffling of an array was referenced from the following site: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		this.unSortedState = this.state.tileInfo.sort(() => 0.5 - Math.random());
	}

	/**
	 * Private handler to check if the given tile number and the corresponding match have been opened by the user.
	 * @param tileNum describes the internal referencing of the tile, with number being referenced as string. Check at state.tileInfo for the references used.
	 */
	_handleTileMatches(tileNum) {
		let tileState = true;
		let i = 0;
		for (i = 0; i < 16; i++) {
			if (this.state.tileInfo[i].tileNo === matchLookup[tileNum])
				break;
		}

		let matchedTileState = this.state.tileInfo[i].status;
		let handledTileMatch = false;
		if (tileState && matchedTileState) {
			this.tilesMatched[parseInt(tileNum) - 1] = true;
			this.tilesMatched[parseInt(matchLookup[tileNum]) - 1] = true;
			handledTileMatch = true;
		}
		
		return handledTileMatch;
	}

	/**
	 * Method to reset the game state to initial state. Also we randomise the tiles again as the game has been reset.
	 */
	resetGame() {
		for (let i = 0; i < 16; i++) {
			this.tilesMatched[i] = false;
			this.state.tileInfo[i].status = false;
			this.state.tileInfo[i].color = "black";
		}

		this.state.prevClickId = "";
		clearTimeout(this.state.timerId);
		this.state.timerId = null;
		this.state.clickCount = 0;
		this.unSortedState = this.state.tileInfo.sort(() => 0.5 - Math.random());
		this.setState({"tileInfo": this.state.tileInfo});
	}

	/**
	 * Method to handle the click events on the DOM elements. We validate the click for a match if its corresponding match has been found by the user. Else the click would be considered as a new tile open.
	 * @param tileId determines the id of the tile from which the event was triggered
	 */
	handleClick(tileId) {
		if (this.state.timerId != null || this.tilesMatched[parseInt(tileId) - 1] || this.state.prevClickId == tileId) {
			return;
		}

		this.state.clickCount += 1;
		let tileEle = document.getElementById(tileId);
		let bFoundMatch = this._handleTileMatches(tileId);
		let tileObj = this.state.tileInfo.filter((obj) => obj.tileNo === tileId)[0];
		let prevTileObj = this.state.tileInfo.filter((obj) => obj.tileNo === this.state.prevClickId)[0];
		if (this.state.prevClickId === "") {
			this.state.prevClickId = tileId;

			// change state for current tile
			tileObj.color = "lightgray";
			tileObj.status = !tileObj.status;

			this.setState({"tileInfo": this.state.tileInfo, "prevClickId": tileId});
		}
		else {
			let prev = this.state.prevClickId;
			let timerDelay = bFoundMatch ? 0 : 2000;
			let color = bFoundMatch ? "green" : "red";
			
			// Change current tile object
			tileObj.status = !tileObj.status;
			tileObj.color = color;

			// Change prev object
			prevTileObj.status = bFoundMatch;
			prevTileObj.color = color;
			
			this.setState({"tileInfo": this.state.tileInfo, "prevClickId": ""});

			if (!bFoundMatch) {
				this.state.timerId = setTimeout(() => {
					// Reset the state of the tile object
					tileObj.status = false;
					tileObj.color = "black";

					// Reset the state of previously selected object
					prevTileObj.status = false;
					prevTileObj.color = "black"

					this.setState({"tileInfo": this.state.tileInfo, "timerId": null});
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

		// Attribution: Combining multiple dom elements to be rendered as an array so that, it can be rendered accordingly. Link used for reference: https://stackoverflow.com/questions/29149169/how-to-loop-and-render-elements-in-react-js-without-an-array-of-objects-to-map
		let gameTiles = [];
                for (let i = 0; i < 16; i++)
                	gameTiles.push(<div className={"tiles " + this.unSortedState[i].color} id={this.unSortedState[i].tileNo} onClick={() => this.handleClick(this.unSortedState[i].tileNo)}>{this.unSortedState[i].status ? this.unSortedState[i].val : ""}</div>);

		let gameEle = 
			<div className="tileContainer">
				{titleEle}
				{gameTiles}
				{resetButton}
			</div>;

		let gameOver = <div className="doneText">Game Completed</div>;
			
		if (isComplete) { 
			let score = 100 - ((this.state.clickCount - 16) * 0.5);
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

