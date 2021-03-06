import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { deletePost, addLike, removeLike } from '../../../actions/postActions'
import { getProfileByHandle } from '../../../actions/profileActions'
import CommentsModal from '../../UI/modal/comments-modal/CommentsModal'
import Backdrop from '../../UI/backdrop/Backdrop'
import CommentFeed from '../comments/comment_feed/CommentFeed'
import CommentForm from '../comments/comment_form/CommentForm'
import PostItemButtons from '../post-assets/post_item_assets/PostItemButtons'
import PostBody from '../post-assets/post_item_assets/post_item_body/PostBody'
import PostItemLikes from '../post-assets/post_item_assets/PostItemLikes'
import NameAvatarDate from '../post-assets/post_item_assets/NameAvatarDate'
import './PostItem.css'

class PostItem extends Component {
  state = {
    showComments: false,
    postId: '',
    postComments: [],
    likes: [],
    liked: false,
    showModal: false,
    showPopup: false,
    showLikesPopup: false,
    editPost: false
  }

  componentDidMount() {
    document.addEventListener('click', this.onOutsideClick, true)
    this.setState({ likes: this.props.post.likes })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.post.comments !== prevState.postComments) {
      this.setState({ postComments: this.props.post.comments })
    }
    if (this.props.post.likes !== prevState.likes) {
      this.setState({ likes: this.props.post.likes })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onOutsideClick, true)
  }

  onOutsideClick = e => {
    const domNode = ReactDOM.findDOMNode(this)
    if (!domNode || !domNode.contains(e.target)) {
      this.setState({ showLikesPopup: false })
    }
  }

  onDeleteClick = id => {
    let res = window.confirm('Are you sure you want to delete this post?')
    if (res) this.props.deletePost(id)
  }

  onLikeClick = id => {
    this.props.addLike(id)
    this.setState(prevState => ({ likes: prevState.likes, liked: true }))
  }

  onUnlikeClick = id => {
    this.props.removeLike(id)
    this.setState(prevState => ({ likes: prevState.likes, liked: false }))
  }

  findUserLike = likes =>
    likes.filter(like => like.user === this.props.auth.user.id).length > 0

  modalToggle = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }))
  }

  userNameOrAvatarClickedLikesPopup = handle => {
    if (this.props.location.pathname.includes('/profile')) {
      this.props.getProfileByHandle(handle)
    }
    this.props.history.push(`/profile/${handle}`)
  }

  popupHandler = () => {
    this.setState(prevState => ({ showPopup: !prevState.showPopup }))
  }

  likesPopupHandler = () =>
    this.setState(prevState => ({ showLikesPopup: !prevState.showLikesPopup }))

  removePopup = e => {
    if (!e.target.closest('.popup')) {
      this.setState(prevState => ({ showLikesPopup: false }))
    }
  }

  onPostCommentClick = () =>
    this.setState((prevState, props) => ({
      postId: props.post._id,
      postComments: props.post.comments,
      showComments: !prevState.showComments
    }))

  moreVertClicked = postId => {
    if (postId !== this.props.auth.user.id) {
      alert("You didn't say the magic word!")
    } else {
      let res = window.confirm('Edit post?')
      if (res === true) this.setState({ editPost: true })
      else this.setState({ editPost: false })
    }
  }

  toggleEditPost = () =>
    this.setState(prevState => ({ editPost: !prevState.editPost }))

  render() {
    const { post, auth, profile } = this.props
    const {
      showComments,
      postId,
      postComments,
      likes,
      showLikesPopup,
      showModal,
      showPopup,
      liked,
      editPost
    } = this.state

    const postModal = showModal && (
      <CommentsModal showModal={showModal}>
        <img src={post.media} alt="uploaded" />
      </CommentsModal>
    )

    return (
      <>
        <Backdrop clicked={this.modalToggle} show={showModal} />
        {postModal}
        <div className="posts_container" onClick={this.removePopup}>
          <NameAvatarDate
            moreVertClicked={this.moreVertClicked}
            popupHandler={this.popupHandler}
            profile={profile}
            post={post}
            showPopup={showPopup}
            userNameOrAvatarClickedLikesPopup={
              this.userNameOrAvatarClickedLikesPopup
            }
          />
          <div>
            <PostBody
              post={post}
              modalToggle={this.modalToggle}
              editPost={editPost}
              toggleEditPost={this.toggleEditPost}
            />
            <PostItemLikes
              likes={likes}
              likesPopupHandler={this.likesPopupHandler}
              showLikesPopup={showLikesPopup}
              userNameOrAvatarClickedLikesPopup={
                this.userNameOrAvatarClickedLikesPopup
              }
            />
            <PostItemButtons
              post={post}
              likes={likes}
              auth={auth}
              liked={liked}
              findUserLike={this.findUserLike}
              onLikeClick={this.onLikeClick}
              onUnlikeClick={this.onUnlikeClick}
              onDeleteClick={this.onDeleteClick}
              onPostCommentClick={this.onPostCommentClick}
            />
            {showComments && (
              <div>
                {<CommentForm postId={postId} />}
                <CommentFeed
                  postId={postId}
                  comments={postComments}
                  profiles={profile.profiles}
                />
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  getProfileByHandle: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(
  mapStateToProps,
  {
    deletePost,
    addLike,
    removeLike,
    getProfileByHandle
  }
)(withRouter(PostItem))
