import './App.css'
import Board from './components/Board'
import ButtonGeneric from './components/ButtonGeneric'
import Chat from './components/Chat'
import JoinScreen from './components/JoinScreen'
import { socket } from './socket'
import { useState, useEffect, useCallback } from 'react'

const App: React.FC = () => {
  const [messages, setMessages] = useState<Array<string>>([])
  const [user, setUser] = useState<string>('')
  const [room, setRoom] = useState<string>('')
  const [joined, setJoined] = useState<boolean>(false)

  const reqRefreshChat = useCallback(() => {
    socket.emit('chat-reqRefresh', user)
  }, [user])

  useEffect(() => {
    if (joined) reqRefreshChat()
  }, [joined, reqRefreshChat])

  const onMessageIn = (message: string) => {
    console.log(message)
    setMessages(prev => [...prev, message])
  }

  const onRefreshChat = (messages: Array<string>) => {
    console.log(messages)
    setMessages(messages)
  }

  const submitHandler = (input: string) => {
    if (input) {
      socket.emit('chat-clientOrigin', input)
    }
  }

  const handleJoin = (username: string, roomname: string) => {
    setUser(username)
    setRoom(roomname)
    socket.emit('username set', username)
    socket.emit('room set', roomname)
    setJoined(true)
  }

  useEffect(() => {
    socket.on('chat-serverOrigin', onMessageIn)
    socket.on('chat-refresh', onRefreshChat)

    return () => {
      socket.off('chat-serverOrigin', onMessageIn)
    }
  }, [])

  return (joined ? (
    <>
      <h1>{`${room}: ${user}`}</h1>
      <ButtonGeneric buttonText='Refresh' clickFunction={() => reqRefreshChat()} />
      <div id='main'>
        <Board />
        <Chat messages={messages} submitMsgHandler={submitHandler} />
      </div>
    </>
  ) : (
    <>
      <JoinScreen joinHandler={handleJoin} />
    </>
  ))
}

export default App
