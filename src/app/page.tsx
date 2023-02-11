'use client';

import { getLineups } from '@/services/lineupService';
import { Inter } from '@next/font/google';
import React from 'react';
import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] });

const Home = () => {
  const [url, setUrl] = React.useState('');
  const [message, setMessage] = React.useState<string>('');

  React.useEffect(() => {
    if (
      url !== '' &&
      (url.includes('salibandy.fi') || url.includes('fliiga.com'))
    ) {
      const parts = url.split('/').filter(p => p !== '');
      const matchNro = parts[parts.length - 2];
      const type = parts.find(p => p === 'fliiga.com') ? 'fliiga' : 'salibandy';
      if (parts && matchNro && type) {
        getLineups(type, matchNro).then(lineups => {
          if (lineups === null) {
            setMessage('Ottelun osoite on virheellinen');
          } else if (lineups?.length === 0) {
            setMessage('Ottelun kokoonpanoja ei löydetty');
          } else if (lineups?.length === 2) {
            setMessage('Ottelun kokoonpanot löydettiin onnistuneesti');
          } else {
            setMessage(
              'Molempien joukkueiden kokoonpanoja ei ole vielä julkaistu',
            );
          }
        });
      }
    }
  }, [url]);

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <form>
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            className={inter.className}
          />
        </form>
        <p style={{ marginTop: 16 }}>{message}</p>
      </div>
    </main>
  );
};

export default Home;
