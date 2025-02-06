import React from 'react'
import SideBar from '../components/SideBar'
import Sidebar from '../components/SideBar';
import ChatWindow from '../components/ChatWindow';

const Home = () => {

    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user)
  return (
    <div className='flex h-screen bg-gray-100'>
        <Sidebar/>
        <ChatWindow/>
    </div>
  )
}

export default Home