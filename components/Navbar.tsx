import options from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Logout from "./Logout";

const Navbar = async () => {
  const session = await getServerSession(options);

  return (
    <header className="bg-gray-600 text-gray-100">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <div>My Site</div>
        <div className="flex items-center gap-10">
          <Link href="/">Home</Link>
          <Link href="/CreateUser">Create user</Link>
          <Link href="/ClientMember">Client Member</Link>
          <Link href="/Member">Sever Member</Link>
          <Link href="/Public">Public</Link>
          {session ? <Logout /> : <Link href="/auth/signIn">Login</Link>}
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
