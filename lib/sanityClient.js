import { createClient } from "next-sanity";

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, //Replace this with your project ID
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2023-07-24",
    useCdn: "true",
})