import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux' 
import PropTypes from 'prop-types' 
import { withRouter } from 'react-router-dom'
import classnames from 'classnames' 
import Moment from 'react-moment' 
import { deletePost, addLike, removeLike } from '../../actions/postActions'
import CommentsModal from '../UI/modal/CommentsModal'
import Backdrop from '../UI/backdrop/Backdrop'
import PostText from './post-assets/post_comment_text/PostText'
import PostModalText from './post-assets/post_comment_text/PostModalText'

// For comments 
import CommentFeed from '../post/CommentFeed'
import CommentForm from '../post/CommentForm'

import './PostItem.css'


 
class PostItem extends Component {

  // For comments 
  state = { 
    showComments: false, 
    text: '',
    postComments: [],
    likes: [...this.props.post.likes],
    liked: false,
    showModal: false
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.post.comments !== prevState.postComments) {
      this.setState({ postComments: this.props.post.comments })
    }
    if(this.props.post.likes !== prevState.likes) {
      this.setState({ likes: this.props.post.likes })
    }
  }

  onDeleteClick = id => {
    this.props.deletePost(id) 
  }

  onLikeClick = id => {
    this.props.addLike(id)
    this.setState(prevState => ({ likes: prevState.likes, liked: true }))
  }

  onUnlikeClick = id => {
    this.props.removeLike(id)
    this.setState(prevState => ({ likes: prevState.likes, liked: false }))
  }

  findUserLike = likes => {
    const { auth } = this.props 
  
    return likes.filter(like => like.user === auth.user.id).length > 0
  }

  modalToggle = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }))
  }

  modalShow = () => {
    this.setState({ showModal: true })
  }

  userNameOrAvatarClicked = postId => {
    this.props.profiles.map(profile =>  {
      if(profile.user._id === postId) {
        this.props.history.push(`/profile/${profile.handle}`)
      }
    })
  }

  render() {
    const { post, auth, showActions } = this.props 
    const { showComments, text, postComments, likes } = this.state 

    let youtubeUrl = post.url
    
    youtubeUrl && youtubeUrl.includes('https://www.youtube' || 'https://youtu.be') 
      ? youtubeUrl = post.url.replace(/youtu\.be/gi, 'www.youtube.com')
                             .replace(/watch\?v=/gi, 'embed/')
                             .replace(/&feature=www\.youtube\.com/gi, '')
      : youtubeUrl = null 

    const postModal = this.state.showModal ? (
      <Fragment> 
        <CommentsModal>
          <div>
            {/* <p id='comment-modal-text'>{post.text}</p> */}
            <PostModalText postText={post.text} />
            <img src={post.media} alt="uploaded" style={{maxWidth: '100%', maxHeight: '600px'}} />
          </div>
        </CommentsModal>
      </Fragment>
    ) : null 

    return (
     <Fragment>
     <Backdrop clicked={this.modalToggle} show={this.state.showModal} />
     {postModal}
     <div className='posts_container'>
      <div className='post_avatar_and_name'>
        <img className='post_avatar_img' onClick={()=> this.userNameOrAvatarClicked(post.user)} src={post.avatar} alt={post.name} />
        <div style={{ display: 'flex', flexDirection: 'column'  }}>
          <p className='post_name' onClick={() => this.userNameOrAvatarClicked(post.user)}>{post.name}</p>
          <p className='post_feed_date'><Moment format='ddd, ll LT'>{post.date}</Moment></p>
        </div>
      </div>

      <div>
        { !post.description && !post.image && !post.title && !post.url && !post.media
          ? <PostText postText={post.text} />
          : post.media 
          ? ( <div>
                <PostText postText={post.text} />
                <img className='postfeed-media-pic' onClick={this.modalShow} src={post.media} alt="uploaded" />
              </div>
            )
          : ( <div className='post_content'>
                <PostText postText={post.text} />
                <div style={{ background: 'rgba(0, 0, 0, .5)', borderRadius: '5px' }}>
                  { youtubeUrl 
                  ? <div style={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
                      <iframe title='youtube' width="100%" height="300" src={youtubeUrl} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe> 
                    </div>
                  : <a href={post.url} target='_blank' rel='noopener noreferrer'>
                      <img src={post.image} alt='thumbnail' style={{ width: '100%' }} id='post-link-img' />
                    </a> 
                  }
                  <p style={{textAlign: 'center', fontSize: '12px'}}>{post.title}</p>
                  <p style={{textAlign: 'center', fontSize: '12px', padding: '0 5px 20px 5px'}}>{post.description}</p>
                </div>
              </div>
            )
        }
        { likes.length < 1 ? null : likes.length === 2 
          ? <div style={{ fontSize: '13px', color: 'rgb(29, 138, 255)'}}>Liked by {likes[0].name} and {likes[1].name}</div>
          : likes.length > 2 
          ? <div style={{ fontSize: '13px', color: 'rgb(29, 138, 255)'}}>Like by {likes[likes.length - 1].name} and {likes.length -1} others.</div>
          : <div style={{ fontSize: '13px', color: 'rgb(29, 138, 255)'}}> Liked by {likes.map(like => <span key={like.user} style={{color: 'rgb(29, 138, 255)'}}>{like.name} </span>)}</div>
        }
        { showActions ? ( <span>
          <button 
            title='like'
            className={this.state.liked ? 'postfeed_buttons liked' : classnames('postfeed_buttons', {
              'liked' : this.findUserLike(post.likes) 
            })}
            onClick={this.onLikeClick.bind(this, post._id)}
            >
            <i className='fas fa-thumbs-up icons like'></i>
            <span>{likes.length}</span>
          </button>
          <button 
            title='unlike'
            className='postfeed_buttons'
            onClick={this.onUnlikeClick.bind(this, post._id)}>
            <i className="fas fa-thumbs-down icons" id='unlike'></i>
          </button>
          <button 
            title='comment'
            onClick={() => this.setState((prevState, props) => ({ 
              text: props.post._id, 
              postComments: props.post.comments, 
              showComments: !prevState.showComments }))} 
            className='postfeed_buttons'>  
            <i className='fas fa-comment icons' id='comment'/>
            <span>{post.comments.length}</span>
          </button>
          { post.user === auth.user.id ? (
            <button 
              title='double click to delete'
              className='postfeed_buttons delete'
              onDoubleClick={this.onDeleteClick.bind(this, post._id)}>
              <i className="fas fa-times icons" />
            </button> 
            ) : null }
        </span>) : null 
        }
        { showComments ? (
          <div>
            <CommentForm postId={text} /> 
            <CommentFeed postId={text} comments={postComments} profiles={this.props.profiles}/>
          </div> 
          ) : null 
        }
      </div>
     </div>
     </Fragment>
    )
  }
}

PostItem.defaultProps = {
  showActions: true 
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  // post: state.post 
})


export default connect(mapStateToProps, { deletePost, addLike, removeLike })(withRouter(PostItem))