import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAddMessageMutation, useGetMessagesQuery } from '../../../../redux/services/messagesApi'
import { USER } from '../../../../shared/constants'
import { useTranslation } from 'react-i18next'
import socket from './sockets/socket'
import { MessageInput, MessageList } from './components'
import handleSendMessage from './utils/handleSendMessage'

const Chat = () => {
  const { data: messages = [], refetch: refetchMessage } = useGetMessagesQuery()
  const [addMessage] = useAddMessageMutation()
  const { username } = JSON.parse(localStorage.getItem(USER))

  const { t } = useTranslation()
  const activeChannel = useSelector((state) => state.channels)
  const activeChannelMessages = messages.filter(
    (message) => message.channelId === activeChannel.activeChannelId
  )

  const [input, setInput] = useState('')

  useEffect(() => {
    socket.on('newMessage', () => {
      refetchMessage()
    })

    return () => {
      socket.off('newMessage')
    }
  }, [refetchMessage])

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b># {activeChannel.activeChannelName}</b>
          </p>
          <span className="text-muted">{activeChannelMessages.length ?? 0} сообщений</span>
        </div>
        <MessageList messages={activeChannelMessages} />
        <MessageInput
          input={input}
          setInput={setInput}
          handleSendMessage={(e) =>
            handleSendMessage(e, input, setInput, addMessage, activeChannel, username, t)
          }
        />
      </div>
    </div>
  )
}

export default Chat
