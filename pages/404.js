import React from 'react'
import Router from 'next/router'

export default function Error404() {
  React.useEffect(() => {
    Router.push('/bots/running')
  })
  return <div />
}
