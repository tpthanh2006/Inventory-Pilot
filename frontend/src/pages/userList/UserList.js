import React, { useEffect, useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"

import './UserList.scss'
import UserStats from '../userStats/UserStats'
import Search from '../../components/search/Search'
import ChangeRole from '../../components/changeRole/ChangeRole'
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser"
import { deleteUser, getUsers, selectUser } from '../../redux/features/auth/authSlice'
import { SpinnerImg } from '../../components/loader/Loader'
import { FILTER_USERS, selectUsers } from '../../redux/features/auth/filterSlice'

const UserList = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  // Handle Search State
  const [search, setSearch] = useState("");
  const thisUser = useSelector(selectUser);
  const { users, isLoading } = useSelector((state) => state.auth);
  const filteredUsers = useSelector(selectUsers);

  const removeUser = async (id) => {
    await dispatch(deleteUser(id));
    dispatch(getUsers());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete This User",
      message: "Are you sure to do delete this user?",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeUser(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(FILTER_USERS({ users, search }));
  }, [dispatch, users, search]);

  if (thisUser.role === "subscriber" || thisUser.role === "suspended") {
    return (
      <div className='--flex-center'>
        <h3>This page is only available for admins or staffs</h3>
      </div>
    );
  };
  
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
            {!isLoading && users?.length === 0 ? (
              <>No User Found</>
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
                  {filteredUsers?.map((user, index) => {
                    const { _id, name, email, role } = user;

                    return (
                      <tr key={_id}>
                        <td>{index + 1}</td>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>{role}</td>
                        <td>
                          <ChangeRole 
                            _id={_id}
                            email={email}
                          />
                        </td>
                        <td>
                          <span>
                            <FaTrashAlt
                              color='red'
                              size={20}
                              onClick={() => confirmDelete(_id)}
                            />
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