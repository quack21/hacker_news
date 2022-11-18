import { Link, useParams } from 'react-router-dom';
import styles from './postPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { movedFromPostPage } from '../../redux/slices/loadingSlice';
import axios from 'axios';
import React from 'react';
import Comment from '../Comments/comment';

function PostPage() {
  const dispatch = useDispatch();

  let { storyId } = useParams()
  
  const fromNewPage = useSelector((state) => state.loading.newPage);

  const story = React.useRef({});

  const [isReady, setIsReady] = React.useState(false);

  function getTime(time) {
    const date = new Date(time * 1000);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return month + '.' + day + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  async function getStoryById() {
    await axios
      .get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`)
      .then((res) => (story.current = res.data))
      .catch((err) => err);
  }

  React.useEffect(() => {
    getStoryById()
      .then(() => setIsReady(true))
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);

  function convert(txt) {
    const cleanHyperText = (markup) =>
      new DOMParser().parseFromString(markup, 'text/html').body.textContent;
    return cleanHyperText(txt);
  }

  if (isReady) {return (
    <div className={styles.wrapper}>
      <Link
        to='/'
        onClick={() =>
          fromNewPage ? dispatch(movedFromPostPage(false)) : dispatch(movedFromPostPage(true))
        }
        className={styles.toMainPageButton}>
        Move to the main page
        <button>←</button>
      </Link>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.titleBlock}>
            <div className={styles.title}>
              {story.current.title}
              <div className={styles.underTitle}>
                <div className={styles.author}>Author: {story.current.by}</div>
                <div className={styles.date}>Date: {getTime(story.current.time)}</div>
              </div>
            </div>
          </div>
          {story.current.text ? (
            <div className={styles.text}>{convert(story.current.text)}</div>
          ) : (
            <div className={styles.url}><a href={story.current.url} className={styles.urlRef} target='_blank' rel='noreferrer'>{story.current.url}</a></div>
          )}

          <div className={styles.wrapperCommentsArea}>
            <div className={styles.commentsArea}>
              <div className={styles.writeComment}>
                <span>You can leave a comment below!</span>
                <textarea placeholder="Your commentaries..."></textarea>
                <button className={styles.submit}>Add comment</button>
              </div>
              <Comment mainId={story.current.id}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );} else {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading...</div>
      </div>)
  }
}

export default PostPage;
