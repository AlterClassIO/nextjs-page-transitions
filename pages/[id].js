import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import movieDb from '@/lib/movieDb';
import Layout from '@/components/Layout';
import { ArrowSmLeftIcon } from '@heroicons/react/outline';

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

const Movie = ({ movie = null, credits = null }) => {
  return (
    <Layout>
      <Head>
        <title>{movie?.title}</title>
        <meta name="description" content={movie?.overview} />
      </Head>

      <motion.div initial="initial" animate="animate" exit={{ opacity: 0 }}>
        <div className="space-y-10">
          <div className="relative w-full h-full">
            <div className="absolute z-10 inset-0 bg-gray-900 bg-opacity-90" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              {movie?.backdrop_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  alt=""
                  layout="fill"
                />
              ) : null}
            </motion.div>

            <div className="container mx-auto text-white">
              <div className="flex gap-12 px-4 sm:px-6 py-12">
                <motion.div
                  variants={{
                    initial: { x: 100, opacity: 0 },
                    animate: { x: 0, opacity: 1 },
                  }}
                  className="z-10 shrink-0"
                >
                  {movie?.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                      alt="Poster"
                      width={300}
                      height={450}
                      className="rounded-lg"
                    />
                  ) : null}
                </motion.div>

                <motion.div
                  variants={{
                    animate: {
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                  className="relative z-10 py-6"
                >
                  <Link href="/" passHref>
                    <motion.a
                      variants={fadeInUp}
                      className="text-sm text-opacity-50 hover:text-opacity-100 inline-flex items-center space-x-1 transition"
                    >
                      <ArrowSmLeftIcon className="shrink-0 w-5 h-5 mt-px" />
                      <span>Back to movies</span>
                    </motion.a>
                  </Link>

                  <motion.h1
                    variants={fadeInUp}
                    className="mt-4 font-bold text-4xl"
                  >
                    {movie?.title}
                  </motion.h1>

                  <motion.div
                    variants={fadeInUp}
                    className="mt-1 inline-flex items-center space-x-2 text-gray-400"
                  >
                    <span>
                      {movie?.release_date
                        ? format(new Date(movie.release_date), 'MM-dd-yyyy')
                        : null}
                    </span>
                    <span>-</span>
                    <span>
                      {movie?.genres.map(({ name }) => name).join(', ')}
                    </span>
                  </motion.div>

                  <motion.p
                    variants={fadeInUp}
                    className="mt-4 italic text-gray-300"
                  >
                    {movie?.tagline}
                  </motion.p>

                  <motion.div variants={fadeInUp} className="mt-6">
                    <h3 className="font-semibold text-lg">Overview</h3>
                    <p className="mt-1 text-gray-300">{movie?.overview}</p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="container mx-auto">
            <div className="px-4 sm:px-6 pb-12">
              <h2 className="font-medium text-xl capitalize">
                Top billed cast
              </h2>

              <div className="overflow-y-auto">
                <motion.ol
                  variants={{
                    animate: {
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                  className="mt-6 flex flex-row gap-4 pb-6"
                >
                  {credits?.cast?.slice(0, 10)?.map(actor => (
                    <motion.li
                      key={actor.id}
                      variants={fadeInUp}
                      whileHover={{ translateY: -10 }}
                      className="shrink-0 rounded-lg w-[138px] overflow-hidden border border-opacity-50 shadow-md"
                    >
                      <div className="relative w-[138px] h-[175px] bg-gray-100">
                        {actor?.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/original/${actor.profile_path}`}
                            alt={actor.name}
                            layout="fill"
                          />
                        ) : null}
                      </div>
                      <div className="p-4">
                        <p className="truncate font-semibold">{actor.name}</p>
                        <p className="truncate">{actor.character}</p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ol>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Movie;

export async function getStaticPaths() {
  let page = 1,
    totalPages = 1,
    paths = [];

  do {
    const { data } = await movieDb.get(`/movie/popular?page=${page}`);
    if (totalPages !== data.total_pages) {
      totalPages = data.total_pages;
    }
    if (Array.isArray(data?.results) && data.results.length > 0) {
      data.results.forEach(({ id }) => {
        paths.push({ params: { id: `${id}` } });
      });
    }
    page += 1;
  } while (page <= totalPages);

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;

  try {
    const [{ data: movie }, { data: credits }] = await Promise.all([
      movieDb.get(`/movie/${id}`),
      movieDb.get(`/movie/${id}/credits`),
    ]);
    return {
      props: { movie, credits },
    };
  } catch (e) {
    return {
      props: {},
    };
  }
}
