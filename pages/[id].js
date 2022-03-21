import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import movieDb from '@/lib/movieDb';

const Movie = ({ movie = null, credits = null }) => {
  return (
    <div>
      <div className="space-y-10">
        <div className="relative w-full h-full">
          <div className="absolute z-10 inset-0 bg-gray-900 bg-opacity-90" />

          <Image
            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
            layout="fill"
          />

          <div className="container mx-auto text-white">
            <div className="flex gap-12 px-4 sm:px-6 py-12">
              <div className="z-10 shrink-0">
                {movie?.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    width={300}
                    height={450}
                    className="rounded-lg"
                  />
                ) : null}
              </div>

              <div className="relative z-10 py-6">
                <h1 className="font-bold text-4xl">{movie?.title}</h1>

                <div className="mt-1 inline-flex items-center space-x-2 text-gray-400">
                  <span>
                    {movie?.release_date
                      ? format(new Date(movie.release_date), 'MM-dd-yyyy')
                      : null}
                  </span>
                  <span>-</span>
                  <span>
                    {movie?.genres.map(({ name }) => name).join(', ')}
                  </span>
                </div>

                <p className="mt-4 italic text-gray-300">{movie?.tagline}</p>

                <div className="mt-6">
                  <h3 className="font-semibold text-lg">Overview</h3>
                  <p className="mt-1">{movie?.overview}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto">
          <div className="px-4 sm:px-6 pb-12">
            <h2 className="font-medium text-xl capitalize">Top billed cast</h2>

            <ol className="mt-4 flex flex-row gap-4 overflow-y-auto pb-6">
              {credits?.cast?.slice(0, 10)?.map(actor => (
                <li
                  key={actor.id}
                  className="shrink-0 rounded-lg w-[138px] overflow-hidden border border-opacity-50 shadow-md"
                >
                  <div className="relative w-[138px] h-[175px] bg-gray-100">
                    {actor?.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/original/${actor.profile_path}`}
                        layout="fill"
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <p className="truncate font-semibold">{actor.name}</p>
                    <p className="truncate">{actor.character}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
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
  } while (page <= 10);

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
      props: null,
    };
  }
}
