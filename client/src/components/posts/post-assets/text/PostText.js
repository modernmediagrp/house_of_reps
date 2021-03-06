import React from 'react'
import reactStringReplace from 'react-string-replace'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import './PostText.css'

export default function PostText({ postText, color, fontSize }) {
  let replacedText

  // Match URLs
  replacedText = reactStringReplace(
    postText,
    /(https?:\/\/\S+)/g,
    (match, i) => (
      <a
        className="post_text_urls"
        key={match + i}
        href={match}
        target="_blank"
        rel="noopener noreferrer"
      >
        {match}
      </a>
    )
  )

  // Match @-mentions
  replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
    <Link
      className="post_text_mentions"
      key={match + i}
      to={`/profile/${match}`}
    >
      @{match}
    </Link>
  ))

  // Match hashtags
  replacedText = reactStringReplace(replacedText, /#(\w+)/g, (match, i) => (
    <Link
      className="post_text_hashtags"
      key={match + i}
      to={`/hashtag/${match}`}
    >
      #{match}
    </Link>
  ))

  return (
    <p className="post_content" style={{ color, fontSize }}>
      {replacedText}
    </p>
  )
}

PostText.defaultProps = {
  color: 'var(--text-color)',
  fontSize: '16px'
}

PostText.propTypes = {
  postText: PropTypes.string.isRequired,
  color: PropTypes.string,
  fontSize: PropTypes.string
}
