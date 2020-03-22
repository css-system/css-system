import {useGlobalCss, useKeyframes} from "css-system"
import React, {useState} from "react"
import {ThemeProvider} from "./ThemeProvider"
import {View} from "./View"
import {Button} from "./Button"
import {Text} from "./Text"
import {Input} from "./Input"

const initialTodos = [
  {
    id: 4,
    text: "Create a typed helper for easy primitive creation",
    completed: false,
  },
  {
    id: 3,
    text: "Allow themed keyframes creation",
    completed: true,
  },
  {
    id: 2,
    text: "Allow themed global styles creation",
    completed: true,
  },
  {
    id: 1,
    text: "Create yet another css-in-js library",
    completed: true,
  },
]

const App = () => {
  const [todos, setTodos] = useState(initialTodos)

  const fadeIn = useKeyframes({
    from: {opacity: 0},
    to: {opacity: 1},
  })

  useGlobalCss({
    body: {
      m: 0,
      fontSize: {_: 2, m: 3},
      fontFamily: "Arial",
      bg: "background",
      color: "backgroundText",
    },
    "*, *:before, *:after": {
      boxSizing: "border-box",
    },
  })

  const [pendingTodo, setPendingTodo] = useState("")

  const handlePendingTodoChange = event => {
    setPendingTodo(event.target.value)
  }

  const handlePendingTodoAdd = () => {
    setPendingTodo("")
    setTodos([{id: Date.now(), text: pendingTodo, completed: false}, ...todos])
  }

  const handleTodoRemove = todoToRemove => {
    setTodos(todos.filter(todo => todo !== todoToRemove))
  }
  const handleTodoCompleteToggle = todoToComplete => {
    setTodos(
      todos.map(todo => {
        if (todo !== todoToComplete) {
          return todo
        }
        return {
          ...todoToComplete,
          completed: !todoToComplete.completed,
        }
      })
    )
  }

  return (
    <View>
      <View
        css={{
          bg: "primary",
          color: "primaryText",
          alignItems: {_: "stretch", s: "center"},
          p: {_: 2, m: 3},
          gap: {_: 2, m: 3},
        }}
      >
        <Text css={{fontSize: {_: 5, s: 6, m: 7, l: 8}}}>
          The CSS-System Todolist
        </Text>
        <View
          css={{
            flexDirection: {_: "column", s: "row"},
            justifyContent: "center",
            gap: {_: 2, m: 3},
          }}
        >
          <Input
            autoFocus
            placeholder="Do something great"
            value={pendingTodo}
            onChange={handlePendingTodoChange}
          ></Input>
          <Button
            css={{bg: "accent", color: "accentText"}}
            disabled={pendingTodo.trim().length === 0}
            onClick={handlePendingTodoAdd}
          >
            Add todo
          </Button>
        </View>
      </View>

      <View
        css={{
          "& >  * + *": {
            borderTop: "1px solid",
            borderTopColor: "divider",
          },
        }}
      >
        {todos.map(todo => {
          return (
            <View
              key={todo.id}
              css={{
                animation: `250ms ${fadeIn} linear both`,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 3,
                p: {_: 2, m: 3},
              }}
            >
              <Button
                onClick={() => handleTodoCompleteToggle(todo)}
                css={
                  !todo.completed
                    ? {
                        color: "transparent",
                        "&:hover": {
                          color: "lightPrimary",
                        },
                      }
                    : undefined
                }
                deps={[todo.completed]}
              >
                ✓
              </Button>
              <Text
                css={{
                  flex: "1",
                  color: todo.completed && "secondaryBackgroundText",
                  textDecoration: todo.completed ? "line-through" : "normal",
                }}
                deps={[todo.completed]}
              >
                {todo.text}
              </Text>
              <Button onClick={() => handleTodoRemove(todo)}>&times;</Button>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
