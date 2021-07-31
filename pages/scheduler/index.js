import React from 'react'
import BotsSchedule from 'components/Schedule'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin'
import Head from 'next/head'

const SchedulerPage = () => {
  return (
    <>
      <Head>
        <title>{'Scheduler | 80bots Web RPA'}</title>
      </Head>
      <SimpleHeader name="Scheduler" />
      <Container className="mt--6" fluid>
        <BotsSchedule />
      </Container>
    </>
  )
}

SchedulerPage.layout = Admin

export default SchedulerPage
