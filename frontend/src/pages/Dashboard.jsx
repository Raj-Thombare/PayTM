import React, { useState, useEffect } from "react";
import axios from "axios";
import { Appbar, Balance, Users } from "../components";

const Dashboard = () => {
  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
    const res = await axios("http://localhost:3000/api/v1/account/balance", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    setBalance(res.data.balance);
  };

  useEffect(() => {
    getBalance();
  }, [balance]);

  return (
    <div>
      <Appbar />
      <div className='m-8'>
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
};

export default Dashboard;
