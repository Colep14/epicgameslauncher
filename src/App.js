// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'

/*eslint no-undef: "warn"*/
//^ for the Electron contextBridge bullshiiiit

function Game (props) {
  return (
  <div onClick={() => {
    nodeApi.open(`com.epicgames.launcher://apps/${props.uri}?action=launch&silent=true`)
  }}
  >
    <img className="w-20" src={props.src}/>
    <div>{props.title}</div>
  </div>
  )
}

class Games extends React.Component {
  constructor() {
    super();
    this.state = {
      games: []
    }
  }
  async componentDidMount() {
    const gamesList = await nodeApi.getGames();
    console.log(gamesList)
    this.setState({ games: gamesList })
    this.forceUpdate();
  }

  render() {
    console.log('render', this.state)

    const games = [];

    for (const game of Object.keys(this.state.games).sort()) {
      console.log(game)
      const props = this.state.games[game]
      games.push(<Game title={game} uri={props.uri} src=""/>)
    }

    return (<div>
      {/* <Game title="Fall Guys" src="https://cdn1.epicgames.com/offer/50118b7f954e450f8823df1614b24e80/EGS_FallGuys_Mediatonic_S2_1200x1600_1200x1600-b46b10148798858d4bcaf937fbfb538b?h=854&resize=1&w=640"/> */}
      {games}
    </div>)
  }
}

function App() {

  useEffect(() => { //ComponentDidMount
    window.emit("ReactDOMLoaded") //make preload work
  }, [])

  return (
    <div className='mx-2'>
      <Games />
    </div>
  );
}

export default App;