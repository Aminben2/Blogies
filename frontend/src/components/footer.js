import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const Footer = () => {

    const isDarkMOde = useSelector(state => state.theme)
    return (
        <footer className="bottom-0 left-0 w-full bg-white dark:bg-gray-900 p-8 border-t border-t-green-500  dark:text-gray-200">
            <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white dark:bg-gray-900 text-center md:justify-between">
                <img src={isDarkMOde ? "./imgs/logo-bebo-light.png" : "./imgs/logo-bebo.png"} alt="logo-ct" className="w-10" />
                <ul className="flex flex-wrap items-center  gap-y-2 gap-x-8">
                    <li>
                        <NavLink
                            to="/"
                            className="block font-sans font-normal leading-relaxed text-blue-gray-900 antialiased transition-colors hover:text-green-500 text-xl focus:text-green-500"
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/blogs"
                            className="block font-sans text-xl font-normal leading-relaxed text-blue-gray-900 antialiased transition-colors hover:text-green-500 focus:text-green-500"
                        >
                            All Blogs
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/contact"
                            className="block font-sans text-xl font-normal leading-relaxed text-blue-gray-900 antialiased transition-colors hover:text-green-500 focus:text-green-500"
                        >
                            Contact us
                        </NavLink>
                    </li>
                </ul>
            </div>
            <hr className="my-8 border-blue-gray-50 dark:border-green-500" />
            <p className="block text-center font-sans text-base font-normal leading-relaxed text-blue-gray-900 antialiased">
                © 2023 ~ Blogies made by vibe
            </p>
        </footer>
    )
}

export default Footer