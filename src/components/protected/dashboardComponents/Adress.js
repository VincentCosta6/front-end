import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, Paper, InputBase, IconButton, TextField } from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp, Trash } from "@material-ui/icons";
import EmailList from './EmailList';
import EmailStore from "../../../stores/email-store";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCopy } from "@fortawesome/free-solid-svg-icons";

import Cookies from "universal-cookie";
let cookies = new Cookies();

const style = { color: "var(--font-color)", fontSize: "2rem", cursor: "pointer" }

const Address = ({ data, emails, id }) => {
    const context = useContext(EmailStore);

    const [expanded, setExpanded] = useState(false);

    const [nameEdit, setNameEdit] = useState(data.addresstag);
    const [editMode, setEditMode] = useState(false);

    const [hoverMode, setHoverMode] = useState(false);

    const _renderChevron = _ => {
        if (!expanded) return <KeyboardArrowDown style={style} onClick={_ => setExpanded(true)} />
        else return <KeyboardArrowUp style={style} onClick={_ => setExpanded(false)} />
    }

    const _renderName = _ => {
        if (editMode) return <form onSubmit={handleEditBlur}><TextField value={nameEdit} onChange={handleNameEdit} onBlur={handleEditBlur} /></form>;
        else return <h3 onClick={_ => setEditMode(true)}>{nameEdit}</h3>;
    }

    const handleEditBlur = e => {
        e.preventDefault();
        setEditMode(false);
    }

    const handleNameEdit = e => {
        setNameEdit(e.target.value);
    }

    const _renderEmail = _ => {
        if (hoverMode) return <h3 onMouseLeave={handleMouseLeave} style={{ cursor: "pointer", border: "1px solid var(--font-color)", padding: 5 }} onClick={handleHoverClick}>{data.addressname} <FontAwesomeIcon icon={faCopy} /></h3>;
        else return <h3 onMouseOver={handleMouseOver} >{data.addressname}</h3>;
    }

    const handleMouseOver = _ => {
        setHoverMode(true);
    }

    const handleMouseLeave = _ => {
        setHoverMode(false);
    }

    const handleHoverClick = _ => {
        navigator.clipboard.writeText(data.addressname);
    }

    const onRemove = _ => {
        fetch(`${window.serverURL}/api/addresses/${id}`, {
            headers: {
                'Authorization': cookies.get("token"),
            },
            method: "DELETE"
        }).then(res => res.json()).then(data => {
            console.log(data);
        })
    }

    return (
        <div className="address">
            <div className="title">
                <div>
                    {_renderChevron()}
                    {_renderName()}
                    {_renderEmail()}
                    <h3>{data.emails}</h3>
                </div>
                <Button variant="outlined" style={{ color: "red", borderColor: "red", textTransform: "none" }} onClick = {onRemove}>Remove</Button>
            </div>
            <div className="email-list" style={{ display: expanded ? "flex" : "none" }}>
                <EmailList context={context} id = {id}/>
            </div>
        </div>
    );
}

export default Address;