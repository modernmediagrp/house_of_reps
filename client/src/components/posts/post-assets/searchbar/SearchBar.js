import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import InputGroup from '../../../common/InputGroup'


class SearchBar extends Component {
  state = {
    matches: '',
    showMatches: ''
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onMouseEnter = () => {
    this.setState({ showMatches: true })
  }

  onMouseLeave = () => {
    this.setState({ showMatches: false })
  }

  render() {
    return (
      <div 
        className='searchbar' 
        onMouseEnter={this.onMouseEnter} 
        onMouseLeave={this.onMouseLeave} 
        style={{
          position: 'relative',
          zIndex: 2,
          height: '40px'
        }}>
        <input  
          className='searchbar_input'
          placeholder=' search reps'
          name='matches'
          value={ this.state.matches }
          onChange={ this.onChange } 
        />
        { this.state.showMatches 
          ? <ul style={{ listStyle: 'none', textAlign: 'end', position: 'absolute', top: '60%', right: 0 }}>
            { this.props.profiles 
              ? this.props.profiles.map(profile => (
                profile.handle.toLowerCase().includes(this.state.matches.toLowerCase()) || 
                profile.user.name.toLowerCase().includes(this.state.matches.toLowerCase()) || 
                profile.stageName.toLowerCase().includes(this.state.matches.toLowerCase()) 
                  ? <li className='searchbar_items'  key={profile.user._id}>
                      <Link 
                        to={`/profile/${profile.handle}`} 
                        className='searchbar_links'>
                          @{profile.handle}
                      </Link>
                    </li> 
                  : null
                )) 
              : null 
            } 
            </ul> 
          : null 
        }
      </div>
    )
  }
}

export default SearchBar
