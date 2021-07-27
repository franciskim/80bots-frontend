/*!

=========================================================
* NextJS Argon Dashboard PRO - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-argon-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react'

// reactstrap components
import { Container } from 'reactstrap'
import Profile from 'components/Profile'
import SimpleHeader from 'components/Headers/SimpleHeader'
import Admin from 'layouts/Admin.js'

const ProfilePage = () => {
  return (
    <>
      <SimpleHeader name="User Profile" />
      <Container className="mt--6" fluid>
        <Profile />
      </Container>
    </>
  )
}

ProfilePage.layout = Admin

export default ProfilePage
