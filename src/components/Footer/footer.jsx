import styles from './footer.module.scss';

function Footer() {
  const footerSortBy = [
    'Guidelines',
    'FAQ',
    'Lists',
    'API',
    'Security',
    'Legal',
    'Apply to YC',
    'Contact',
  ];

  return (
    <div className={styles.footer}>
      <div className={styles.centerMenu}>
        {footerSortBy.map((v) => (
          <div key={v}>{v}</div>
        ))}
      </div>
      <hr></hr>
      <div className={styles.centerText}>
        Best news, stories, thoughts and opinions from everyone, right here, for you!
      </div>
    </div>
  );
}

export default Footer;
