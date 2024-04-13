import React, { useState } from "react";
import User from "./User";

const Users = () => {
  const [users, setUsers] = useState([
    {
      firstName: "Raj",
      lastName: "Thombare",
      _id: 1,
    },
  ]);

  return (
    <>
      <div className='font-bold mt-6 text-lg'>Users</div>
      <div className='my-2'>
        <input
          type='text'
          placeholder='Search users...'
          className='w-full px-2 py-1 border rounded border-slate-200'
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};

export default Users;
