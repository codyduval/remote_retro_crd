import React, { Component } from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { actions } from "../redux/retro"

import * as AppPropTypes from "../prop_types"

export class StageHelp extends Component {
  handleClick = () => {
    const { retro, actions: { showStageHelp } } = this.props
    showStageHelp(retro)
  }

  render() {
    return ReactDOM.createPortal(
      <div className="portal">
        <i
          title="Delete Idea"
          className="question circle icon"
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
        />
      </div>,
      document.getElementById("stage-help-icon")
    )
  }
}

const mapStateToProps = state => {
  return {
    retro: state.retro,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

StageHelp.propTypes = {
  retro: PropTypes.object.isRequired,
  actions: AppPropTypes.actions.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(StageHelp)
