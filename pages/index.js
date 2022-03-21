import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import slugify from 'slugify';
import movieDb from '@/lib/movieDb';
import Layout from '@/components/Layout';

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
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
    <Layout>
      <Head>
        <title>Next.js page transitions | Movies</title>
        <meta name="description" content="Next.js page transitions | Movies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto">
        <div className="px-4 sm:px-6 py-12">
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8"
          >
            {movies.map(movie => {
              const slug = slugify(movie.title, {
                lower: true,
                strict: true,
              });
              return (
                <motion.div
                  key={movie.id}
                  whileHover={{ scale: 1.05, zIndex: 1 }}
                  whileTap={{ scale: 0.95 }}
                  variants={fadeInUp}
                >
                  <Link href={`/${movie.id}-${slug}`}>
                    <a className="relative block">
                      <div
                        className="relative block aspect-w-9 aspect-h-14 rounded-lg overflow-hidden cursor-pointer bg-gray-100"
                        key={movie.id}
                      >
                        <Image
                          src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                          alt={movie.title}
                          layout="fill"
                        />
                      </div>

                      <div className="absolute bottom-0 left-2 transform translate-y-1/2 bg-gray-900 border text-white w-10 h-10 rounded-full text-sm flex items-center justify-center font-semibold shadow-xl">
                        {movie.vote_average}
                      </div>
                    </a>
                  </Link>

                  <div className="mt-6 px-2">
                    <p className="font-semibold">{movie.title}</p>
                    {movie?.release_date ? (
                      <p className="text-gray-500">
                        {format(new Date(movie.release_date), 'MMM dd, yyyy')}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </Layout>
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
