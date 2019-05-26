import React, { Component } from 'react'
import Squares from './components/Squares'
import Axios from 'axios';

class App extends Component {
  state = {
    board: [],
    difficulty: []
    }
  
  componentDidMount = (row, column) => {
    fetch('https://minesweeper-api.herokuapp.com/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ difficulty: 0 })
    })
      .then(resp => {
        return resp.json()
      })
      .then(game => {
        console.log({ game })
        this.setState({
          board: game.board
        })
        console.log(game.board)
      })
  }
  
  render() {
    return (
      <>
        <main>
          <header>Time To Play Mine Sweeper</header>
          <table>
            <tbody >
              {this.state.board.map((row, i) => {
                return (
                  <tr Key={i}>
                    {row.map((column, j) => {
                      return (
                        <td key={j} row={i} col={j} value={column
                        } class="td-box-class" onClick="" onContextMenu="">
                          {this.state.board[i][j]}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </main>
      </>
    )
  }
}

export default App
