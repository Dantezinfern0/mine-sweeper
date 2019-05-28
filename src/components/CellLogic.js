import React, { Component } from 'react'

class CellLogic extends Component {
  render() {
    let rv = <>{this.props.cellStatus}</>
    if (this.props.cellStatus === '*') {
      rv = (
        <>
          <span>💩</span>
        </>
      )
    } else if (this.props.cellStatus === 'F') {
      rv = (
        <>
          <span>📍</span>
        </>
      )
    }
    return rv
  }
}

export default CellLogic
