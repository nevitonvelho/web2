import { SessionProvider } from "next-auth/react";
import AuthCheck from "../components/AuthCheck";
import NavBar from "../components/NavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tecnologias = 'Angularjs'

  return (
    <html lang="en">
      <body>

        <div className="hero">
          <NavBar/>
          {/* <AuthCheck/> */}
        </div>

        <div className="max-w-[1200px] m-auto ">
        <div className=" ">
            <SessionProvider>{children}</SessionProvider>
        </div>
        </div>
      </body>
    </html>
  );
}
