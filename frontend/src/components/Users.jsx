import React, { useState, useEffect } from "react";
import User from "./User";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const getUsers = async () => {
    const response = await axios(
      `http://localhost:3000/api/v1/user/bulk?filter=${searchText}`,
    );
    setUsers(response.data.user);
  };

  useEffect(() => {
    getUsers();
  }, [searchText]);

  return (
    <>
      <div className='font-bold mt-6 text-lg'>Users</div>
      <div className='my-2'>
        <input
          type='text'
          placeholder='Search users...'
          className='w-full px-2 py-1 border rounded border-slate-200'
          onChange={(e) => setSearchText(e.target.value)}
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
