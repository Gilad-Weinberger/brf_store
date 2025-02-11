import { auth } from "@/auth";
import getUser from "@/lib/getUser";
import Product from "@/components/Product";

export default async function ProductPage({ params }) {
  const { id } = await params;

  const session = await auth();
  const is_authenticated = Boolean(session?.user);
  let user = session?.user;

  if (is_authenticated && user?.email) {
    user = await getUser({
      name: user.name || "Unknown User",
      email: user.email,
      image: user.image || "/user.svg",
    });
  }

  console.log(user); // Should now contain _id, email, name, image

  return user ? <Product id={id} user={user} /> : <div></div>;
}
