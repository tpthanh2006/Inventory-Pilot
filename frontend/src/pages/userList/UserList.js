import React, { useState } from 'react'

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
      </div>
    </div>
  )
}

export default UserList