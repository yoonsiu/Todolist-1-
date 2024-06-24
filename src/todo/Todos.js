import React, {useEffect, useReducer, useRef, useState}from 'react'
import './Todos.css';
//useReducer
//0. initialState 
//1. reducer 구현하기 
//2. dispath 를 사용하기 
//수정 

//기본 state 값 지정 ㄷ
const initialState = {
    count : 1, 
    todos : [
      // {id : 1, item : "빨래하기" , checked: true },
      // {id : 2, item : "공부하기" , checked: false }
    ]
}
const reducer = (state, action)=>{
  console.log(state, action)
    switch(action.type){
        case "ADD" : 
            return {
                ...state, 
                count : state.count + 1, 
                todos : [...state.todos, { id:state.count, item : action.payload , checked: false } ]
            }
            case "DEL" : 
            return {
                ...state, 
                todos : state.todos.filter(item=>item.id !== action.payload) 
            }
            case "TOGGLE" : 
            return {
                ...state, 
                todos : state.todos.map(item => item.id === action.payload ? 
                  {...item, checked : !item.checked}: item) 
            }
            case "EDIT" : 
            return {
                ...state, 
                todos : state.todos.map(item => item.id === action.payload.id ? 
                  action.payload : item) 
            }
            default : 
            return state;

    }
}
//목록보기, 입력 , 삭제, 수정
//item = {id, item, checked: false }
const Todos = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const todoRef = useRef();
  //{current : input}
  const addHandle = ()=>{
    dispatch({type : "ADD", payload : todoRef.current.value})
    todoRef.current.value = ""
  }
  //커서 깜박깜박 
  useEffect(()=>{
    if(todoRef.current) todoRef.current.focus()
  },[])

  const deleteHandle = (id) =>{
    dispatch({type : "DEL", payload : id})
  }
  const checkedHandle = (id) =>{
    dispatch({type : "TOGGLE", payload : id})
  }
  const [isEdit, setIsEdit] = useState(0); // 수정 버튼이 클릭된 todo의 id 
  const [editTodo, setEditTodo] = useState(null); // 수정된 todo 
  const editRef = useRef();

  useEffect(()=>{
    if(editRef.current){
      editRef.current.focus();
    }
  },[isEdit])
  const editHandle = (id) =>{
    setIsEdit(id)
    const find = state.todos.find(item=>item.id === id)
    setEditTodo(find)
  }
  const editSaveHandle = () =>{
   dispatch({type : "EDIT", payload : editTodo})
   setIsEdit(0);
   setEditTodo(null)
  }
    
  return (
    <>
    <h3>TODO LIST </h3>
    <div className='TodoList'>
      <input type="text" 
             ref = { todoRef }
            //  value = { todoRef.current.value }
      />
      <button onClick={ addHandle }>추가</button>
    </div>
    <div>
      { 
        state.todos.map(todo=>
            
            <div key={todo.id}>
                <span>{ todo.id }</span>
                <input type="checkbox"  id={`id${todo.id}`}  checked={todo.checked} 
                      onChange={ ()=> checkedHandle( todo.id )}
                />

                {
                isEdit > 0 && todo.id === isEdit ? (
                  <>
                      <input type="text"
                             ref = { editRef }
                             value = { editTodo.item }
                             onChange={()=>setEditTodo( {...editTodo, item : editRef.current.value})}
                      />
                      <button onClick={ ()=> editSaveHandle() }>저장</button>
                  </>
                )  : (
                  <>
                      <label htmlFor={`id${todo.id}`}
                        style={{ textDecoration : todo.checked ? "line-through" : "none"}}
                    >{ todo.item}</label> 
                    
                    <button onClick={ ()=> editHandle(todo.id) }>수정</button>
                  </>
                )
              }

              <button onClick={ ()=> deleteHandle(todo.id) }>삭제</button> 
            </div>
        )
      }
    </div>
  
  </>
  )}
    
    
            
     


export default Todos
