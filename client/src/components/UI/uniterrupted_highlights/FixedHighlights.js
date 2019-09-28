import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getProfiles } from '../../../actions/profileActions'
import Arrow from '../arrow_glyph/Arrow'
import './FixedHighlights.css'

class FixedHighlights extends Component {
  state = { 
    currentImageIndex: 0,
    recentHighlights: []
  }

  componentDidMount() {
    this.props.getProfiles()
    .then(() => {
      const hls = this.props.profile &&  this.props.profile.profiles && this.props.profile.profiles
      .map(profile => profile.venues)
      .map(val => val.length ? val[0] : null)
      .filter(val => val !== null)
      const highlights = [].concat.apply([], hls)
      const recentHighlights = highlights && highlights.sort((a,b) => new Date(b.dateCreated) - new Date(a.dateCreated))
      this.setState({ recentHighlights })
    })
  }

  componentDidUpdate(prevProps) {
    if(this.props.currentIndex !== prevProps.currentIndex) {
      this.setState({ currentImageIndex: this.props.currentIndex })
    }
    if(this.props.profile !== prevProps.profile) {
      const hls = this.props.profile &&  this.props.profile.profiles && this.props.profile.profiles
      .map(profile => profile.venues)
      .map(val => val.length ? val[0] : null)
      .filter(val => val !== null)
      const highlights = [].concat.apply([], hls)
      const recentHighlights = highlights && highlights.sort((a,b) => new Date(b.dateCreated) - new Date(a.dateCreated))
      this.setState({ recentHighlights })
    }
  }

  previousSlide = () => {
    const { recentHighlights } = this.state 
    const { currentImageIndex } = this.state 
    const lastIndex = recentHighlights.length - 1
    const shouldResetIndex = currentImageIndex === 0
    const index = shouldResetIndex ? lastIndex : currentImageIndex - 1
    this.setState({ currentImageIndex: index })
  }

  nextSlide = () => {
    const { recentHighlights } = this.state 
    const { currentImageIndex } = this.state 
    const lastIndex = recentHighlights.length - 1
    const shouldResetIndex = currentImageIndex === lastIndex
    const index = shouldResetIndex ? 0 : currentImageIndex + 1
    this.setState({ currentImageIndex: index })
  }

  render() {
    const { recentHighlights, currentImageIndex } = this.state
    const { profiles } = this.props.profile
    if(!this.props.showHighlight) return null
    if(!profiles || !recentHighlights.length) return null

    return  recentHighlights[currentImageIndex] && recentHighlights[currentImageIndex].video && (
      <div className='fixed_highlights_container'>
        <div className='fixed_highlights'>
          <Arrow direction='left' styleClass='slide-arrow' clickFunction={() => this.previousSlide()} glyph='&#9664;' />
          <iframe
            title={recentHighlights[currentImageIndex].video}
            src={recentHighlights[currentImageIndex].video} 
            frameBorder={0}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen={true}>
          </iframe>
          <img 
              onClick={() => this.props.toggleShowHighlight(currentImageIndex)}
              src={require('../../../img/hor-icon.jpg')} 
              alt='hors' 
              title='toggle modal'
            />
          <Arrow direction='right' styleClass='slide-arrow' clickFunction={() => this.nextSlide()} glyph='&#9654;' />
        </div>
      </div>
    )
  }
}

FixedHighlights.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(FixedHighlights) 