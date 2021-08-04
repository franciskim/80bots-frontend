import React from 'react'
import Users from 'components/Users'
import { Container } from 'reactstrap'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin'
import Head from 'next/head'

const UsersPage = () => {
  return (
    <>
      <Head>
        <title>{'Users | 80bots Web RPA'}</title>
      </Head>
      <SimpleHeader name="Users" />
      <Container className="mt--6" fluid>
        <Users />
      </Container>
    </>
  )
}

UsersPage.layout = Admin

export default UsersPage
