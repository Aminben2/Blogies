import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsers } from "../store/usersSlice"
const AuthorPost = ({ userId }) => {
    const { users } = useSelector(state => state.users)
    const dispatch = useDispatch()
    React.useEffect(() => {
        dispatch(getUsers())
    }, [dispatch])


    const user = users.find(user => user._id === userId)
    return (
        <>
            {user && <span className="auth dark:text-gray-400">~~by {user.firstName} {user.lastName}</span>}
        </>
    )
}

export default AuthorPost