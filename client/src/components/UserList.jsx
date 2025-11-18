const UserList = ({ users, currentUser, onSelectUser, selectedUser }) => {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li
          key={user.id}
          onClick={() => user.username !== currentUser && onSelectUser(user)}
          style={{
            fontWeight: selectedUser?.id === user.id ? 'bold' : 'normal',
            color: user.username === currentUser ? '#007bff' : 'inherit',
          }}
        >
          {user.username} {user.username === currentUser && '(You)'}
        </li>
      ))}
    </ul>
  );
};

export default UserList;