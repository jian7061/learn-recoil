import { useState } from "react";
import { useForm } from "react-hook-form";

// export default function TodoList() {
//   const [todo, setTodo] = useState("");
//   const onChange = (e: React.FormEvent<HTMLInputElement>) => {
//     setTodo(e.currentTarget.value);
//   };
//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log(todo);
//   };
//   return (
//     <div>
//       <form onSubmit={onSubmit}>
//         <input onChange={onChange} value={todo} placeholder="write a to do" />
//         <button>Add</button>
//       </form>
//     </div>
//   );
// }

export default function TodoList() {
  const { register, watch } = useForm();
  console.log(watch());
  return (
    <div>
      <form>
        <input {...register("email")} placeholder="Email" />
        <input {...register("firstName")} placeholder="First Name" />
        <input {...register("lastName")} placeholder="Last Name" />
        <input {...register("userName")} placeholder="User Name" />
        <input {...register("password")} placeholder="Password" />
        <input {...register("password1")} placeholder="Password1" />
        <button>Add</button>
      </form>
    </div>
  );
}
