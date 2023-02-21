import React, { useState, useEffect, useCallback } from "react";


import EmailStore from "../../stores/email-store";

import ReactModal from "react-modal";


import "../../CSS/Dashboard.css"

import SearchHeader from './dashboardComponents/SearchHeader';
import WebsocketHandler from './dashboardComponents/WebsocketHandler'
import CircularProgress from '@material-ui/core/CircularProgress';

import { addressesList, emailData } from './DummyData';
import { AddressList } from './dashboardComponents/AdressList';
import { ViewEmail, Email } from './dashboardComponents/Email';
import "../../CSS/Dashboard.css"
import { customStyles } from './customStyles';

import Cookies from "universal-cookie";
import { Parser } from "html-to-react";
let cookies = new Cookies();


ReactModal.setAppElement('#root')

export const fetchAdresses = _ => {
    return new Promise(function (resolve, reject) {
        fetch(`${window.serverURL}/api/addresses`, {
            headers: {
                'Authorization': cookies.get("token")
            }
        }).then(res => res.json()).then(data => {
            resolve(data);
        })
    })
}

export const fetchEmails = id => {
    return new Promise(function (resolve, reject) {
        fetch(`${window.serverURL}/api/messages/${id}`, {
            headers: {
                'Authorization': cookies.get("token")
            }
        }).then(res => res.json()).then(data => {
            resolve(data);
        })
    })
}

export default _ => {
    const [websocket, setWebsocket] = useState(null)
    const [websocketOpen, setWebsocketOpen] = useState(false)
    const [addressArr, setAddressArr] = useState([])
    const [addressMap, setAddressMap] = useState({})
    const [emailMap, setEmailMap] = useState({})

    const [emailVisible, setEmailVisible] = useState(false);
    const [emailData, setEmailData] = useState({});

    const [addressesLoading, setAddressesLoading] = useState(true)
    const [emailsLoading, setEmailsLoading] = useState(true)

    const [error, setError] = useState('')

    const addAddress = (addressInfo) => {
        setAddressArr([...addressArr, addressInfo])

        setAddressMap({ ...addressMap, [addressInfo.id]: addressInfo })
        setEmailMap({ ...emailMap, [addressInfo.id]: [] })
    }

    const removeAddress = (addressID) => {
        setAddressArr(addressArr.filter(address => address.id !== addressID))
        const newAddressMap = { ...addressMap }
        delete newAddressMap[addressID]
        setAddressMap(newAddressMap)
        const newEmailMap = { ...emailMap }
        delete newEmailMap[addressID]
        setEmailMap(newEmailMap)
    }

    const addEmail = useCallback((emailInfo) => {
        const addressID = emailInfo.address_id
        const newEmailMap = [...emailMap[addressID], emailInfo]
        setEmailMap({
            ...emailMap,
            [addressID]: newEmailMap
        })
    }, [emailMap])

    const removeEmail = (addressID, emailID) => {
        setEmailMap({
            ...emailMap,
            [addressID]: emailMap[addressID].filter(email => email.id !== emailID)
        })
    }

    const setEmailVisi = value => {
        setEmailVisible(value);
    }
    const setEmailContent = data => {
        setEmailData(data);
    }

    const fetchEmailsData = async () => {
        setError('')
        try {
            setAddressesLoading(true)

            const addressList = await fetchAdresses()
            const addressMap = addressList.reduce((acc, address) => {
                acc[address.id] = address
                return acc
            }, {})

            setAddressArr(addressList)
            setAddressMap(addressMap)
            setAddressesLoading(false)
            setEmailsLoading(true)

            const fetchEmailsPromiseArr = addressList.map(emailInfo => fetchEmails(emailInfo.id))
            const results = await Promise.all(fetchEmailsPromiseArr)

            const finalObj = {}
            for (let i = 0; i < addressList.length; i++) {
                const emailInfo = addressList[i]
                const emailList = results[i]

                finalObj[emailInfo.id] = emailList
            }

            setEmailsLoading(false)
            setEmailMap(finalObj)
        } catch(err) {
            setError('Error occured while retrieving info. Please try refreshing the page')
            setAddressesLoading(false)
            setEmailsLoading(false)
            console.log(err)
        }
    }

    useEffect(() => {
        if (websocketOpen) {
            fetchEmailsData()
        }
    }, [websocketOpen])

    const _renderLoading = () => {
        if (addressesLoading) {
            return (
                <div className="loading-container">
                    <CircularProgress size={60} color="primary" />
                    <h1 style={{ color: 'var(--font-color)' }}>Addresses Loading</h1>
                </div>
            )
        } else if (emailsLoading) {
            return (
                <div className="loading-container">
                    <CircularProgress size={60} color="primary" />
                    <h1 style={{ color: 'var(--font-color)' }}>Emails Loading</h1>
                </div>
            )
        } else if (error) {
            return (
                <div className="loading-container">
                    <h1 style={{ color: 'var(--font-color)' }}>{error}</h1>
                </div>
            )
        }
    }

    return (
        <EmailStore.Provider value={{
            websocket,
            setWebsocket,
            websocketOpen,
            setWebsocketOpen,
            openEmail: _ => setEmailVisi(true),
            closeEmail: _ => setEmailVisi(false),
            setEmailContent,
            addressArr,
            addressMap,
            emailMap,
            addEmail,
            addAddress,
            removeAddress,
            removeEmail,
        }}>
            <div className="dash-container">
                <div className="title">
                    <h1>Your Inboxes</h1>
                    <WebsocketHandler addEmail={addEmail} />
                </div>
                <div className="emails">
                    <SearchHeader />
                    {
                        (addressesLoading || emailsLoading || error) ? 
                            _renderLoading() : 
                            <AddressList />
                    }
                </div>
                <ReactModal
                    isOpen={emailVisible}
                    onRequestClose={_ => setEmailVisi(false)}
                    style={customStyles}
                    contentLabel={"Email"}
                >
                    <ViewEmail data={emailData} />
                </ReactModal>
            </div>
        </EmailStore.Provider>
    );
}

