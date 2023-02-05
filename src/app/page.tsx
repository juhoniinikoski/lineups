'use client';

import getLineups from '@/pages/api/getLineups';
import { Inter } from '@next/font/google';
import React from 'react';
import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] });

const Home = () => {
  const [url, setUrl] = React.useState('');
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const parts = url.split('/').filter(p => p !== '');
    const matchNro = parts[parts.length - 2];
    const type = parts.find(p => p === 'fliiga.com') ? 'fliiga' : 'salibandy';
    const lineups = await getLineups(type, matchNro);
    console.log(lineups);
  };

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            className={inter.className}
            placeholder="Url here"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </main>
  );
};

export default Home;
