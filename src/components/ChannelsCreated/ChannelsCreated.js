import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'

import { channelIndex, channelDelete } from '../../api/channel'

class ChannelsCreated extends Component {
  constructor (props) {
    super(props)
    this.state = {
      channels: [],
      channel: {
        name: ''
      }
    }
  }

  handleChange = event => this.setState({
    [event.target.name]: event.target.value
  })
  componentDidMount () {
    const { user } = this.props
    channelIndex(user)
      .then(res => {
        this.setState({ channels: res.data.channels })
      })
  }

  handleInputChange = (event) => {
    event.persist()
    this.setState(prevState => {
      const updatedField = {
        [event.target.name]: event.target.value
      }
      const updatedData = Object.assign({}, prevState.channel, updatedField)
      return { channel: updatedData }
    })
  }

  onChannelDelete = (event) => {
    event.preventDefault()
    const channelId = event.target.name

    // const { msgAlert } = this.props

    channelDelete(this.props.user, channelId)
      .then(() => {
        this.setState({ text: '' })
        this.props.msgAlert({
          heading: 'Channel Deleted!',
          message: messages.deleteChannelSuccess,
          variant: 'success'
        })
      })
      .then(props => {
        channelIndex(this.props.user)
          .then(res => {
            this.setState({ channels: res.data.channels })
          })
      })
      .catch(error => {
        this.props.msgAlert({
          heading: 'Channel delete failed ' + error.message,
          message: messages.deleteChannelFailure,
          variant: 'danger'
        })
      })
  }

  // updateChannel = (event) => {
  //   event.preventDefault()

  //   const channelId = event.target.name
  //   const updateChannelData = this.state.channel.uData
  //   channelUpdate(this.props.user, channelId, updateChannelData)
  //     .then(() => {
  //       this.setState({ text: '' })
  //       this.props.msgAlert({
  //         heading: 'Channel Updated!',
  //         message: messages.updateMessageSuccess,
  //         variant: 'success'
  //       })
  //     })
  //     .catch(error => {
  //       this.props.msgAlert({
  //         heading: 'Channel update failed ' + error.message,
  //         message: messages.updateMessageFailure,
  //         variant: 'danger'
  //       })
  //     })
  // }

  handleChannelUpdate = (event) => {
    event.persist()
    this.setState(prevState => {
      const uField = {
        'text': event.target.value
      }
      const uData = Object.assign({}, prevState.channel, uField)
      return { chat: uData }
    })
  }

  render () {
    const channels = this.state.channels.map(channel => (
      <li key={channel._id}>
        <Link to={`/channelUpdate/${channel._id}`}>{channel.name}</Link>
        <button className="deleteButton" name={channel._id} onClick={this.onChannelDelete}>Delete</button>
        <Link to={'/channelUpdate/' + channel._id} className="editButton">Edit</Link>
      </li>
    ))
    return (
      <p className="userCreatedChannels">
        {channels}
      </p>
    )
  }
}

export default withRouter(ChannelsCreated)
