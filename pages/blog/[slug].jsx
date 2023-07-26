import { groq } from "next-sanity";
import { client } from "../../lib/sanityClient";
import { useRouter } from "next/router";
import { urlFor } from "@/lib/sanityImageUrl";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

export default function ReadPost({ data }) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }
    const { post } = data;
    const PortableTextComponent = {
        types: {
            image: ({ value }) => (
                <Image
                    src={urlFor(value).url()}
                    alt="Image"
                    className="rounded-lg"
                    width={800}
                    height={800}
                />
            ),
        },
    };

    return (
        <div className="h-auto xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700 dark:bg-gray-800 p-3">
            <header className="pt-6 xl:pb-6">
                <div className="space-y-1 text-center">
                    <div className="space-y-10">
                        <div>
                            {/* <p className="text-base font-medium leading-6 text-teal-500">
                                {new Date(post._createdAt).toISOString().split("T")[0]}
                            </p> */}
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </header>

            <div className="divide-y divide-gray-200 pb-3 dark:divide-gray-700 xl:divide-y-0">
                <div className="divide-y divide-gray-200 dark:text-gray-100 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
                    <div className="prose max-w-none pb-8 pt-10 dark:prose-invert prose-lg">
                        <PortableText
                            value={post.body}
                            components={PortableTextComponent}
                        />
                    </div>
                </div>
            </div>

            <div className="ml-5 mb-4">
                <Link href={"/blog"} className="bg-teal-500 dark:text-gray-100 p-2 rounded-md shadow-md">
                    Go Home
                </Link>
            </div>
        </div>
    );
}

const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    body,
    "slug": slug.current
  }
`;

export async function getStaticPaths() {
    const paths = await client.fetch(
        groq`*[_type == "post" && defined(slug.current)][].slug.current`
    );

    const firstPost = paths[0];

    return {
        paths: [{ params: { slug: firstPost } }],
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const post = await client.fetch(postQuery, {
        slug: params.slug,
    });

    return {
        props: {
            data: { post },
        },
    };
}
