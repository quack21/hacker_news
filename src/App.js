import React from 'react';
import Footer from './components/Footer/footer';
import Header from './components/Header/header';
import PostPage from './components/PostPage/postPage';
import NotFound from './components/NotFound/notFound';
import { Route, Routes } from 'react-router-dom';
import PostContainer from './components/PostContainer/postContainer';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<PostContainer />} />
        <Route path="/post/:storyId" element={<PostPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
