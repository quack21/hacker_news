import styles from './header.module.scss';
import React from 'react';
import logo from '../images/hackernewslogo.png';
import refreshIcon from '../images/refreshicon.png';
import { useDispatch } from 'react-redux';
import { toLoad } from '../../redux/slices/loadingSlice';
import { Link } from 'react-router-dom';

function Header() {
  const [thisDivActive, setThisDivActive] = React.useState(0);
  const headerSortBy = ['New', 'Past', 'Score', 'Ask', 'Show', 'Jobs', 'Comments'];
  const [searchValue, setSearchValue] = React.useState('');

  const dispatch = useDispatch();

  return (
    <div className={styles.header}>
      <div className={styles.leftSide}>
        <img src={logo} alt="logo" height="48px" width="48px"></img>
        <div className={styles.logoText}><Link to='/'>Hacker News</Link></div>
      </div>
      <div className={styles.centerSide}>
        <img
          src={refreshIcon}
          alt="refresh"
          width="16px"
          height="16px"
          title='Refresh news'
          onClick={() => dispatch(toLoad())}
        />
        {headerSortBy.map((v, i) => (
          <div
            key={v}
            className={thisDivActive === i ? styles.active : ''}
            onClick={() => setThisDivActive(i)}
            title="Click this to choose sorting category!">
            {v}
          </div>
        ))}
        <div className={styles.submit} onClick={() => ''}>
          Submit
        </div>
        <input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}></input>
      </div>
      <div className={styles.rightSide}>
        <div className={styles.logIn}>Log in</div>
      </div>
    </div>
  );
}

export default Header;
