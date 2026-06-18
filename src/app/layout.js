import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "School Grid",
	description: "This is school management system",
};

let user = "admin";
let isLogin = true;

export default function RootLayout({children}) {
   

	
		return (
			<html lang="en">
				<body>
					<Providers>

					{children}

					</Providers>
				</body>
			</html>
		);
	
}
