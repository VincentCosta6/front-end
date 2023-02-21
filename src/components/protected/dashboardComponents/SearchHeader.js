import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, Paper, InputBase, IconButton, TextField } from "@material-ui/core";
import { Search, Cancel, Trash } from "@material-ui/icons"
import Email from './Email';
import { useStyles } from '../customStyles';
import EmailStore from '../../../stores/email-store';
import ReactModal from "react-modal";
import { customStyles } from "../customStyles";
import CircularProgress from '@material-ui/core/CircularProgress';

import Cookies from "universal-cookie";

let cookies = new Cookies();

const SearchHeader = props => {
    const classes = useStyles();
    const context = useContext(EmailStore);

    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [form, setForm] = useState({
        name: ""
    });
    const [generateVisi, setGenerateVisi] = useState(false);
    const [generateLoading, setGenerateLoading] = useState(false)
    const [generateError, setGenerateError] = useState('')

    const handleChange = e => {
        setSearch(e.currentTarget.value)
    }

    useEffect(_ => {
        const filterEmails = _ => {
            const allEmails = [];
            Object.keys(context.emailMap).forEach(key => {

                for (let i of context.emailMap[key]) {
                    allEmails.push(i)
                }
            })

            const searchText = search.toLowerCase()

            const filteredEmails = allEmails.filter(email => email.from.toLowerCase().includes(searchText) ||
                email.subject.toLowerCase().includes(searchText) ||
                email.text.toLowerCase().includes(searchText))

            setFiltered(filteredEmails);
        }

        if (search && search.length !== 0 && search.length !== "") {
            filterEmails();
        }
        else {
            resetSearch();
        }
    }, [search])

    //|| email.text.includes(search)

    const resetSearch = _ => {
        setSearch("")
        setFiltered([]);
    }

    const handleNameChange = e => {
        let { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleAddressSubmit = e => {
        e.preventDefault();
        setGenerateLoading(true)
        setGenerateError('')

        fetch(`${window.serverURL}/api/addresses`, {
            headers: {
                'Authorization': cookies.get("token"),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({ addresstag: form.name })
        }).then(res => res.json()).then(data => {
            setGenerateVisi(false);
            setGenerateLoading(false)
            context.addAddress(data.saved)
        })
        .catch((err) => {
            setGenerateLoading(false)
            setGenerateError('An error occured while generating a new address')
        })

    }

    const _renderSearchResults = _ => {
        if (search !== "" && filtered.length === 0) {
            return <h1 style={{ color: "var(--font-color)", backgroundColor: "var(--primary-color)", padding: 15, boxShadow: "0 0 4px black" }}>No content matched "{search}"</h1>;
        }
        else {
            return filtered.map((result, i) => <Email key={i} data={result} context={context} />)
        }
    }

    return (
        <>
            <div className="header">
                <Paper>
                    <IconButton disableFocusRipple disableTouchRipple>
                        <Search />
                    </IconButton>
                    <InputBase
                        variant="outlined"
                        className={classes.textField}
                        value={search}
                        onChange={handleChange}
                        placeholder="Search"
                    />
                    <IconButton disableFocusRipple disableTouchRipple onClick={resetSearch}>
                        <Cancel />
                    </IconButton>
                </Paper>

                <Button variant="contained" color="primary" style={{ width: 250 }} onClick={_ => setGenerateVisi(true)}>Generate Inbox</Button>
            </div>
            <div className="filteredEmails">

                {_renderSearchResults()}
            </div>
            <ReactModal
                isOpen={generateVisi}
                onRequestClose={_ => setGenerateVisi(false)}
                style={customStyles}
                contentLabel="Generate Address"
            >
                <h2 style={{ color: "var(--font-color)", marginBottom: 50 }}>Generate a randomized inbox</h2>
                <form onSubmit={handleAddressSubmit} style={{ display: "flex", alignItems: "center", flexDirection: 'column' }}>
                    <TextField variant="outlined" name="name" value={form.name} onChange={handleNameChange} label="Inbox Label" style={{ marginTop: 15 }} fullWidth />
                    <h4 style={{ color:' red' }}>{generateError}</h4>
                    <div style={{ width: '100%', marginTop: 35, display: 'flex', justifyContent: 'space-between' }}>
                        <Button 
                            variant="outlined" 
                            onClick={() => setGenerateVisi(false)}
                            style={{ 
                                color: "red", 
                                borderColor: "red", 
                                textTransform: "none" 
                            }}>Cancel</Button>
                        <Button variant="contained" color="primary" type="submit" style={{ marginLeft: 10, width: 104 }} disabled={generateLoading}>
                            {
                                generateLoading ? <CircularProgress size={25} color="primary" /> : 'Generate'
                            }
                        </Button>
                    </div>
                </form>
            </ReactModal>
        </>

    );

}

export default SearchHeader;