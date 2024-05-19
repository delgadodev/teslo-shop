"use client";
import { changeUserRole } from "@/actions/users/change-user-role";
import { User } from "@/interfaces/user.interface";

interface Props {
  users: User[];
}

const UsersTable = ({ users }: Props) => {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 busers-b">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Email
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Nombre completo
          </th>

          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Actualizar Rol
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((users) => (
          <tr
            className="bg-white busers-b transition duration-300 ease-in-out hover:bg-gray-100"
            key={users.id}
          >
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {users.email}
            </td>
            <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {users.name}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 ">
              <select
                value={users.role}
                onChange={(e) => changeUserRole(users.id, e.target.value)}
                className="text-sm text-gray-900 w-full p-2"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
