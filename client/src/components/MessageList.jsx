import Message from './Message';

const MessageList = ({ messages, currentUser, onReact }) => {
  return (
    <div>
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          isOwn={message.sender === currentUser}
          onReact={onReact}
        />
      ))}
    </div>
  );
};

export default MessageList;