import { Link } from 'react-router-dom';
import styles from './postLine.module.scss';
import { useDispatch } from 'react-redux';
import { movedFromNewPage } from '../../redux/slices/loadingSlice';

function PostLine({story}) {

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

  const dispatch = useDispatch();
  
  return (
    <>
      <Link
        to={`/post/${story.id}`}
        className={styles.story}
        onClick={() => dispatch(movedFromNewPage(false))}>
        <div className={styles.story} onClick={() => ''}>
          <div className={styles.by}>{story.by}</div>
          <div className={styles.title}>{story.title}</div>
          <div className={styles.time}>{getTime(story.time)}</div>
          <div className={styles.score}>{story.score}</div>
        </div>
      </Link>
    </>
  );
}

export default PostLine;
