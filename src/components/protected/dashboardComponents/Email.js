import React from 'react';
import sanitizeHTML from "sanitize-html"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrashAlt} from "@fortawesome/free-solid-svg-icons";

import { Parser } from "html-to-react";
import Cookies from "universal-cookie";

let cookies = new Cookies();
const htmlToReact = new Parser();

const Email = ({ data, context }) => {

    const deleteEmail = e => {
        e.stopPropagation();
        fetch(`${window.serverURL}/api/messages/${data.id}`, {
            headers: {
                'Authorization': cookies.get("token"),
            },
            method: "DELETE"
        }).then(res => res.json()).then(data => {
            console.log(data);
        })
    }

    return (
        <div className = "email" onClick = {_ => clickEmail(data, context)}>
            <div>
                <h3>From: {data.from}</h3>
                <h3>Subject: {data.subject}</h3>
            </div>
            <div onClick = {deleteEmail}>
                <FontAwesomeIcon icon = {faTrashAlt} style = {{ color: "red", cursor: "pointer" }}  />
            </div>
        </div>
    );
}

const ViewEmail = ({ data }) => {

    let sanitized = sanitizeHTML(data.html, {
        allowedTags: sanitizeHTML.defaults.allowedTags.concat([ "img", "h1", "h2" ]),
        allowedAttributes: { "*": ['style'] }
    })

    return (
            <div className = "email-view">
                <div className = "title">
                    <h1>From: {data.from}</h1>
                    <h1>Subject: {data.subject}</h1>
                </div>
                <div className = "email-port">
                    { htmlToReact.parse(sanitized) }
                </div>
            </div>
    );
}







const clickEmail = (data, context) => {
    context.setEmailContent(data);
    context.openEmail();
}

export default Email;
export {ViewEmail};