import React from 'react'
import Bots from 'components/Bots'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin'
import Head from 'next/head'

const BotsPage = () => {
  return (
    <>
      <Head>
        <title>{'Available Bots | 80bots Web RPA'}</title>
      </Head>
      <SimpleHeader name="Deploy & Update Bots" />
      <Container className="mt--6" fluid>
        <Bots />
      </Container>
    </>
  )
}

BotsPage.layout = Admin

export default BotsPage
