'use client'

import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import { Widget } from '@xsolla/login-sdk';
import { useEffect, useReducer, useState } from 'react';
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

export default function Home() {

  const searchParams = useSearchParams()
  const tokenParam = searchParams.get('token')

  const urlParams: URLSearchParams | undefined = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : undefined;
  const tokenParamTrad = urlParams?.get('token');

  // useEffect(() => {
  //   if (typeof window !== 'undefined'){
  //     const xl = new Widget({
  //       callbackUrl: 'https://test-370.xsollasitebuilder.com/',
  //       projectId: '8fd9bf2f-ec9a-11ec-b9f0-42010aa80004',
  //       preferredLocale: 'en_US'
  //     });
  //     xl.mount('widget');
  //   }
  // },[])

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

  return (
    <div id="widget" style={{height:'100vh'}}></div>
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
  )
}
