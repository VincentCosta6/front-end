import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { TextField, Button } from "@material-ui/core";

import "../CSS/Login.css"

import history from "../history";
import Cookies from "universal-cookie";
let cookies = new Cookies();

export default _ => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
            <Nav isLogin />
            <div className="login-container">
                <img src = "./spoof-mail-logo.jpg"></img>
                <div className={"info " + (isLogin ? "isLogin" : "isSignup")}>
                    <div className="login-choice">
                        <div className={isLogin ? "active" : ""} onClick={_ => setIsLogin(true)} left="true">Login</div>
                        <div className={!isLogin ? "active" : ""} onClick={_ => setIsLogin(false)} left="false">Signup</div>
                    </div>

                    {isLogin ? <LoginComponent /> : <SignupComponent />}
                </div>
            </div>
        </>
    );
}

const LoginComponent = props => {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState(false);
    const [requested, setRequested] = useState(false);

    useEffect(_ => {
        document.title = "Login"
    }, [])

    const handleChange = e => {
        const { name, value } = e.target; // Future expandability for username
        setForm({ ...form, [name]: value });
    }

    const handleSuccess = res => {
        setRequested(false);
        if(res.status !== 200) {
            setError(true);
        }
        else {
            res.json().then(data => {
                cookies.set("token", data.token);
                history.push("/dashboard");
            })
        }
    }

    const handleError = err => {
        console.log(err);
        setRequested(false);
    }

    const handleSubmit = e => {
        e.preventDefault();
        setRequested(true);
        setError(false);

        fetch(`${window.serverURL}/api/auth/login`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(form)
        })
        .then(handleSuccess)
        .catch(handleError)
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField 
                label="Username" 
                variant = "outlined" 
                value={form.username} 
                onChange={handleChange} 
                type = "text" 
                name = "username" 
            />
            <TextField 
                label="Password" 
                variant = "outlined" 
                value={form.password} 
                onChange={handleChange} 
                type = "password" 
                name = "password" 
            />

            <p style = {{ color: "red" }}>{error ? "Username or password incorrect" : ""}</p>

            <Button variant="contained" color="primary" type = "submit">
                {requested ? "Checking..." : "Log in"}
            </Button>
        </form>
    );
}

const SignupComponent = props => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    })
    const [formError, setError] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    })
    const [requested, setRequested] = useState(false);

    useEffect(_ => {
        document.title = "Signup";
    }, [])

    const handleChange = e => {
        let { name, value } = e.target;

        value = value.trim();

        setForm({ ...form, [name]: value });
    }

    const handleSuccess = res => {
        setRequested(false);
        if(res.status !== 201 && res.status !== 200) {
            setError({
                ...formError,
                username: "Username taken"
            });
        }
        else {
            res.json().then(data => {
                cookies.set("token", data.token);
                history.push("/dashboard");
            })
        }
    }

    const handleError = err => {
        console.log(err);
        setRequested(false);
    }

    const handleSubmit = e => {
        e.preventDefault();
        let newErrors = {
            username: "",
            password: "",
            confirmPassword: ""
        }

        setRequested(true);

        Object.keys(form).forEach(key => {
            if(!form[key] || form[key] === "" || form[key].length === 0) {
                newErrors[key] = "Field cannot be blank";
            }
            setError(newErrors);
            return;
        })

        if(form['password'] !== form['confirmPassword']) {
            newErrors = {
                ...newErrors,
                password: "Passwords dont match",
                confirmPassword: "Passwords dont match"
            }
            setError(newErrors);
            return;
        }

        fetch(`${window.serverURL}/api/auth/register`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ username: form.username, password: form.password })
        })
            .then(handleSuccess)
            .catch(handleError)
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField 
                label="Username" 
                variant = "outlined" 
                value={form.username} 
                onChange={handleChange} 
                type = "text" 
                name = "username" 
                error = {formError.username !== ""}
                helperText = {formError.username}
            />
            <TextField 
                label="Password" 
                variant = "outlined" 
                value={form.password} 
                onChange={handleChange} 
                type = "password" 
                name = "password" 
                error = {formError.password !== ""}
                helperText = {formError.password}
            />
            <TextField 
                label="Confirm Password" 
                variant = "outlined" 
                value={form.confirmPassword} 
                onChange={handleChange} 
                type = "password" 
                name = "confirmPassword" 
                error = {formError.confirmPassword !== ""}
                helperText = {formError.confirmPassword}
            />

            <Button variant="contained" color="primary" type = "submit">
                {requested ? "Creating account..." : "Create Account"}
            </Button>
        </form>
    );
}