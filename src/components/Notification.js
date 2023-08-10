const Notification = ({ message }) => {
  if (message.body === null) {
    return null;
  }
  if (message.error === false) {
    return <div className="notification">{message.body}</div>;
  } else {
    return <div className="error">{message.body}</div>;
  }
};

export default Notification;
