import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RedirectToRoom = () => {
  const { anything } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (anything) {
      navigate(`/room/${anything}`, { replace: true });
    }
  }, [anything, navigate]);

  return null;
};

export default RedirectToRoom;