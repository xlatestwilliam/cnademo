'use client'

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

  const searchParams = useSearchParams()
  const tokenParam = searchParams.get('token')

  const urlParams: URLSearchParams | undefined = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : undefined;
  const tokenParamTrad = urlParams?.get('token');

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;

    if (typeof window !== 'undefined'){
      effectRan.current = true;
      const xl = new Widget({
        // callbackUrl: 'https://test-370.xsollasitebuilder.com/',
        projectId: '9ab24938-123a-4f91-bb64-ecaf31026e83',
        preferredLocale: 'en_US',
        url: 'https://login-widget-ng-stage-2024-08-26-01.gcp-k8s-login-stage.srv.local/latest',
      });
      xl.mount('widget');
    }
  },[])

  const initialTodos = {
    count: 0,
    todos: []
  }

  const reducer = (state: Todo, action: TodoAction): Todo => {
    switch(action.type){
      case 'add':
        {
          const newTodo = {
            id: state.count + 1,
            info: action.text || ''
          }

          return {
            count: state.count + 1,
            todos: [...state.todos, newTodo]
          }
        }
      case 'delete':
        {
          const idx = state.todos.findIndex(i => i.id === action.id);

          const splicedTodo = Object.assign([], state.todos);
          splicedTodo.splice(idx, 1)

          return {
            count: state.count - 1,
            todos: splicedTodo
          }
        }
      default:
        return state
    }
  }

  const [todosState, dispatch] = useReducer(reducer, initialTodos);
  const [loading, setLoading] = useState<boolean>(false)


  const callWeather = async (input: string) => {
    let responseData;

    try {
      setLoading(true)
      let url = 'http://api.weatherapi.com/v1/current.json';
      const key = '36249b1de26d462dbcd41022240204';
      url += '?' + new URLSearchParams(`key=${key}&q=${input}`)
      const response = await fetch(url,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if(!response.ok){
        throw new Error ('bad request')
      }

      responseData = response.json()
    } catch (error) {
      console.log('error')
    } finally {
      setLoading(false)
    }

    return responseData
  }

  const handleAdd = async (location: string) => {
    
    if(!location){
      return
    }

    const weather = await callWeather(location)
    console.log(weather)
    const locationName = weather.location.name;
    const locationCountry = weather.location.country;
    const locationTemp = weather.current.temp_c;

    dispatch({type: 'add', text: `Location: ${locationName}, ${locationCountry} Temp: ${locationTemp}C`})
  }

  const handleDelete = (id: number) => {
    dispatch({type: 'delete', id})
  }

  const TodoList = (todo: TodoArr) => {
    return (
      <div className="Todo">
        <span className="TodoText">{todo.info}</span>
        <button className="RemoveTodo" onClick={() => handleDelete(todo.id)}>Remove</button>
      </div>
    )
  }

  const AddTodo = () => {

    const [text, setText] = useState<string>('')

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
      setText(e.target.value)
    }

    return (
      <div className="AddTodo">
        <input value={text} onChange={handleInput} className="AddTodoInput"/>
        <button className="AddTodoButton" onClick={() => {
          handleAdd(text)
          setText('')
        }}>
        ADD
        </button>
      </div>
    )
  }

  const [loading2, setLoading2] = useState<boolean>(false)

  console.log('loading2',loading2)

  const handleClick = () => {
    setLoading2(true);
    window.location.href = 'https://test-login.xsolla.com/api/social/babka/login_redirect?projectId=0a77b0f4-9f3b-48c8-a91c-e61ae13fb473&locale=en_XX&phone_only=true'; // Redirect to Google
  };

  return (
    // <>
    //   {/* <div>This is a test</div> */}
    //   {/* <div id="widget" style={{height:'100vh'}}></div> */}
    //   <button>
    //     <Image src='/xsollalink.png' alt="icon" width={200} height={200} />
    //   </button>
    // </>
    
    // <div>
    //   <AddTodo/>
    //   {
    //     todosState.todos.map((item, index) => {
    //       return (
    //         <TodoList {...item}/>
    //       )
    //     })
    //   }
    // </div>
    <div style={styles.container}>
      {loading2 ? (
        <div style={styles.spinner}></div>
      ) : (
      <button style={styles.button} onClick={handleClick}>
        <Image src='/xsollalink.png' alt="icon" width={400} height={400} style={styles.image} />
      </button>
      )}
    </div>
  )
}
