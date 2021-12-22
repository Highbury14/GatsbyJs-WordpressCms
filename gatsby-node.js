const path = require(`path`)
const chunk = require(`lodash/chunk`)

// This is a simple debugging tool
// dd() will prettily dump to the terminal and kill the process
const { dd } = require(`dumper.js`)

/**
 * exports.createPages is a built-in Gatsby Node API.
 * It's purpose is to allow you to create pages for your site! 💡
 *
 * See https://www.gatsbyjs.com/docs/node-apis/#createPages for more info.
 */
exports.createPages = async gatsbyUtilities => {
  // Query our posts from the GraphQL server
  const posts = await Promise.allSettled([getPosts(gatsbyUtilities)])
  // console.log(posts[0].value[0].value.WpPosts[0])
  const wpPosts1 = posts[0].value[0].value.WpPosts
  const wpPages1 = posts[0].value[0].value.WpPages
  // console.log(wpPages1)
  // If there are no posts in WordPress, don't do anything
  if (!wpPosts1.length && !wpPages1.length) {
    return
  }
  
  if (wpPosts1.length) {
    // console.log(wpPosts1)
    // dd("The end.")
    // If there are posts, create pages for them
    await createIndividualBlogPostPages({ wpPosts1, gatsbyUtilities })
    
    // And a paginated archive
    await createBlogPostArchive({ wpPosts1, gatsbyUtilities })
  }
  
  if (!wpPages1.length) {
    return
  }
  // If there are wp-pages, create pages for them
  await createIndividualPages({ wpPages1, gatsbyUtilities })
}

/**
 * This function creates all the individual pages in this site.
 */
const createIndividualPages = async ({ wpPages1, gatsbyUtilities }) =>
  Promise.all(
    wpPages1.map(({ previous, page, next }) =>
      // createPage is an action passed to createPages
      // See https://www.gatsbyjs.com/docs/actions#createPage for more info
      gatsbyUtilities.actions.createPage({
        // Use the WordPress uri as the Gatsby page path
        // This is a good idea so that internal links and menus work 👍
        path: page.uri,

        // use the default page-template as the page component
        component: path.resolve(`./src/templates/default-page.js`),

        // `context` is available in the template as a prop and
        // as a variable in GraphQL.
        context: {
          // we need to add the page id here
          // so our page-template knows which wp-page
          // the current page is (when you open it in a browser)
          id: page.id,

          // We also use the next and previous id's to query them and add links!
          previousPageId: previous ? previous.id : null,
          nextPageId: next ? next.id : null,
        },
      })
    )
  )

/**
 * This function creates all the individual blog pages in this site
 */
const createIndividualBlogPostPages = async ({ wpPosts1, gatsbyUtilities }) => {
  // const wpPosts1 = await Promise.allSettled([wpPosts1])
  // console.log(wpPosts1)
  // dd("The End")
  Promise.all(
    wpPosts1.map(({ previous, post, next }) =>
      // createPage is an action passed to createPages
      // See https://www.gatsbyjs.com/docs/actions#createPage for more info
      gatsbyUtilities.actions.createPage({
        // Use the WordPress uri as the Gatsby page path
        // This is a good idea so that internal links and menus work 👍
        path: post.uri,

        // use the blog post template as the page component
        component: path.resolve(`./src/templates/blog-post.js`),

        // `context` is available in the template as a prop and
        // as a variable in GraphQL.
        context: {
          // we need to add the post id here
          // so our blog post template knows which blog post
          // the current page is (when you open it in a browser)
          id: post.id,

          // We also use the next and previous id's to query them and add links!
          previousPostId: previous ? previous.id : null,
          nextPostId: next ? next.id : null,
        },
      })
    )
  )
}

/**
 * This function creates all the individual blog pages in this site
 */
async function createBlogPostArchive({ wpPosts1, gatsbyUtilities }) {
  const graphqlResult = await gatsbyUtilities.graphql(/* GraphQL */ `
    {
      wp {
        readingSettings {
          postsPerPage
        }
      }
    }
  `)

  const { postsPerPage } = graphqlResult.data.wp.readingSettings
  const postsChunkedIntoArchivePages = chunk(wpPosts1, postsPerPage)
  const totalPages = postsChunkedIntoArchivePages.length
  
  return Promise.all(
    postsChunkedIntoArchivePages.map(async (_wpPosts1, index) => {
      // console.log(_wpPosts1)
      // console.log("Index: " + index)
      const pageNumber = index + 1

      const getPagePath = page => {
        if (page > 0 && page <= totalPages) {
          // Our homepage is not our blog page
          // we want the first page to be "/blog" and any additional pages
          // to be numbered.
          // "/blog/2" for example
          return page === 1 ? `/blog/` : `/blog/${page}`
        }

        return null
      }

      // createPage is an action passed to createPages
      // See https://www.gatsbyjs.com/docs/actions#createPage for more info
      await gatsbyUtilities.actions.createPage({
        path: getPagePath(pageNumber),

        // use the blog post archive template as the page component
        component: path.resolve(`./src/templates/blog-post-archive.js`),

        // `context` is available in the template as a prop and
        // as a variable in GraphQL.
        context: {
          // the index of our loop is the offset of which posts we want to display
          // so for page 1, 0 * 10 = 0 offset, for page 2, 1 * 10 = 10 posts offset,
          // etc
          offset: index * postsPerPage,

          // We need to tell the template how many posts to display too
          postsPerPage,

          nextPagePath: getPagePath(pageNumber + 1),
          previousPagePath: getPagePath(pageNumber - 1),
        },
      })
    })
  )
}

/**
 * This function queries Gatsby's GraphQL server and asks for
 * All WordPress blog-posts and pages. If there are any GraphQL error it throws an error
 * Otherwise it will return the posts and pages 🙌
 *
 * We're passing in the utilities we got from createPages.
 * So see https://www.gatsbyjs.com/docs/node-apis/#createPages for more info!
 */
async function getPosts({ graphql, reporter }) {
  const graphqlResult = await graphql(/* GraphQL */ `
    query WpPosts {
      # Query all WordPress blog posts sorted by date
      allWpPost(sort: { fields: [date], order: DESC }) {
        edges {
          previous {
            id
          }

          # note: this is a GraphQL alias. It renames "node" to "post" for this query
          # We're doing this because this "node" is a post! It makes our code more readable further down the line.
          post: node {
            id
            uri
          }

          next {
            id
          }
        }
      }
    }
  `)

  if (graphqlResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading the blog posts`,
      graphqlResult.errors
    )
    return
  }

  const graphqlPageResult = await graphql(/* GraphQL */ `
    query WpPages {
      # Query all WordPress-pages sorted by date
      allWpPage(sort: { fields: [date], order: DESC }) {
        edges {
          previous {
            id
          }

          # note: this is a GraphQL alias. It renames "node" to "page" for this query
          # We're doing this because this "node" is a page! It makes our code more readable further down the line.
          page: node {
            id
            uri
          }

          next {
            id
          }
        }
      }
    }
  `)

  if (graphqlPageResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading the wp-pages`,
      graphqlPageResult.errors
    )
    return
  }
  // console.log(graphqlResult.data.allWpPost.edges);
  // console.log(graphqlPageResult.data.allWpPage.edges);
  return await Promise.allSettled([{
    'WpPosts': graphqlResult.data.allWpPost.edges,
    'WpPages': graphqlPageResult.data.allWpPage.edges
  }])
}
