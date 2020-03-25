import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';


const formSchema = yup.object().shape({
    name: yup.string().required("Please enter your name."),
    email: yup.string().email().required("Must include an email."),
    password: yup.string().required("Must require a password."),
    terms: yup.boolean().oneOf([true],"You must agree to the Terms of Service")
})

export default function Form() {

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""  
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: "" 
    })
    
    const [buttonDisabled, setButtonDisabled] = useState(true)
    
    const [post, setPost] = useState([]);

    useEffect(()=>{
        formSchema.isValid(formState)
        .then(valid => {
            setButtonDisabled(!valid)
        })
    }
    , [formState])


    const validateChange = event => {
        yup
        .reach(formSchema, event.target.name)
        .validate(event.target.name)
        .then(valid => {
            setErrors({
                ...errors,
                [event.target.name]: ""
            })
        })
        .catch( error => {
            setErrors({
                ...errors,
                [event.target.name]: error.errors
            })
        })
    }

    const formSubmit = event => {
        event.preventDefault()
        axios
        .post("https://reqres.in/api/users", formState)
        .then(res => {
            setPost(res.data)
            console.log("success", post)
            setFormState({
                name: "",
                email: "",
                password: "",
                terms: ""     
            })
        })
        .catch(error => {
            console.log(error.res)
        })
    }

    const inputChange = event => {
        event.persist()
        const newFormData = {
            ...formState, [event.target.name]:
            event.target.type === "checkbox" ? event.target.checked : event.target.value
        }
        validateChange(event)
        setFormState(newFormData)
    }

    return(
        <form onSubmit={formSubmit}>
            <label htmlFor="name"> Name
                <input
                id='name'
                name='name'
                type='text'
                value={formState.name}
                onChange={inputChange}
                />
            </label >
            <br/>
            <label htmlFor='email'> Email
                <input 
                id='email'
                name='email'
                type='text'
                value={formState.email}
                onChange={inputChange}
                />
            </label>
            <br/>
            <label htmlFor='password'> Password
                <input
                id='password'
                name='password'
                type='text'
                value={formState.password}
                onChange={inputChange}
                />
            </label>
            <br/>
            <label htmlFor='Terms'>
                <input
                id='terms'
                name='terms'
                type='checkbox'
                value={formState.terms} 
                onChange={inputChange}
                />
                Terms of Service
            </label>
            <br/>
            <label htmlFor='submit'>
                <pre>{JSON.stringify(post, null, 2)}</pre>
                <button disabled={buttonDisabled}>Submit</button>
            </label>
        </form>
    )
}