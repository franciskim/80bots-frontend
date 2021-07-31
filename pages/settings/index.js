import React from 'react'
import Settings from 'components/Settings'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin'
import Head from 'next/head'

const SettingsPage = () => {
  return (
    <>
      <Head>
        <title>{'Bot Settings | 80bots Web RPA'}</title>
      </Head>
      <SimpleHeader name="Settings" />
      <Container className="mt--6" fluid>
        <Settings />
      </Container>
    </>
  )
}

SettingsPage.layout = Admin

export default SettingsPage
