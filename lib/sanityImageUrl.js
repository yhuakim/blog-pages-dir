import ImageUrlBuilder from "@sanity/image-url";
import { client } from "./sanityClient";

const builder = ImageUrlBuilder(client);

export function urlFor(source) {
    return builder.image(source);
}