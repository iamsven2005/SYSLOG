import { LdapUsersTable } from "./client";

export default function IdapPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">LDAP Users</h1>
      <LdapUsersTable/>
    </main>
  )
}
