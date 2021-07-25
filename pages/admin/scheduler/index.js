import React from 'react'
import BotsSchedule from 'components/Schedule'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin'

const SchedulerPage = () => {
  return (
    <>
      <SimpleHeader name="Scheduler" />
      <Container className="mt--6" fluid>
        <BotsSchedule />
      </Container>
    </>
  )
}

SchedulerPage.layout = Admin

export default SchedulerPage
