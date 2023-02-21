import React from "react";

export default React.createContext({ 
    emailVisible: false,
    websocket: {},
    websocketOpen: false,
    setWebsocketOpen: (status) => {},
    addressArr: [],
    addressMap: {},
    emailMap: {},
    setEmailData: _=>{}, 
    setEmails: _=>{}, 
    addAddress: (info) => {},
    addEmail: (emailInfo) => {},
    removeEmail: (addressID, emailID) => {},
    removeAddress: (addressID) => {},
});