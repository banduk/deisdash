/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import { Link } from 'react-router'
import classnames from 'classnames'
import GoogleButton from 'react-google-button'

import Controller from './Controller'
import Register from './Register'
import Login from './Login'
import AboutModal from './AboutModal'

// import logoImg from '../../static/deis-logo.png'
import animationGif from '../../static/animation.gif'
import deisDashLogo from '../../static/deis-dash-logo-md.png'

import ClientOAuth2 from 'client-oauth2'

const googleAuth = new ClientOAuth2({
  clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
  authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
  redirectUri: process.env.GOOGLE_AUTH_REDIRECT_URL,
  scopes: ['email', 'profile'],
  query: {
    access_type: 'offline',
    prompt: 'consent'
  },
})

const modals = ['about']

class Auth extends Component {
  constructor(props) {
    super(props)
    this.closeModal = this.closeModal.bind(this)
  }

  closeModal() {
    this.props.dispatch(routeActions.push('/'))
  }

  maybeRedirect(props) {
    const { dispatch, user, route } = props
    // user is logged in
    if (user && user.token && !modals.includes(route.path)) {
      dispatch(routeActions.push('/dash'))
    }
  }

  componentWillMount() {
    this.maybeRedirect(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.maybeRedirect(nextProps)
  }

  render() {
    const { controllerInfo, route, version } = this.props
    console.log(this.props)
    // put isElectron in redux state?
    const isElectron = process.env.ELECTRON
    const validController = controllerInfo && controllerInfo.isValid
    const extraClass = validController ? '' : 'hide'
    const className = `col-md-6 ${extraClass}`

    const showAbout = route.path === 'about'

    return (
      <div className="container-auth">
        <AboutModal show={showAbout} onHide={this.closeModal} />
        <div className="col-md-8 col-md-offset-2">
          <div className={classnames({ 'col-md-12': true, hide: isElectron, 'splash-links': true })}>
            {/*
              TODO...
              <a href="/installers/Deis%20Dash.dmg" className="btn btn-link">Mac App (preview!)</a>
              */}
              <Link to="/about" className="btn btn-link">About</Link>
            </div>
            <div className="text-center header">
              <img src={deisDashLogo} alt="deis logo" />
              <span> Deis Dash</span>
              <span className="version">{version}</span>
            </div>
            <div className="">
              <div className="col-md-12">
                <div className="box">
                  <Controller />
                </div>
              </div>
              <div className={classnames({ 'text-center': true, hide: validController || isElectron })} style={{"margin-bottom": "20px"}}>
                <img
                  src={animationGif}
                  alt="deisdash animation"
                  width="730"
                  height="404"
                />
              </div>
              <div className="col-md-12 google-button-wrapper">
                <GoogleButton onClick={() => {
                  window.location = googleAuth.code.getUri()
                }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(s => ({
  user: s.user,
  controllerInfo: s.controllerInfo,
  version: s.version,
}))(Auth)
