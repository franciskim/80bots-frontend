import React from 'react'
import RunningBots from 'components/Bots/Running'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin.js'
import Head from 'next/head'

const RunningBotsPage = () => {
  return (
    <>
      <Head>
        <title>{'Running Bots | 80bots Web RPA'}</title>
      </Head>
      <SimpleHeader name="Working Bots" />
      <Container className="mt--6" fluid>
        <RunningBots />
      </Container>
    </>
  )
}
RunningBotsPage.layout = Admin

export default RunningBotsPage
