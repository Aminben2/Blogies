import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const Home = () => {


    const isDarkMOde = useSelector(state => state.theme)

    return (
        <div className='home flex flex-row justify-center items-center dark:bg-gray-800 bg-slate-50 h-screen '>
            <div className='get-started flex flex-row items-center justify-around w-fit'>
                <div className='flex flex-col gap-y-4 w-1/3 h-full '>
                    <p className='text-5xl font-bold dark:text-gray-200'>This is The place to share your best moments and thoutghs with the world</p>
                    <Link
                        to="/blogs"
                        className='font-bold bg-green-500 text-white p-4 shadow-2xl shadow-green-700/50 rounded-lg hover:bg-white dark:hover:bg-gray-100 hover:text-green-500 border-2 border-green-500 transition-colors duration-200 w-fit'
                    >Begin your Journey</Link>
                </div>
                <img src={isDarkMOde ? "./imgs/logo-bebo-light.png" : "./imgs/logo-bebo.png"} className='w-1/3 h-100' alt="" />
            </div>

        </div>
    )
}
