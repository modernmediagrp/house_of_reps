import React, { Component } from 'react'
import PropTypes from 'prop-types' 
import PostItem from './PostItem'


class PostFeed extends Component {
  render() {
    const { posts } = this.props
    return posts.map(post => (
      <PostItem 
        key={post._id} 
        post={post} 
        profiles={this.props.profiles} 
        likesPopupHandler={this.props.likesPopupHandler}
        showLikesPopup={this.props.showLikesPopup}
        removePopup={this.props.removePopup}
      /> 
    ))
  }
}

PostFeed.propTypes = {
  posts: PropTypes.array.isRequired
}

export default PostFeed