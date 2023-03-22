import React from 'react'
import { TextField } from '@mui/material'
import { Button } from 'react-admin'
import { indigo } from '@mui/material/colors'

const matchCognitoPassword = password => {
  var format = /[!@#$%^&*()_+\-=]/
  if (password.length < 8) {
    return false
  } else if (!format.test(password)) {
    return false
  } else if (!/\d/.test(password)) {
    return false
  } else if (!/[A-Z]/.test(password)) {
    return false
  }
  return true
}

export const submit = (password, confirmPassword) => {
  if (password === '') {
    alert('Le mot de passe ne peut pas être vide.')
    return false
  } else if (password !== confirmPassword) {
    alert('Les mots de passe ne correspondent pas !')
    return false
  } else if (!matchCognitoPassword(password)) {
    alert(
      'Le mot de passe doit : \n - avoir au moins 8 caractères \n - avoir au moins une majuscule \n - avoir au moins un caractère spécial !@#$%^&*()_+-= \n - avoir au moins un chiffre'
    )
    return false
  } else {
    return true
  }
}

export const CustomTextField = ({ placeholder, onChange, type }) => (
  <TextField
    variant='filled'
    placeholder={placeholder}
    type={type}
    onChange={onChange}
    style={{
      margin: '0.75vw',
      width: '300px'
    }}
  />
)

export const CustomSubmitButton = ({ text, onClick }) => {
  return (
    <Button
      onClick={onClick}
      style={{
        backgroundColor: indigo[800],
        width: '300px',
        color: '#FFFF',
        padding: '0.5vw',
        margin: '0.75vw'
      }}
    >
      {text}
    </Button>
  )
}
