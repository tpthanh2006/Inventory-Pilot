import React, { useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'

import './UserList.scss'
import UserStats from '../userStats/UserStats'
import Search from '../../components/search/Search'

const UserList = () => {
  // Handle Search State
  const [search, setSearch] = useState("");

  return (
    <div>
      <UserStats />

      <div className='user-list'>
        <div className='table'>
          <div className='--flex-between'>
            <span>
              <h3 className='--mt'>All Users</h3>
            </span>

            <span>
              <Search
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={"Search users"}
              />
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Change Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Phu Thanh Tran</td>
                <td>tranpthanh2006@gmail.com</td>
                <td>Admin</td>
                <td>
                  Change Role
                </td>
                <td>
                  <span>
                    <FaTrashAlt color='red' size={20}/>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserList