import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import messages from '../AutoDismissAlert/messages'
// import socket.io to establish socket connection with server
import io from 'socket.io-client'
// import ThirdTitle from '../../titles/thirdTitle'
import { chatIndex, createMessage, chatDelete } from '../../api/chat'

import '../../pages/thirdPage.scss'

import { chatIndex, createMessage, chatDelete } from '../../api/chat'

import '../../pages/thirdPage.scss'

const navBarHomeStyle = {
  color: 'white',
  borderRadius: '30%',
  top: '-15%'
}

const channelStyle = {
  outline: 'none'
}

let socketUrl
const socketUrls = {
  production: 'wss://aqueous-atoll-85096.herokuapp.com',
  development: 'ws://localhost:4741'
}
if (window.location.hostname === 'localhost') {
  socketUrl = socketUrls.development
} else {
  socketUrl = socketUrls.production
}
class Chats extends Component {
  constructor (props) {
    super(props)
    // console.log('this is ', this)

    this.state = {
      chats: [],
      chat: {
        text: ''
      }
    }
  }

  componentDidMount () {
    // After Page Loads perform Axios Index Request for Chat Resource
    const { user, msgAlert } = this.props
    chatIndex(user)
      .then(res => {
        // console.log(res)
        this.setState({ chats: res.data.chats })
      })
      // .then(console.log(this.state))
      // .then(() => {
      //   msgAlert({
      //     heading: 'Chat Thread Refreshed',
      //     variant: 'success',
      //     message: 'Chat room has now loaded, send a message to get started.'
      //   })
      // })
      .catch(err => {
        msgAlert({
          heading: 'Chat Thread Failed to Load',
          variant: 'danger',
          message: 'Chat Error Message: ' + err.message
        })
      })
    // Initialize the Server Side Socket
    // const socket = io(socketUrl, {
    //   reconnection: false
    // })
    // define what you will be listening for here
    // socket.on('connect', () => {
    //   // console.log(socket)
    //   socket.emit('join')
    // })
    // // Alert Other Users this User Has Disconnected/Closed the Page
    // socket.on('disconnect', () => {
    //   // console.log(socket)
    // })
    // listen for messages and update the chat index when one is received
    // socket.on('message', data => {
    //   this.setState({
    //     chats: data
    //   })
    // })
  }

  handleInputChange = (event) => {
    event.persist()

    this.setState(prevState => {
      const updatedField = {
        [event.target.name]: event.target.value
      }
      const updatedData = Object.assign({}, prevState.chat, updatedField)

      return { chat: updatedData }
    })
  }

  onCreateMessage = (event) => {
    event.preventDefault()

    const { msgAlert } = this.props

    const { user } = this.props
    console.log(this.state)
    createMessage(this.state.chat, user)
      .then(response => {
        this.setState({
          createdId: response.data._id

        })
      })
      .then(props => {
        chatIndex(this.props.user)
          .then(res => {
            this.setState({ chats: res.data.chats })
          })
      })
      // Next make form clear on submit
      .then(() => this.setState({ chat: {
        text: '' } }))

      .then(() => msgAlert({
        heading: 'Sent!',
        message: messages.createMessageSuccess,
        variant: 'success'
      }))

      .catch(error => {
        this.setState({ text: '' })
        msgAlert({
          heading: 'Message failed ' + error.message,
          message: messages.createMessageFailure,
          variant: 'danger'
        })
      })
  }

  onMessageDelete = (event) => {
    event.preventDefault()

    const { msgAlert } = this.props
    const { user } = this.props

    chatDelete(this.chats._id, user)
    // console.log('this is the id ' + this.chats.id)
      .then(response => {
        this.setState({
          deleteId: response.data._id
        })
        console.log('this is the resss' + response)
          .then(() => {
            this.setState({ text: '' })
            msgAlert({
              heading: 'Message Deleted!',
              message: messages.deleteMessageSuccess,
              variant: 'success'
            })
          })
          .catch(error => {
            msgAlert({
              heading: 'Message delete failed ' + error.message,
              message: messages.deleteMessageFailure,
              variant: 'danger'
            })
          })
      })
  }

  // onChangeColor () {
  //   const color = document.getElementById('InputText').value
  //   document.body.style.backgroundColor = color
  // }

  render () {
    const chats = this.state.chats.map(chat => (
      <li key={chat._id}>
        <Link to={`/chats/${chat._id}`}>{chat.title}</Link>
        <button onClick={this.onMessageDelete}>Delete </button>
        <Link to={'/chat-update/' + chat._id}>Update Chat </Link>
        <Link to={`/chats/${chat._id}`}>{chat.text}</Link>
      </li>
    ))
    return (
      <div>
        <Navbar.Brand href="#/chats" style={navBarHomeStyle}>
          Home
        </Navbar.Brand>
        <p
          className="channels">
          Created Channels
          <Link to="/channelCreator" className="channelCreator">Create A Channel</Link>
          <p className="defaultChannels">Default Channels
            <button type="button" className="channel1" style={channelStyle}>English1</button>
            <button type="button" className="channel2" style={channelStyle}>English2</button>
            {/* <button type="button" className="channel3" style={channelStyle}>Spanish1</button>
            <button type="button" className="channel4" style={channelStyle}>Spanish2</button>
            <button type="button" className="channel5" style={channelStyle}>Japanese1</button>
            <button type="button" className="channel6" style={channelStyle}>Japanese2</button> */}
          </p>
        </p>
        <form onSubmit={this.onCreateMessage} className="typeMessageForm">
          <div className="chat">
            <textarea
              className="typeMessage"
              placeholder="Type A Message Here"
              name="text"
              value={this.state.chat.text}
              onChange={this.handleInputChange}
            />
            <button type="submit" className="sendMessageButton"></button>
            {/* <textarea className="typeMessage" type="text" name="chat[text]" placeholder="Type Your Message Here"></textarea> */}
            <output type="text" name="chat[text]" className="sentMessage">
              <ul className="chatArray">
                {chats}
              </ul>
            </output>
          </div>
        </form>
        <p className="misc">MISC</p>
      </div>
    )
  }
}
export default withRouter(Chats)
