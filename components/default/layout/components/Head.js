import React from "react";
import NextHead from "next/head";
import PropTypes from "prop-types";

const defaultDescription =
  "80bots is a hyper-modern, cloud-native RPA (Robotic Process Automation) platform for the web that helps you and your organisation automate tasks that cannot be done with IFTTT or Zapier.";
const defaultOGURL = "";
const defaultOGImage = "";
const googleAnalyticsId = "id";

const Head = props => (
  <NextHead>
    <title>{props.title + " | 80bots Web RPA"}</title>
    <meta charSet="UTF-8" />
    <meta
      name="description"
      content={props.description || defaultDescription}
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="user-avatar" content={props.userAvatar} />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <link rel="icon" href="data:," />
    <meta name="msapplication-TileColor" content="#FFFFFF" />
    <meta name="msapplication-config" content="/browserconfig.xml" />
    <meta property="og:url" content={props.url || defaultOGURL} />
    <meta property="og:title" content={props.title || ""} />
    <meta
      property="og:description"
      content={props.description || defaultDescription}
    />
    <meta name="twitter:site" content={props.url || defaultOGURL} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="description" content={props.description} />
    <meta property="og:title" content={props.title} />
    <meta property="og:url" content={props.url} />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: `{
          "@context": "http://schema.org",
          "@type": "Organization",
          "name": "80bots",
          "legalName" : "80BOTS PTY LTD",
          "url": "https://80bots.com/",
          "logo": "https://80bots.com/logo.png",
          "foundingDate": "2018",
          "founders": [
            {
                "@type": "Person",
                "name": "Francis Kim"
            }
          ],
          "address": {
              "@type": "PostalAddress",
              "streetAddress": "Street Here",
              "addressLocality": "Suite Here",
              "addressRegion": "Region Here",
              "postalCode": "00000",
              "addressCountry": "Australia"
          },
          "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "telephone": "[+1-000-000-0000]",
              "email": "support@80bots.com"
          },
          "sameAs": [
              "https://www.facebook.com/80bots",
              "https://twitter.com/80bots",
              "https://www.linkedin.com/company/80bots/"
          ]
      }`
      }}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '123');`
      }}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', '123', 'auto');
        ga('send', 'pageview');`
      }}
    />
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"
        height="0" width="0" style="display:none;visibility:hidden;"></iframe>`
      }}
    />
  </NextHead>
);

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  ogImage: PropTypes.string,
  userAvatar: PropTypes.string
};

export default Head;
