import React, { Component } from 'react'
import Squares from './components/Squares'
import Axios from 'axios'

class App extends Component {
  state = {
    game: {}
  }

  componentDidMount() {
    const data = {
      number: 0
    }
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    fetch('https://minesweeper-api.herokuapp.com/games', request)
      .then(resp => {
        return resp.json()
      })
      .then(game => {
        console.log({ game })
        this.setState({
          game: game
        })
        console.log(game.board)
      })
  }
  leftClick = (row, col) => {
    console.log('clicked', row, col)
    fetch(
      `https://minesweeper-api.herokuapp/games/${this.state.game.id}/check`,
      {
        method: 'POST',
        body: JSON.stringify({
          row: row,
          col: col
        }),
        headers: { 'Content-Type': 'application/json' }
      }
    )
      .then(response => response.json())
      .then(newGameState => {
        console.log(newGameState)
        this.setState({
          game: newGameState
        })
      })
  }
  rightClick = (row, col) => {
    fetch(
      `https://minesweeper-api.herokuapp.com/games${this.state.game.id}/flag`,
      {
        mothod: 'POST',
        body: JSON.stringify({
          row: row,
          col: col
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
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
    } else if (+cell >= 1 && +cell <= 8) {
      return 'tdBox number'
    } else {
      return 'tdBox'
    }
  }

  render() {
    return (
      <>
        <main>
          <header class="mainTitle">Time To Play Mine Sweeper</header>
          <table>
            <tbody>
              {Object.keys(this.state.game).length > 0 &&
                this.state.game.board.map((row, i) => (
                  <tr key={i}>
                    {row.map((column, j) => (
                      <td
                        key={j}
                        className={this.checkCell(this.state.game.board[i][j])}
                        onClick={() => this.tdCellClick(i, j)}
                        onContextMenu={() => this.checkFlag(i, j)}
                      >
                        {this.state.game.board[i][j]}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </main>
      </>
    )
  }
}

export default App
