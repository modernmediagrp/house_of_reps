import React from 'react'
import Moment from 'react-moment'

import './NestedCommentNameAvatarDate.css'

const NestedCommentNameAvatarDate = ({ nestedComment }) => nestedComment && (
  <div className='nested_comment_name_avatar_date_container'>
    <img className='nested_comment_avatar' src={nestedComment.avatar} alt="user avatar"/>
    <div>
      <p className='nested_comment_name'>{nestedComment.name}</p>
      <p className='nested_comment_date'>
        <Moment format='ddd, ll LT'>{ nestedComment.date }</Moment>
      </p>
    </div>
  </div>
)

export default NestedCommentNameAvatarDate