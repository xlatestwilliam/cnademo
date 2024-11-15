'use client'
import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import { Widget } from '@xsolla/login-sdk';
import { useEffect, useReducer, useState, useRef } from 'react';
import styled from 'styled-components'

type TodoArr = {
  id: number;
  info: string;
}

type Todo = {
  count: number,
  todos: TodoArr[]
}

type TodoAction =  {
  type: string;
  text?: string;
  id?: number
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height to center vertically
    backgroundImage: 'url("/background.png")', // Path to the local background image in the public folder
    backgroundSize: 'cover', // Cover the whole area
    backgroundPosition: 'center', // Center the background image
    backgroundRepeat: 'no-repeat', // Prevent repeating
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    padding: '10px',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  image: {
    marginRight: '8px', // Space between image and text
  },
  spinner: {
    border: '4px solid #ffffff',
    borderRadius: '50%',
    borderTop: '4px solid #ffffff',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  // Add keyframes for spinner animation
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default function Home() {

  const [loading2, setLoading2] = useState<boolean>(false)

  const handleClick = () => {
    setLoading2(true);
    window.location.href = 'https://login.xsolla.com/api/social/babka/login_redirect?projectId=1727b387-858d-11ec-8589-42010aa80004&locale=en_XX&phone_only=true&login_url=https%3A%2F%2Fwallet.xsolla.com%2Fxsolla-link-subscribe%20'; // Redirect to Google
  };

  return (
    <React.Suspense fallback={<div style={styles.spinner}></div>}>
    <div style={styles.container}>
      {loading2 ? (
        <div style={styles.spinner}></div>
      ) : (
      <button style={styles.button} onClick={handleClick}>
        <Image src='/xsollalink.png' alt="icon" width={400} height={400} style={styles.image} />
      </button>
      )}
    </div>
    </React.Suspense>
  )
}
