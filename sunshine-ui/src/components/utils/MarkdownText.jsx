import React from 'react';
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types';

function MarkdownText(props) {
  const { text } = props;

  const lines = Array.isArray(text) ? text : [text];

  return (
    <React.Fragment>
      {lines.map((l, i) => (
        <ReactMarkdown children={l} linkTarget={'_blank'} />
      ))}
    </React.Fragment>
  );
}

MarkdownText.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  component: PropTypes.elementType,
  gutterBottom: PropTypes.bool,
};

MarkdownText.defaultProps = {
  component: 'p',
  variant: 'inherit',
  gutterBottom: true,
};

export default MarkdownText;
