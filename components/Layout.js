import { HeartIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

const Layout = ({ children = null }) => (
  <motion.div initial="initial" animate="animate" exit={{ opacity: 0 }}>
    <header className="z-50 fixed top-0 inset-x-0 bg-indigo-600 hover:bg-indigo-500 text-white transition">
      <a
        href="https://alterclass.io/tutorials/how-to-add-page-transitions-with-nextjs-and-framer-motion"
        target="_blank"
        rel="noopener noreferrer"
        className="block font-medium truncate text-center px-4 sm:px-6 py-2"
      >
        Learn how to build this app on{' '}
        <span className="underline underline-offset-1">AlterClass.io</span>
      </a>
    </header>

    <main className="mt-[40px]">{children}</main>

    <footer className="container mx-auto">
      <div className="px-4 sm:px-6 py-6">
        <p className="flex items-center justify-center space-x-1">
          <span> Made with</span>
          <HeartIcon className="w-4 h-4 text-red-500 animate-pulse" />
          <span>
            by{' '}
            <a
              href="http://twitter.com/gdangel0"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition"
            >
              Greg D&apos;Angelo
            </a>
          </span>
        </p>
      </div>
    </footer>
  </motion.div>
);

export default Layout;
