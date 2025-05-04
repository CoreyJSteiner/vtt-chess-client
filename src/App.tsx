import './App.css'
import Board from './components/Board'
import Chat from './components/Chat'
import { socket } from './socket'
import { useState, useEffect } from 'react'

const App: React.FC = () => {
  const [messages, setMessages] = useState<Array<string>>([]);

  const onMessageIn = (message: string) => {
    console.log(message)
    setMessages(prev => [...prev, message]);
  }

  const submitHandler = (input: string) => {
    if (input) {
        socket.emit('chat-clientOrigin', input)
    }
  }


  useEffect(() => {
    //Socket Listeners
    socket.emit('username set', 'Corey')
    socket.emit('room set', '1')
    socket.on('chat-serverOrigin', onMessageIn)

    return () => {
      socket.off('chat-serverOrigin', onMessageIn)
    };
  }, []);

  return (
    <>
        <Board />
        <Chat messages={messages} submitMsgHandler={submitHandler}/>
    </>
  )
}

export default App
