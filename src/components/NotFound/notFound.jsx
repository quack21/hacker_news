import styles from './notFound.module.scss';

function NotFound() {

  return (
    <div className={styles.wrapper}>
    	<div className={styles.container}>
          <div className={styles.content}>
            you're hacking the wrong way
          </div>
          <div className={styles.info}> this spage was not found</div>
      </div>
    </div>
  );
}

export default NotFound;