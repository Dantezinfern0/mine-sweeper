import React, { Component } from 'react'
import CellLogic from './components/CellLogic'

class App extends Component {
  state = {
    board: [],
    status: '',
    gameId: '',
    difficulty: 0,
    game: []
  }
  componentDidMount() {
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.state.difficulty
    }
    fetch('https://minesweeper-api.herokuapp.com/games', request)
      .then(response => {
        return response.json()
      })
      .then(game => {
        console.log(game)
        this.setState({
          board: game.board,
          message: '',
          gameId: game.id
        })
        // console.log(game)
      })
  }
  leftClick = (row, col) => {
    console.log('clicked', row, col)
    fetch(
      `https://minesweeper-api.herokuapp.com/games/${this.state.gameId}/check`,
      {
        method: 'POST',
        body: JSON.stringify({
          row: row,
          col: col
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(response => response.json())
      .then(newGameState => {
        console.log('newgamestate',newGameState)
        this.setState({
          board: newGameState.board,
          status: newGameState.state,
          gameId: newGameState.id
        })
      })
  }
  rightClick = (event, row, col) => {
    event.preventDefault()
    console.log('clicked', row, col)
    fetch(
      `https://minesweeper-api.herokuapp.com/games/${this.state.gameId}/flag`,
      {
        method: 'POST',
        body: JSON.stringify({
          row: row,
          col: col
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(response => response.json())
      .then(newGameState => {
        this.setState({
          board: newGameState.board,
          status: newGameState.state,
          gameId: newGameState.id
        })
      })
  }
  checkCell = cell => {
    if (cell === '_') {
      return 'tdBox reveal'
    } else if (cell === 'F') {
      return 'tdBox flag'
    } else if (cell === '*') {
      return 'tdBox bomb'
    } else if (cell === '@') {
      return 'tdBox cellFlagBomb'
    } else if (+cell >= 1 || +cell <= 8) {
      return 'tdBox number'
    } else if (this.state.game.state === 'win') {
      this.setState({
        message: 'You won!'
      })
    } else if (this.state.game.state === 'lost') {
      this.setState({
        message: 'You lose.'
      })
    } else if (this.state.game.state === 'new') {
      this.setState({
        message: ''
      })
    } else {
      return 'tdBox'
    }
  }
  resetButton = () => {
    this.setState({
      startGame: [],
      id: '',
      state: ''
    })
    this.componentDidMount()
  }
  diffUp = () => {
    if (this.state.difficulty === 2) {
      this.state.difficulty = 2
    } else if (this.state.difficulty < 2) {
      this.state.difficulty += 1
    }
    this.componentDidMount()
  }
  diffDown = () => {
    if (this.state.difficulty === 0) {
      this.state.difficulty = 0
    } else if (this.state.difficulty > 0) {
      this.state.difficulty += -1
    }
    this.componentDidMount()
  }
  render() {
    console.log('Game', this.state.game)
    return (
      <main>
        <header> Let's Play Mine Sweeper </header>
        <p className="d-message">(Difficulty is set to {this.state.difficulty})</p>
        <div>
          {this.state.status === 'lost' ? (
            <div>
              <h1 className="red-message"> You lost! </h1>
            </div>
          ) : null}
          {this.state.status === 'won' ? (
            <div>
              <h1 className="green-message"> You won! </h1>
            </div>
          ) : null}
        </div>
        <table>
          <tbody>
            {this.state.board.map((row, i) => (
              <tr key={i}>
                {row.map((column, j) => (
                  <td
                    key={j}
                    className={this.checkCell(this.state.board[i][j])}
                    onClick={() => this.leftClick(i, j)}
                    onContextMenu={event => this.rightClick(event, i, j)}
                  >
                    <CellLogic cellStatus={this.state.board[i][j]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="reset-button">
          <button onClick={this.diffDown}>Difficulty Down</button>
          <button onClick={this.resetButton}>Reset Game</button>
          <button onClick={this.diffUp}>Difficulty Up</button>
        </div>
      </main>
    )
  }
}
export default App
