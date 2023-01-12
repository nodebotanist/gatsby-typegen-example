import type { GatsbyNode } from "gatsby"
import { GraphQLClient } from "graphql-request"
import dotenv from "dotenv"

// load .env file
dotenv.config()

const endpoint = `https://api.github.com/graphql`
const graphqlClient = new GraphQLClient(endpoint, {
    headers: {
        authorization: `bearer ${process.env.GITHUB_ACCESS_TOKEN}`
    }
})

const query = /* GraphQL */`
query {
    repositoryOwner (login:"gatsbyjs") { 
        repositories(first:25, orderBy:{ field:STARGAZERS, direction:DESC}) {
            nodes {
                name
                stargazerCount
            }
        }
    }
}
`

// type Repository {
//     name: String,
//     stargazerCount: Number
// }

// interface StargazerData {
//     repositoryOwner: {
//         repositories: {
//             nodes: Array<{name: String, stargazerCount: Number}>
//         }
//     }
// }

export const sourceNodes : GatsbyNode["sourceNodes"] = async ({ actions, createNodeId, createContentDigest }) => {
    const { createNode } = actions

    const data = await graphqlClient.request<StargazerData>(query)
    console.log(JSON.stringify(data, undefined, 2))
    data.repositoryOwner.repositories.nodes.forEach((repo: Repository) => {
        createNode({
            ...repo,
            id: createNodeId(`repo__${repo.name}`),
            internal: {
                type: "Repository",
                content: JSON.stringify(repo),
                contentDigest: createContentDigest(repo)
            }
        })
    })
}