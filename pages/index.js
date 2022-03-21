import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import movieDb from '@/lib/movieDb';

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function Home({ movies = [] }) {
  return (
    <>
      <Head>
        <title>Next.js page transitions | Movies</title>
        <meta name="description" content="Next.js page transitions | Movies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div
        initial="initial"
        animate="animate"
        exit={{ opacity: 0 }}
        className="container mx-auto"
      >
        <div className="px-4 sm:px-6 py-12">
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8"
          >
            {movies.map(movie => (
              <Link href={`/${movie.id}`} key={movie.id} passHref>
                <motion.a
                  className="relative aspect-w-9 aspect-h-14 rounded-lg overflow-hidden cursor-pointer bg-gray-100"
                  key={movie.id}
                  whileHover={{ scale: 1.05, opacity: 0.8, zIndex: 1 }}
                  whileTap={{ scale: 0.95 }}
                  variants={fadeInUp}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    alt={movie.title}
                    layout="fill"
                  />
                </motion.a>
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const { data } = await movieDb.get('/movie/popular');
    return {
      props: { movies: data?.results ?? [] },
    };
  } catch (e) {
    return {
      props: { movies: [] },
    };
  }
}
