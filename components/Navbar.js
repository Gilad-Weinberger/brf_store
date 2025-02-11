import { signIn } from "@/auth";
import Image from "next/image";
import CartButton from "@/components/CartButton";

const Navbar = ({ user }) => {
  return (
    <div className="mb-5 flex w-full items-center justify-between px-4 sm:px-6 lg:px-10">
      <p className="text-[24px] font-semibold sm:text-[30px]">
        BR.<span className="text-gray">F</span>
      </p>
      <div className="mt-2 flex items-center max-sm:hidden">
        <input
          type="search"
          className="w-[400px] rounded-lg bg-light_gray px-3 py-2 text-[15px] focus:outline-none max-md:w-[280px]"
          placeholder="Search..."
        />
        <button className="-ml-8 border-none bg-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </button>
      </div>
      <div className="mt-2 flex items-center gap-4 sm:mt-0 sm:gap-6">
        <CartButton user={user} />
        {user ? (
          <button>
            <Image
              src={user?.image || "/user.svg"}
              alt="profile-image"
              width={32}
              height={32}
              className="rounded-full border border-black"
            />
          </button>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn();
            }}
          >
            <button type="submit" className="px-3 py-1 text-sm font-semibold">
              Sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Navbar;
