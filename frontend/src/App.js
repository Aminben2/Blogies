import "./App.css";
import { RootLayout } from "./layouts/RootLayout";
import { BlogLayout } from "./layouts/blogsLayout";
import AuthLayout from "./layouts/authLayout";
import { NotFound } from "./pages/NotFound";
import AddPostFrom from "./pages/addPostFrom";
import { Blog } from "./pages/blog";
import Blogs from "./pages/Blogs/blogs";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { Home } from "./pages/home";
import Contact from "./pages/Contact";
import Login from "./pages/login";
import { Signup } from "./pages/signup";
import Profile from "./pages/Profile/Profile";
import UserProfile from "./pages/Profile/UserProfile";
import About from "./pages/About";
import Chats from "./pages/Chats";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="/" element={<Home />} />
      <Route element={<AuthLayout />}>
        <Route path="/blogs" element={<BlogLayout />}>
          <Route index element={<Blogs />} />
          <Route path="/blogs/:id" element={<Blog />} />
        </Route>
        <Route path="/addBlog" element={<AddPostFrom />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/chats" element={<Chats />} />
      </Route>
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;



