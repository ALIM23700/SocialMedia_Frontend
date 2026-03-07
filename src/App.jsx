import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './Components/ProtectedRoute';
import Profile from './pages/Profile';
import Story from './pages/Story';
import Reels from './pages/Reels';
import Create from './pages/Create';
import Post from './pages/Post';
import SideBar from './Components/SideBar';


function App() {
  return (
    <BrowserRouter>
    <SideBar></SideBar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
         <Route
          path="/profile"
          element={
            <ProtectedRoute>
             <Profile></Profile>
            </ProtectedRoute>
          }
        />
        <Route
          path="/story"
          element={
            <ProtectedRoute>
            <Story></Story>
            </ProtectedRoute>
          }
        />
         <Route
          path="/reels"
          element={
            <ProtectedRoute>
            <Reels></Reels>
            </ProtectedRoute>
          }
        />
         <Route
          path="/notification"
          element={
            <ProtectedRoute>
           <Notification></Notification>
            </ProtectedRoute>
          }
        />
         <Route
          path="/create"
          element={
            <ProtectedRoute>
          <Create></Create>
            </ProtectedRoute>
          }
        />
          <Route
          path="/post"
          element={
            <ProtectedRoute>
          <Post></Post>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
