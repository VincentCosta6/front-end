import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'

import EmailContext from '../../../stores/email-store'

import Cookies from "universal-cookie";
let cookies = new Cookies();

export default (props) => {
    const context = useContext(EmailContext)

    const [interval, setIntervalState] = useState(null)

    const websocket = useRef(null)

    const handleNewMessage = useCallback((msg) => {
        if (msg.data.includes('Success')) return

        const message = JSON.parse(msg.data).finalMessage
        props.addEmail(message)
    }, [context.emailMap, props.addEmail])

    const connectWebsocket = () => {
        websocket.current = new WebSocket(`wss://spoofmail-us.herokuapp.com/ws?token=${cookies.get("token")}`)
        websocket.current.onopen = () => {
            context.setWebsocketOpen(true)
            setIntervalState(setInterval(() => {
                if (websocket.current.readyState === WebSocket.OPEN) {
                    websocket.current.send(JSON.stringify({ msg: 'ping' }))
                }
            }, 15000))
        }

        websocket.current.onerror = () => {

        }

        websocket.current.onclose = () => {
            connectWebsocket()
            console.log('closed')
            context.setWebsocketOpen(false)
        }
    }

    useEffect(() => {
        connectWebsocket()
        return () => {
            if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                websocket.current.close()
                websocket.current = null
            }
            if (interval) {
                clearInterval(interval)
            }
        };
    }, [])

    useEffect(() => {
        if (!websocket.current) return

        websocket.current.onmessage = handleNewMessage
    })

    return <></>
}
