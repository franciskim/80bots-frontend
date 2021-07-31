import React from 'react'
import Bot from 'components/Bot'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin'

const AddBotPage = () => {
  return (
    <>
      <SimpleHeader name="Add Bot" />
      <Container className="mt--6" fluid>
        <Bot />
      </Container>
    </>
  )
}

AddBotPage.layout = Admin

export default AddBotPage
