import React from 'react'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import UpdateBotInstance from 'components/BotInstance/UpdateBotInstance'
import Admin from 'layouts/Admin'
import Head from 'next/head'

const UpdateBotInstancePage = () => {
  return (
    <>
      <Head>
        <title>{'Update Bot Instance | 80bots Web RPA'}</title>
        {/* <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
      </Head>
      <SimpleHeader name="Update Bot Instance" />
      <Container className="mt--6" fluid>
        <UpdateBotInstance />
      </Container>
    </>
  )
}

UpdateBotInstancePage.layout = Admin

export default UpdateBotInstancePage
