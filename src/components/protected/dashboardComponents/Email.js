import React from 'react';
import sanitizeHTML from "sanitize-html"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrashAlt} from "@fortawesome/free-solid-svg-icons";

import { Parser } from "html-to-react";
import Cookies from "universal-cookie";
import { PinDropSharp } from '@material-ui/icons';

let cookies = new Cookies();
const htmlToReact = new Parser();

const Email = ({ data, context, deleteEmail }) => {
    const handleDeleteEmail = e => {
        e.stopPropagation();
        fetch(`${window.serverURL}/api/messages/${data.id}`, {
            headers: {
                'Authorization': cookies.get("token"),
            },
            method: "DELETE"
        }).then(res => res.json()).then(data => {
            deleteEmail(parseInt(data.id))
        })
    }

    return (
        <div className = "email" onClick = {_ => clickEmail(data, context)}>
            <div>
                <h3>From: <span>{data.from}</span></h3>
                <h3>Subject: <span>{data.subject}</span></h3>
            </div>
            <div onClick = {handleDeleteEmail}>
                <FontAwesomeIcon icon = {faTrashAlt} style = {{ color: "red", cursor: "pointer" }}  />
            </div>
        </div>
    );
}

const ViewEmail = ({ data }) => {

    let sanitized = sanitizeHTML(data.html, {
        allowedTags: sanitizeHTML.defaults.allowedTags.concat([ "img", "h3", "h2", "a" ]),
        allowedAttributes: { "*": ['style', "href"] }
    })

    return (
            <div className = "email-view">
                <div className = "title">
                    <h3>From: <span>{data.from}</span></h3>
                    <h3>Subject: <span>{data.subject}</span></h3>
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