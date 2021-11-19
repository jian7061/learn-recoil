import { useState } from "react";

export default function TodoList() {
  const [todo, setTodo] = useState("");
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setTodo(e.currentTarget.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(todo);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={todo} placeholder="write a to do" />
        <button>Add</button>
      </form>
    </div>
  );
}
