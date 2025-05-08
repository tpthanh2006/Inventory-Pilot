import React, { useEffect, useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import './UserList.scss'
import UserStats from '../userStats/UserStats'
import Search from '../../components/search/Search'
import ChangeRole from '../../components/changeRole/ChangeRole'
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser"
import { AdminStaffLink } from '../../components/protect/hiddenLink'
import { getUsers } from '../../redux/features/auth/authSlice'
import { SpinnerImg } from '../../components/loader/Loader'

const UserList = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  // Handle Search State
  const [search, setSearch] = useState("");
  const { users, isLoading, isLoggedIn, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
      <div>
        <UserStats />

        <div className='user-list'>
          {isLoading && <SpinnerImg/>}
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

            {/* Table */}
            {!isLoading && users.length === 0 ? (
              <p>No user found...</p>
            ) : (
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
                  {users.map((user, index) => {
                    const { _id, name, email, role } = user;

                    return (
                      <tr key={_id}>
                        <td>{index + 1}</td>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>{role}</td>
                        <td>
                          <ChangeRole />
                        </td>
                        <td>
                          <span>
                            <FaTrashAlt color='red' size={20}/>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            
          </div>
        </div>
      </div>
  )
}

export default UserList;