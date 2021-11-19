import { createGlobalStyle } from "styled-components";
import TodoList from "./TodoList";

const GlobalStyle = createGlobalStyle``;
export default function App() {
  return (
    <>
      <GlobalStyle /> 
      <TodoList />
    </>
  );
}
