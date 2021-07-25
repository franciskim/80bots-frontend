import React from 'react'
import SchedulerLog from 'components/SchedulerLog'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin'

const SchedulerLogPage = () => {
  return (
    <>
      <SimpleHeader name="Scheduler Log" />
      <Container className="mt--6" fluid>
        <SchedulerLog />
      </Container>
    </>
  )
}

SchedulerLogPage.layout = Admin

export default SchedulerLogPage
