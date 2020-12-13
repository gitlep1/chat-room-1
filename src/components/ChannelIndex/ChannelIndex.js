import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { channelIndex, createChannel } from '../../api/channel'

const createChannelStyle = {
  color: 'red'
}

class Channels extends Component {
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

    onChannelCreate = (event) => {
      event.preventDefault()

      const { msgAlert, user, history } = this.props
      createChannel(this.state.channel, user)
        .then(response => {
          this.setState({
            createdId: response.data._id
          })
        })
        .then(props => {
          channelIndex(this.props.user)
            .then(res => {
              this.setState({ channels: res.data.channels })
            })
        })
        .then(() => history.push('/chats'))
        .then(() => msgAlert({
          heading: 'Channel Created',
          message: messages.createChannelSuccess,
          variant: 'success'
        }))
        .catch(error => {
          this.setState({ text: '' })
          msgAlert({
            heading: 'Channel Creation Failed ' + error.message,
            message: messages.createChannelFailure,
            variant: 'danger'
          })
        })
    }

    render () {
      return (
        <div className="row">
          <Link to="/chats" className="backButton">Back</Link>
          <div className="col-sm-10 col-md-8 mx-auto mt-5">
            <h3 className="createChannelStyle" style={createChannelStyle}>Create a Channel</h3>
            <Form onSubmit={this.onChannelCreate}>
              <Form.Group controlId="name">
                <Form.Control
                  required
                  type="text"
                  name="name"
                  placeholder="Enter Your Channels Name"
                  value={this.state.channel.name}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </div>
        </div>
      )
    }
}

export default withRouter(Channels)
