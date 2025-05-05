import './JoinScreen.css'
import { useState, KeyboardEvent } from 'react'

type JoinScreenProps = {
    joinHandler: (username: string, roomanme: string) => void
}

const JoinScreen: React.FC<JoinScreenProps> = ({ joinHandler }) => {
    const [inputUsername, setInputUsername] = useState<string>('')
    const [inputRoomname, setInputRoomname] = useState<string>('')

    const handleEnterKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            joinHandler(inputUsername, inputRoomname)
        }
    }

    return (
        <div id='join-screen'>
            <textarea
                id='input-username'
                onChange={(e) => setInputUsername(e.target.value)}
                value={inputUsername}
                onKeyDown={handleEnterKeyDown} />
            <textarea
                id='input-roomname'
                onChange={(e) => setInputRoomname(e.target.value)}
                value={inputRoomname}
                onKeyDown={handleEnterKeyDown} />
            <button id='join-button' onClick={() => joinHandler(inputUsername, inputRoomname)}>
                Join
            </button>
        </div>
    )
}

export default JoinScreen
