import React from 'react'
import { Container } from 'reactstrap'
import Bots from 'components/Bots/index'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin'

const BotsPage = () => {
  return (
    <>
      <SimpleHeader name="Available Bots" />
      <Container className="mt--6" fluid>
        <Bots />
      </Container>
    </>
  )
}

BotsPage.layout = Admin

export default BotsPage
