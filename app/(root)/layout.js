import { auth } from "@/auth";
import getUser from "@/lib/getUser";
import Navbar from "@/components/Navbar";

export default async function BaseLayout({ children }) {
  const session = await auth();
  const is_authenticated = Boolean(session?.user);
  let user = session?.user;

  // Check if the user is authenticated and the email exists
  if (is_authenticated && user?.email) {
    // Fetch the user details from the database and update the user variable
    user = await getUser({
      name: user.name || "Unknown User",
      email: user.email,
      image: user.image || "/user.svg",
    });
  }

  return (
    <div className="px-8 py-5">
      <Navbar user={user} />
      {children}
    </div>
  );
}
