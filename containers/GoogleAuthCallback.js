import React from "react"
import { connect } from "react-redux"
import { login } from "../actions/deis"

class GoogleAuthCallback extends React.Component {
  componentDidMount() {
    const redirectUri = encodeURIComponent(process.env.GOOGLE_AUTH_REDIRECT_URL)
    this.props.dispatch(login(this.props.code, redirectUri))
  }

  componentDidUpdate() {
    const { token, username } = this.props.user
    if (token && username) window.location = "/dash/apps" 
  }

  render() {
    return <div />
  }
}

export default connect((state, ownProps) => ({
  code: ownProps.location.query.code,
  user: state.user || {}
}))(GoogleAuthCallback)
