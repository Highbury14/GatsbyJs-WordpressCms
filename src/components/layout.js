import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import parse from "html-react-parser"

const Layout = ({ isHomePage, children }) => {
  const {
    wp: {
      generalSettings: { title }
    },
    allWpMenuItem: { edges }
  } = useStaticQuery(graphql`
    query LayoutQuery {
      wp {
        generalSettings {
          title
          description
        }
      }
      allWpMenuItem(filter: {menu: {node: {name: {eq: "Main Menu"}}}}) {
        edges {
          node {
            label
            title
            url
            path
          }
        }
      }
    }
  `)

  return (
    <div className="global-wrapper" data-is-root-path={isHomePage}>
      <header className="global-header">
        {isHomePage ? (
          <h1 className="main-heading">
            <Link to="/">{parse(title)}</Link>
          </h1>
        ) : (
          <Link className="header-link-home" to="/">
            {title}
          </Link>
        )}
        <ul style={{ listStyle: `none`, display: `flex`, margin: 0 }}>
          {edges.map(item => (
            <li key={item.node.url} style={{ margin: `0 10px` }}>
              <Link
                to={item.node.url}
                  style={{ textDecoration: `none`, fontFamily: `sans-serif` }}
                >
                {item.node.label}
              </Link>
            </li>
          ))}
        </ul>
      </header>

      <main>{children}</main>

      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
        {` `}
        And <a href="https://wordpress.org/">WordPress</a>
      </footer>
    </div>
  )
}

export default Layout
