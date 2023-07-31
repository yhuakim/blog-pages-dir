import Head from "next/head";
import { groq } from "next-sanity";
import { client } from "../lib/sanityClient";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanityImageUrl";


export default function Post({ data }) {
  const { post } = data;
  return (
    <div>
      <Head>
        <title>Blog</title>
        <meta name="description" content="Read blog posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="text-gray-600 body-font overflow-hidden">
        <header className="p-3">
          <h1 className="text-gray-900 text-4xl font-bold capitalize pt-3 dark:text-gray-100">
            Welcome to my Blog Page
          </h1>
        </header>
        <div className="container px-5 py-5 mx-auto">
          <div className="-my-8 divide-y-2 divide-gray-100">
            {post.map((blogpost) => (
              <div key={blogpost.slug.current}>
                <div className="py-8 flex flex-wrap md:flex-nowrap">
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-semibold title-font text-gray-700">
                      {blogpost.category || "tutorial"}
                    </span>
                    <span className="mt-1 text-gray-500 text-sm">
                      {new Date(blogpost._createdAt).toISOString().split('T')[0]}
                    </span>
                    <div className="hidden md:block md:w-48">
                      {blogpost.mainImage && (
                        <Image src={urlFor(blogpost.mainImage).url()}
                          alt="Image"
                          className=""
                          width={300}
                          height={300}
                          layout="intrinsic" />
                      )}
                    </div>
                  </div>
                  <div className="md:flex-grow">
                    <h2 className="text-2xl font-medium text-gray-900 title-font mb-2 dark:text-gray-100">
                      {blogpost.title}
                    </h2>
                    <p className="leading-relaxed dark:text-gray-500">{blogpost.excerpt}</p>
                    <Link
                      legacyBehavior
                      href={`/blog/${encodeURIComponent(
                        blogpost.slug.current
                      )}`}
                    >
                      <a className="text-green-500 inline-flex items-center mt-4 group">
                        <svg
                          className="w-4 h-4 ml-2 group-hover:ml-4 group-hover:w-6 group-hover:h-6 group-hover:transition-all group-hover:ease-in"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const postQuery = groq`
  *[_type == "post"]
`;

export async function getStaticProps() {
  const post = await client.fetch(postQuery);
  return {
    props: {
      data: { post },
    },
  };
}