import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./Components/ProtectedRoute";
import Profile from "./pages/Profile";
import Story from "./pages/Story";
import Reels from "./pages/Reels";
import Create from "./pages/Create";
import Post from "./pages/Post";
import SideBar from "./Components/SideBar";
import UpdateProfile from "./pages/UpdateProfile";
import Explore from "./pages/Explore";
import Alluser from "./pages/Alluser";
import Notification from "./pages/Notification";
import VisitorProfile from "./pages/VisitorProfile";
import Message from "./pages/Message";

function App() {
  return (
    <BrowserRouter>
      <SideBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/story/:id"
          element={
            <ProtectedRoute>
              <Story />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reels"
          element={
            <ProtectedRoute>
              <Reels />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <Post />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alluser"
          element={
            <ProtectedRoute>
              <Alluser />
            </ProtectedRoute>
          }
        />

        {/* Messages */}
        <Route
          path="/message"
          element={
            <ProtectedRoute>
              <Message />
            </ProtectedRoute>
          }
        />
        <Route
          path="/message/:userId"
          element={
            <ProtectedRoute>
              <Message />
            </ProtectedRoute>
          }
        />

        {/* Visitor Profile */}
        <Route
          path="/visitor/:userId"
          element={<VisitorProfile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;