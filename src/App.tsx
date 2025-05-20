import './App.css'
import Board from './components/Board'
// import ButtonGeneric from './components/ButtonGeneric'
import Chat from './components/Chat'
import JoinScreen from './components/JoinScreen'
import { socket } from './socket'
import { useState, useEffect, useCallback, useRef } from 'react'

const App: React.FC = () => {
  const [messages, setMessages] = useState<Array<string>>([])
  const [user, setUser] = useState<string>('')
  const [room, setRoom] = useState<string>('')
  const [joined, setJoined] = useState<boolean>(false)
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const reqRefreshChat = useCallback(() => {
    socket.emit('chat-reqRefresh', user)
  }, [user])

  useEffect(() => {
    if (joined) reqRefreshChat()
  }, [joined, reqRefreshChat])

  const onMessageIn = (message: string): void => {
    setMessages(prev => [...prev, message])
  }

  const onRefreshChat = (messages: Array<string>): void => {
    setMessages(messages)
  }

  const submitHandler = (input: string): void => {
    if (input) {
      socket.emit('chat-clientOrigin', input)
    }
  }

  const handleJoin = (username: string, roomname: string): void => {
    setUser(username)
    setRoom(roomname)
    socket.emit('username set', username)
    socket.emit('room set', roomname)
    setJoined(true)
  }

  useEffect(() => {
    const clearIntervalOnReconnect = (): void => {
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current)
        socket.emit('username set', user)
        socket.emit('room set', room)
        reqRefreshChat()
        console.log(`Reconnected!`)
      }
    }

    socket.on("connect", clearIntervalOnReconnect)

    return (): void => {
      socket.off('connect', clearIntervalOnReconnect)
    }
  }, [user, room, reqRefreshChat])

  useEffect(() => {
    socket.on('chat-serverOrigin', onMessageIn)
    socket.on('chat-refresh', onRefreshChat)

    type JoinCallbackResp = {
      userName: string,
      roomName: string
    }
    const setUserAndRoom = (response: JoinCallbackResp): void => {
      setUser(response.userName)
      setRoom(response.roomName)
    }

    socket.on('chat-join-callback', (response: JoinCallbackResp) => setUserAndRoom(response))

    socket.on("disconnect", (reason) => {
      console.log(`Disconnected at ${new Date().toLocaleTimeString()}:`, reason)

      if (reason === "transport error") {
        if (reconnectIntervalRef.current) clearInterval(reconnectIntervalRef.current)

        reconnectIntervalRef.current = setInterval(() => {
          const timestamp = new Date().toLocaleTimeString()
          console.log(`Reconnect attempt at ${timestamp}...`)

          socket.connect() // Attempt reconnect
        }, 5000) // Try every 5 seconds
      }
    })

    return (): void => {
      socket.off('chat-serverOrigin', onMessageIn)
      socket.off('chat-refresh', onRefreshChat)
      socket.off('chat-join-callback', setUserAndRoom)
    }
  }, [])

  return (joined ? (
    <>
      <h1>{`${room}: ${user}`}</h1>
      {/* <ButtonGeneric buttonText='Refresh' clickFunction={() => reqRefreshChat()} /> */}
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
