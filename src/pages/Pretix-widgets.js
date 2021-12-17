import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet";

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Pretix.eu Widgets Implementation" />
      <h1>Pretix.eu Widgets Implementation</h1>
      <div className="container">
        <div className="row">
            <div className="col-md-12">
                <h1>Ticket</h1>
            </div>
        </div>
        <div className="row">
            <div className="col-md-4">
                <div className="card" style={{width: 18 + 'rem'}} >
                    <img className="card-img-top" src="#" alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Event 1</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                            <pretix-button skip-ssl-check className="btn btn-primay" event="https://pretix.eu/testCompanyEnv/testEvent/live" items="item_6424=1">
                                Buy ticket!
                            </pretix-button>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card" style={{width: 18 + 'rem'}} >
                    <img className="card-img-top" src="#" alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Event 2</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                            <pretix-button skip-ssl-check className="btn btn-primay" event="https://pretix.eu/demo/democon/" items="item_6424=1">
                                Buy ticket!
                            </pretix-button>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card" style={{width: 18 + 'rem'}} >
                    <img className="card-img-top" src="#" alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Event 3</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                            <pretix-button skip-ssl-check className="btn btn-primay" event="https://pretix.eu/demo/democon/" items="item_6424=1">
                                Buy ticket!
                            </pretix-button>
                    </div>
                </div>
            </div>
        </div>
<p>Not working ! </p>
        <div className="row">
            <div className="col-md-12" dangerouslySetInnerHTML={{__html: "<pretix-widget event='https://pretix.eu/demo/democon/' skip-ssl-check></pretix-widget> <pretix-widget event='https://pretix.eu/demo/democon/' disable-vouchers skip-ssl-check></pretix-widget> <pretix-widget event='https://pretix.eu/demo/series/' style='list' skip-ssl-check></pretix-widget> <pretix-widget skip-ssl-check event='https://pretix.eu/demo/series/' style='red'></pretix-widget> <pretix-widget skip-ssl-check event='https://pretix.eu/demo/series/' style='calendar'></pretix-widget>"}} />
            
<div><p>Not working !</p></div>
                <noscript>
                    <div className="pretix-widget">
                        <div className="pretix-widget-info-message">
                            JavaScript is disabled in your browser. To access our ticket shop without JavaScript,
                            please <a target="_blank" href="https://pretix.eu/demo/democon/">click here</a>.
                        </div>
                    </div>
                </noscript>
        </div>
    </div>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous" />
    <link rel="stylesheet" type="text/css" href="https://pretix.eu/demo/democon/widget/v1.css" />
    <Helmet>
    <script type="text/javascript" src="https://pretix.eu/widget/v1.en.js" async></script>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossOrigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossOrigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossOrigin="anonymous"></script>
    </Helmet>
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
