import React, { useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { channelUpdate } from '../../api/channel'

import './ChannelUpdate.scss'

const UpdateChannel = props => {
  const [channel, setChannel] = useState({ name: '' })
  const [updated, setUpdated] = useState(false)
  const { user, msgAlert, match } = props

  const handleChange = (event) => {
    const updatedField = { [event.target.name]: event.target.value }
    setChannel(oldChannel => {
      const updatedChannel = { ...oldChannel, ...updatedField }
      return updatedChannel
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    channelUpdate(user, channel, match.params.channelId)
      .then(() => setUpdated(true))
      .then(() => msgAlert({
        heading: 'Update successful',
        message: 'Channel name has been changed',
        variant: 'success'
      }))
      .catch(err => msgAlert({
        heading: 'Update failed',
        message: 'You do not own this channel ' + err.message,
        variant: 'danger'
      }))
  }

  if (updated) {
    return (
      <Redirect to='/chats/'/>
    )
  }

  return (
    <React.Fragment>
      <h1 className="updateChannelTitle">Change Channel Name</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="New Channel Name"
          value={channel.name}
          onChange={handleChange}
          name="name"
        />
        <button type="submit">Rename Channel</button>
      </form>
      <Link to="/chats" className="backButton">Back</Link>
    </React.Fragment>
  )
}

export default UpdateChannel
