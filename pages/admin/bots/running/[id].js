import React from 'react'
import BotView from '/components/Bots/BotView'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin'

const BotViewPage = () => {
  return (
    <>
      <SimpleHeader name="Scheduler Log" />
      <Container className="mt--6" fluid>
        <BotView />
      </Container>
    </>
  )
}

BotViewPage.layout = Admin

export default BotViewPage
