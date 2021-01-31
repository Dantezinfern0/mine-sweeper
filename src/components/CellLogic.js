import React, { Component } from 'react'

class CellLogic extends Component {
  render() {
    let rv = <>{this.props.cellStatus}</>
    if (this.props.cellStatus === '*') {
      rv = (
        <span>
          <span role="img" aria-label="poop">💩</span>
        </span>
      )
    } else if (this.props.cellStatus === 'F') {
      rv = (
        <span>
          <span role="img" aria-label="pin">📍</span>
        </span>
      )
    } else if (this.props.cellStatus === '_') {
      rv = (
        <span>
          <span>{'  '}</span>
        </span>
      )
    }
    return rv
  }
}
export default CellLogic