import styles from './postContainer.module.scss';
import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { movedFromPostPage, rememberArray } from '../../redux/slices/loadingSlice';
import PostLine from '../PostLine/postLine';

function PostContainer() {
  const [isReady, setIsReady] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [renew, doRenew] = React.useState(false);
  const [progressBar, setProgressBar] = React.useState(0);

  const newsIds = React.useRef([]);
  const newsArray = React.useRef([]);

  const dispatch = useDispatch();
  const reload = useSelector((state) => state.loading.load);
  const moved = useSelector((state) => state.loading.moved);
  const reduxArray = useSelector((state) => state.loading.newsArray);

  function getIds() {
    setIsReady(false);
    if (loading) {
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    }
    return new Promise(function (resolve, reject) {
      axios
        .get('https://hacker-news.firebaseio.com/v0/newstories.json?print=prettys')
        .then((response) => (newsIds.current = response['data']))
        .then(() => resolve(true))
        .catch((err) => reject(err));
    });
  }

  async function fetchNews() {
    newsArray.current = [];
    for (let i = 0; i < 100; i++) {
      await axios
        .get(`https://hacker-news.firebaseio.com/v0/item/${newsIds.current[i]}.json?print=pretty`)
        .then((r) => (r.dead ? --i : newsArray.current.push(r.data)))
        .catch((err) => err);
      setProgressBar(progressBar + i);
      if (i === 99) {
        setProgressBar(0);
      }
    }
    newsArray.current = newsArray.current.sort((a, b) => b.time - a.time);
    setLoading(false);
    setIsReady(true);
    dispatch(rememberArray(newsArray.current));
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  function timo() {
    setTimeout(() => doRenew(!renew), 60000);
    return ''
  }

  React.useEffect(() => {
    if (!moved) {
      setLoading(true);
      getIds()
        .then((response) => (response ? fetchNews() : setIsReady(false)))
        .catch((err) => err);
    } else {
      dispatch(movedFromPostPage(false));
      newsArray.current = reduxArray[0];
      setIsReady(true);
    }
    // eslint-disable-next-line
  }, [reload, renew]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.body}>
          <div className={styles.container}>
            <div className={styles.selector}>
              <div className={styles.author}>Author</div>
              <div className={styles.titleName}>Title</div>
              <div className={styles.date}>Date</div>
              <div className={styles.scoreMark}>Score</div>
            </div>
            {isReady ? timo() : ''}
            {isReady ? (
              newsArray.current.map((v, i) => <PostLine story={v} key={i + 'sfh'} />)
            ) : (
              <div className={styles.loader}>
                <div className={styles.info}>Loading...</div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.innerBar}
                    style={{
                      width: progressBar + '%',
                    }}>
                    ''
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostContainer;