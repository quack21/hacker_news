import styles from './comment.module.scss';
import axios from 'axios';
import React from 'react';

function Comment(mainId) {
  const [mainAreReady, setMainAreReady] = React.useState(false);
  const [innersAreReady, setInnersAreReady] = React.useState(false);
  const [anyComments, setAnyComments] = React.useState(true);
  const [onceLoaded, setOnceLoaded] = React.useState(false);
  const [overallComments, setOverallComments] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(true)

  const idsOfMainComments = React.useRef([]);
  const mainComments = React.useRef([]);
  const idsOfInnerComments = React.useRef([]);
  const innerComments = React.useRef([]);

  function refresh() {
    if (!refreshing) {
      setMainAreReady(false);
      setInnersAreReady(false);
      setAnyComments(true);
      setOverallComments(0);
      setOnceLoaded(false);
      setRefreshing(true)
      fetchForAnyComments(mainId);
    } else {
      alert('Already refreshing')
    }
  }

  async function fetchForAnyComments({mainId}) {
    idsOfMainComments.current = [];
    mainComments.current = [];
    await axios
      .get(`https://hacker-news.firebaseio.com/v0/item/${mainId}.json?print=pretty`)
      .then(
        (res) =>
          res.data.kids ? idsOfMainComments.current.push(res.data.kids) : setAnyComments(false) || setRefreshing(false), // id основных комментариев сохранены в useRef idsOfMainComments
      )
      .then(() => 'idsOfMainComments here are ready to fetch them now') // idsofMainComments here are ready to fetch them
      .catch((err) => err);
    return anyComments;
  }

  async function fetchMainComments() {
    for (let i = 0; i < idsOfMainComments.current[0].length; i++) {
      await axios
        .get(
          `https://hacker-news.firebaseio.com/v0/item/${idsOfMainComments.current[0][i]}.json?print=pretty`,
        )
        .then((res) => (res.data.deleted ? 'deleted ones' : mainComments.current.push(res.data))) // data основных комментариев сохранены в mainComments, удалённые комментарии не будут отображаться
        .then(() => 'one of mainComments.date ready') // one of mainComments data are ready
        .catch((err) => err);
    }
    setOverallComments(mainComments.current.length);
    setOnceLoaded(true);
    setRefreshing(false)
  }

  async function fetchIdsOfInnerComments(mainCommentData) {
    mainCommentData.innersReady = false;
    await axios
      .get(`https://hacker-news.firebaseio.com/v0/item/${mainCommentData.id}.json?print=pretty`)
      .then(
        (res) =>
          res.data.kids
            ? idsOfInnerComments.current.push(res.data.kids)
            : 'No inner comments', // id вложенных комментариев сохранены в idsOfInnerComments
      )
      .then(() => fetchInnerComments(idsOfInnerComments, mainCommentData))
      .catch((err) => err);
  }

  async function fetchInnerComments(idsOfInnerComments, mainCommentData) {
    for (let i = 0; i < idsOfInnerComments.current[0].length; i++) {
      await axios
        .get(
          `https://hacker-news.firebaseio.com/v0/item/${idsOfInnerComments.current[0][i]}.json?print=pretty`,
        )
        .then((res) => (res.data.deleted ? 'deleted ones' : innerComments.current.push(res.data))) // data основных комментариев сохранены в innerComments, удалённые комментарии не будут отображаться
        .then(() => 'one of innerComments ') // one of innerComments.data are ready
        .catch((err) => err);
    }
    mainCommentData.inners = innerComments.current;
    mainCommentData.onceLoaded = true;
    mainCommentData.innersReady = true;
    innerComments.current = [];
    idsOfInnerComments.current = [];
    setInnersAreReady(!innersAreReady);
  }
  
  React.useEffect(() => {
    if (!onceLoaded) {
      fetchForAnyComments(mainId)
        .then((res) => (res ? fetchMainComments() : 'need to render that here is no comments'))
        .then(() => setMainAreReady(true))
        .catch((err) => err);
    }
    // eslint-disable-next-line
  }, [mainId, onceLoaded]);

  function convert(txt) {
    const cleanHyperText = (markup) =>
      new DOMParser().parseFromString(markup, 'text/html').body.textContent;
    return cleanHyperText(txt);
  }

  return (
    <div className={styles.commentBox}>
      <div className={styles.overallAndRefresh}>
        <div className={styles.overall}>Overall Comments: {overallComments}</div>
        <div className={styles.refresh} onClick={() => refresh()}>
          Refresh Comments
        </div>
      </div>
      {anyComments ? (
        mainAreReady ? (
          mainComments.current.map((main, i) => (
            <div
              className={styles.comment}
              key={main.id}
              onClick={() => fetchIdsOfInnerComments(main)}>
              <span>{`${i + 1 + '. ' + main.by} : `}{convert(main.text)}</span>
              {main.kids ? '' : <div className={styles.noInner}>No Inner Comments</div>}
              {(main.innersReady && main.onceLoaded)
                ? main.inners.map((inner, j) => (
                    <div className={styles.innerComment} key={inner.id}>
                      {`${i + 1 + '.' + (j + 1) + ' ' + inner.by} : `}
                      {convert(inner.text)}
                    </div>
                  ))
                : ''}
            </div>
          ))
        ) : (
          <div className={styles.loadingComments}>Loading...</div>
        )
      ) : (
        <div className={styles.noComments}>There is no comments yet...</div>
      )}
    </div>
  );
}

export default Comment;
