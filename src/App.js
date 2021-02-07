import React, { Component } from 'react'
import CellLogic from './components/CellLogic'

class App extends Component {
  state = {
    board: [],
    status: '',
    gameId: '',
    difficulty: 0,
    game: [],
    messageClass: '',
    message: '',
    year: null
  }
  componentDidMount() {
    let d = new Date()
    let year = d.getFullYear()
    this.setState({
      year: year
    })
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        difficulty: this.state.difficulty
      })
    }
    fetch('https://minesweeper-api.herokuapp.com/games', request)
      .then(response => {
        return response.json()
      })
      .then(game => {
        this.setState({
          board: game.board,
          gameId: game.id,
          status: game.state
        })
      })
  }
  leftClick = (row, col) => {
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
        this.setState({
          board: newGameState.board,
          status: newGameState.state,
          gameId: newGameState.id
        })
        this.winOrLose()
        console.log('LEFT CLICK', this.state.status)
      })
  }
  rightClick = (event, row, col) => {
    event.preventDefault()
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
  winOrLose() {
    if (this.state.status === 'win') {
      this.setState({
        message: 'You won!',
        messageClass: 'green-message'
      })
    } else if (this.state.status === 'lost') {
      this.setState({
        message: 'Oh Poop!',
        messageClass: 'red-message'
      })} else {
        console.log('no win or lost')}
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
    }  else return 'tdBox'
  }
  resetButton = () => {
    this.setState({
      board: [],
      status: '',
      gameId: '',
      game: [],
      messageClass: 'hide'
    })
    this.componentDidMount()
  }
  diffUp = () => {
    if (this.state.difficulty > 2) {
      this.setState({
        difficulty: 2
      })
    } else if (this.state.difficulty < 2) {
      let increment = this.state.difficulty
      this.setState({
        difficulty: (increment += 1)
      })
    }
    this.componentDidMount()
  }
  diffDown = () => {
    if (this.state.difficulty === 0) {
      this.setState({
        difficulty: 0
      })
    } else if (this.state.difficulty > 0) {
      let decrement = this.state.difficulty
      this.setState({
        difficulty: (decrement += -1)
      })
    }
    this.componentDidMount()
  }
  checkDifficulty() {
    if (this.state.difficulty === 0) {
      return 'Easy'
    } else if (this.state.difficulty === 1) {
      return 'Medium'
    } else if (this.state.difficulty === 2) {
      return 'Hard'
    } else {
      return 'Error Assessing the Difficulty'
    }
  }
  render() {
    return (
      <main>
        <header> 
          <h1>
            Let's Play Mine Sweeper
          </h1>
          <div className="reset-button">
          <button className="hide-on-mobile" onClick={this.diffDown}>
            Difficulty Down
          </button>
          <button onClick={this.resetButton}>
            Reset Game
          </button>
          <button className="hide-on-mobile" onClick={this.diffUp}>
            Difficulty Up
          </button>
        </div>
           </header>
        <h2 className="center-text">
          (Difficulty is set to {this.checkDifficulty()})
        </h2>
        <div>
           {this.state.message ? ( <div>
              <h1 className={`${this.state.messageClass}`}>{this.state.message}</h1>
            </div>) : null}
        </div>
        <table>
          <tbody>
            {this.state.board.map((row, i) => (
              <tr key={i}>
                {row.map((col, j) => (
                  <td
                    key={j}
                    className={this.checkCell(this.state.board[i][j])}
                    onClick={() => this.leftClick(i, j)}
                    onContextMenu={event => this.rightClick(event, i, j)}>
                    <CellLogic cellStatus={this.state.board[i][j]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <footer>© DanteHarasz.dev {this.state.year}</footer>
      </main>
    )
  }
}
export default App