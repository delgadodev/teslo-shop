export const revalidate = 0;

import { Title } from "@/components";

import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";
import UsersTable from "./ui/UsersTable";
import { getPaginatedUsers } from "@/actions/users/get-paginated-users";

export default async function usersPage() {
  const { ok, users = [] } = await getPaginatedUsers();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />
      </div>
    </>
  );
}
