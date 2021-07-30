import React from 'react'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import UpdateBot from 'components/Bot/UpdateBot'
import Admin from 'layouts/Admin'

const UpdateBotPage = () => {
  return (
    <>
      <SimpleHeader name="Scheduler Log" />
      <Container className="mt--6" fluid>
        <UpdateBot />
      </Container>
    </>
  )
}

UpdateBotPage.layout = Admin

export default UpdateBotPage
