import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'

// import socket.io to establish socket connection with server
import io from 'socket.io-client'

import { chatIndex, createMessage, chatDelete } from '../../api/chat'
import ChannelsCreated from '../ChannelsCreated/ChannelsCreated'
import '../../pages/thirdPage.scss'

// const channelStyle = {
//   outline: 'none'
// }

// const navBarHomeStyle = {
//   color: 'white',
//   borderRadius: '30%',
//   top: '-15%'
// }

// let socketUrl
// const socketUrls = {
//   production: 'wss://mychatroomm.herokuapp.com',
//   development: 'ws://localhost:4741'
// }
// // const socket = io(socketUrl, {
// //   reconnection: false
// // })
// if (window.location.hostname === 'localhost') {
//   socketUrl = socketUrls.development
// } else {
//   socketUrl = socketUrls.production
// }

class Chats extends Component {
  constructor (props) {
    super(props)
    this.state = {
      chats: [],
      chat: {
        text: ''
      }
    }
  }

  handleChange = event => this.setState({
    [event.target.name]: event.target.value
  })

  componentDidMount () {
    // After Page Loads perform Axios Index Request for Chat Resource
    const { user, msgAlert } = this.props
    chatIndex(user)
      .then(res => {
        this.setState({ chats: res.data.chats })
      })
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
    // // define what you will be listening for here
    // socket.on('connect', () => {
    //   socket.emit('join')
    // })
    // // Alert Other Users this User Has Disconnected/Closed the Page
    // socket.on('disconnect', () => {
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
      .then(() => this.setState({ chat: {
        text: '' } }))
      .then(() => msgAlert({
        heading: 'Sent!',
        message: messages.createMessageSuccess,
        variant: 'success'
      }))
      // Next make form clear on submit
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

    const chatId = event.target.name

    chatDelete(this.props.user, chatId)
      .then(() => {
        this.setState({ chat: {
          text: '' } })
        this.props.msgAlert({
          heading: 'Message Deleted!',
          message: messages.deleteMessageSuccess,
          variant: 'success'
        })
      })
      .then(props => {
        chatIndex(this.props.user)
          .then(res => {
            this.setState({ chats: res.data.chats })
          })
      })
      .catch(error => {
        this.props.msgAlert({
          heading: 'You are not the owner of this message ' + error.message,
          message: messages.deleteMessageFailure,
          variant: 'danger'
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
        <p className='chatTextStyle'>{chat.text}</p>
        <button name={chat._id} onClick={this.onMessageDelete} className="deleteButton">Delete</button>
        <Link to={'/update/' + chat._id} className="editButton">Edit</Link>
      </li>
    ))

    // const changeColor = (
    //   <input type="text" id="InputText">
    //     <input type="color" id="InputColor">
    //       <input type="button" id="colorButton" value="select color" onClick="changeColor()">
    //       </input>
    //     </input>
    //   </input>
    // )

    return (
      <div className="indexBody">
        <div
          className="createdChannels">
          Created Channels
          <Link to="/channelCreator" className="channelCreator">Create A Channel</Link>
          <output type="text" name="channel[name]" className="channelsCreated">
            <ChannelsCreated
              user={this.props.user}
              msgAlert={this.props.msgAlert}
            />
          </output>
        </div>
        <div className="defaultChannels">Default Channels
          {/* <button type="button" className="channel1" style={channelStyle}>English1</button>
          <button type="button" className="channel2" style={channelStyle}>English2</button> */}
          {/* <button type="button" className="channel3" style={channelStyle}>Spanish1</button>
          <button type="button" className="channel4" style={channelStyle}>Spanish2</button>
          <button type="button" className="channel5" style={channelStyle}>Japanese1</button>
          <button type="button" className="channel6" style={channelStyle}>Japanese2</button> */}
        </div>
        <div className="chat">
          <output type="text" name="chat[text]" className="sentMessage">
            <ul className="chatArray">
              {chats}
              {/* {changeColor} */}
            </ul>
          </output>
          <textarea
            className="typeMessage"
            placeholder="Type A Message Here"
            name="text"
            value={this.state.chat.text}
            onChange={this.handleInputChange}
          />
          <form onSubmit={this.onCreateMessage}className="typeMessageForm">
            <button type="submit" className="sendMessageButton"></button>
          </form>
        </div>
        {/* <p className="misc">MISC</p> */}
      </div>
    )
  }
}
export default withRouter(Chats)
