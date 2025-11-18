const Message = ({ message, isOwn, onReact }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const className = `message ${message.system ? 'system' : ''} ${
    message.isPrivate ? 'private' : ''
  } ${isOwn ? 'own' : ''}`;

  const reactions = ['👍', '❤️', '😂', '😮', '😢'];

  return (
    <div className={className}>
      {!message.system && (
        <strong>{message.sender}</strong>
      )}
      {message.system ? (
        <span>{message.message}</span>
      ) : (
        <p>{message.message}</p>
      )}
      <small>{formatTime(message.timestamp)}</small>
      {!message.system && (
        <div className="reactions">
          {reactions.map((reaction) => (
            <button
              key={reaction}
              onClick={() => onReact(message.id, reaction)}
              className="reaction-btn"
            >
              {reaction} {message.reactions?.[reaction]?.length || 0}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;