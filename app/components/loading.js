import React from 'react';

class Loading extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="d-flex justify-content-center mt-3">
        <div className="spinner-grow text-dark" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
}

export default Loading;