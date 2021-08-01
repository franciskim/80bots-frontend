import React from 'react'
import BotView from 'components/Bots/BotView'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin'
import Head from 'next/head'

const BotViewPage = () => {
  return (
    <>
      <Head>
        <title>{'Bot View | 80bots Web RPA'}</title>
      </Head>
      <SimpleHeader name="Bot View" />
      <Container className="mt--6" fluid>
        <BotView />
      </Container>
    </>
  )
}

BotViewPage.layout = Admin

export default BotViewPage
