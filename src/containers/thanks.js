import React from 'react'
import PropTypes from 'prop-types'
import { actions as petitionActions } from '../actions/petitionActions'
import { md5ToToken } from '../lib'
import ShareMessage from './share-message'

import ThanksComponent from 'LegacyTheme/thanks'
import TwitterButton from 'LegacyTheme/twitter-button'
import FacebookButton from 'LegacyTheme/facebook-button'
import MailButton from 'LegacyTheme/mail-button'
import CopyPaste from 'LegacyTheme/copy-paste'
import RawLink from 'LegacyTheme/raw-link'

function getPre(fromSource, petition) {
  const isCreator = false // Maybe test user.id==petition.creator_id or something, if we want to expose that
  let pre = (isCreator ? 'c' : 's')
  const { _embedded: { creator } = {} } = petition
  if (fromSource) {
    if (/^(c\.|s\.icn)/.test(fromSource)) {
      pre += '.icn'
    } else if (creator && creator.source // megapartner
                 && (fromSource === 'mo' || /\.imn/.test(fromSource))) {
      pre += '.imn'
    }
  }
  return pre
}

function getTrackingParams(signatureMessage, user) {
  let trackingParams = ''
  if (user && user.signonId) {
    trackingParams = `r_by=${user.signonId}`
  } else if (signatureMessage && signatureMessage.messageMd5) {
    const hashToken = md5ToToken(signatureMessage.messageMd5)
    trackingParams = `r_hash=${hashToken}`
  }
  return trackingParams
}

class Thanks extends React.Component {
  constructor(props) {
    super(props)
    const { petition, fromSource, signatureMessage, user } = props

    this.trackingParams = getTrackingParams(signatureMessage, user)

    this.shortLinkArgs = [
      petition.petition_id,
      user && user.signonId,
      signatureMessage && signatureMessage.messageMd5]

    this.state = {
      sharedSocially: false,
      pre: getPre(fromSource, petition)
    }

    this.recordShare = this.recordShare.bind(this)
    this.renderTwitter = this.renderTwitter.bind(this)
    this.renderFacebook = this.renderFacebook.bind(this)
    this.renderMail = this.renderMail.bind(this)
    this.renderCopyPaste = this.renderCopyPaste.bind(this)
    this.renderRawLink = this.renderRawLink.bind(this)
  }

  recordShare(medium, source) {
    return () => {
      this.setState({ sharedSocially: true })
      petitionActions.recordShareClick(this.props.petition, medium, source, this.props.user)
    }
  }

  renderTwitter() {
    return (
      <TwitterButton
        isCreator={this.isCreator}
        petition={this.props.petition}
        shortLinkArgs={this.shortLinkArgs}
        recordShare={this.recordShare('twitter', `${this.state.pre}.tw`)}
      />
    )
  }

  renderFacebook() {
    return (
      <FacebookButton
        petition={this.props.petition}
        user={this.props.user}
        pre={this.state.pre}
        recordShare={this.recordShare('facebook', `${this.state.pre}.fb`)}
        trackingParams={this.trackingParams}
      />
    )
  }

  renderMail() {
    return (
      <ShareMessage
        isCreator={this.isCreator}
        petition={this.props.petition}
        pre={this.state.pre}
        trackingParams={this.trackingParams}
      >
        <MailButton />
      </ShareMessage>
    )
  }

  renderCopyPaste() {
    return (
      <ShareMessage
        isCreator={this.isCreator}
        petition={this.props.petition}
        pre={this.state.pre}
        recordShare={this.recordShare('email', `${this.state.pre}.em.cp`)}
        trackingParams={this.trackingParams}
      >
        <CopyPaste />
      </ShareMessage>
    )
  }

  renderRawLink() {
    return (
      <ShareMessage
        isCreator={this.isCreator}
        petition={this.props.petition}
        pre={this.state.pre}
        recordShare={this.recordShare('email', `${this.state.pre}.ln.cp`)}
        trackingParams={this.trackingParams}
        shortLinkArgs={this.shortLinkArgs}
      >
        <RawLink />
      </ShareMessage>
    )
  }

  render() {
    return (
      <ThanksComponent
        petition={this.props.petition}
        sharedSocially={this.state.sharedSocially}
        isCreator={this.isCreator}
        renderTwitter={this.renderTwitter}
        renderFacebook={this.renderFacebook}
        renderMail={this.renderMail}
        renderCopyPaste={this.renderCopyPaste}
        renderRawLink={this.renderRawLink}
      />
    )
  }
}

Thanks.propTypes = {
  petition: PropTypes.object,
  user: PropTypes.object,
  signatureMessage: PropTypes.object,
  fromSource: PropTypes.string
}

export default Thanks
