import './Chat.css'
import { KeyboardEvent, useState, useRef, useEffect } from 'react'

type ChatProps = {
    messages: Array<string>,
    submitMsgHandler: (input: string) => void
}

const Chat: React.FC<ChatProps> = ({ messages, submitMsgHandler }) => {
    const [input, setInput] = useState<string>('')
    const historyIndexRef = useRef<number>(-1)
    const messageEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendInput = (): void => {
        setInput("")
        submitMsgHandler(input)
    }

    const handleEnterKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault()
            sendInput()
            historyIndexRef.current = -1
            return
        }

        const regex = /^\S*:\s/
        if (e.key === 'ArrowUp') {
            historyIndexRef.current = historyIndexRef.current + 1
            if (historyIndexRef.current > messages.length - 1) historyIndexRef.current = 0
            e.preventDefault()
            const previousMessage = messages[messages.length - 1 - historyIndexRef.current]
            setInput(previousMessage.replace(regex, ''))
            return
        }

        if (e.key === 'ArrowDown') {
            historyIndexRef.current = historyIndexRef.current - 1
            if (historyIndexRef.current < 0) historyIndexRef.current = messages.length - 1
            e.preventDefault()
            const previousMessage = messages[messages.length - 1 - historyIndexRef.current]
            setInput(previousMessage.replace(regex, ''))
            return
        }
    }

    return (
        <div id='chat'>
            <ul id="chat-list">
                {
                    messages.map((message: string, index: number) =>
                        <li key={index}>{message}</li>
                    )
                }
                <div ref={messageEndRef} />
            </ul>
            <div id='chat-input-container'>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleEnterKeyDown} />
                <button onClick={sendInput}>Send</button>
            </div>
        </div>
    )
}

export default Chat