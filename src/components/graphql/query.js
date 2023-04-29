import React from 'react';
import Loading from '../util/Loading';

export default function Query ({ loading, error, data, children }) {
    if (error) {
      return <p>ERROR: {error.message}</p>;
    }
    if (loading) {
      return (
        <Loading />
      );
    }
    if (!data) {
      return <p>Nothing to show...</p>;
    }
    if (data) {
      return children;
    }
  };
