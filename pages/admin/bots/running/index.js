import React from 'react'
import RunningBots from 'components/Bots/Running'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin.js'

const RunningBotsPage = () => {
  return (
    <>
      <SimpleHeader name="Buttons" parentName="Components" />
      <Container className="mt--6" fluid>
        <RunningBots />
      </Container>
    </>
  )
}
RunningBotsPage.layout = Admin

export default RunningBotsPage
