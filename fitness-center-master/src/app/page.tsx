import Link from 'next/link';
import styles from './page.module.css';
import trainerBg from '../assets/trainer.webp';

export default function Home() {
  return (
    <div className={styles['homepage-container']} style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${trainerBg.src})`
    }}>
      <div className={styles['hero-section']}>
        <h1>Transform Your Life with Personal Training</h1>
        <p>Join us today and start your journey to a healthier, fitter you.</p>
        <Link href="/login">
          <button className={styles['signup-button']}>Sign in</button>
        </Link>
      </div>
    </div>
  );
}
