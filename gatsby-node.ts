import type { GatsbyNode } from "gatsby"
import { GraphQLClient } from "graphql-request"

const endpoint = `https://api.github.com/graphql`
const graphqlClient = new GraphQLClient(endpoint, {
    headers: {
        authorization: `bearer ${process.env.GITHUB_ACCESS_TOKEN}`
    }
})

const query = `
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

type Repository = {
    name: string,
    stargazerCount: number
}

interface StargazerData {
    repositoryOwner: {
        repositories: {
            nodes: Array<Repository>
        }
    }
}

export const sourceNodes : GatsbyNode["sourceNodes"] = async ({ actions, createNodeId, createContentDigest }) => {
    const { createNode } = actions

    const data = await graphqlClient.request<StargazerData>(query)
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