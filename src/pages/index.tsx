import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { graphql } from "gatsby"

const IndexPage = ({data}: PageProps<Queries.AllRepositoryQuery>) => {
  return (
    <main>
      {data.allRepository.nodes.map((repo) => {
        return <p key={repo.name}>{repo.name} -- {repo.stargazerCount}</p>
      })}
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>

export const query = graphql`
query AllRepository{
  allRepository {
    nodes {
      name
      stargazerCount
    }
  }
}
`
