import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main className="mt-15"> {children} </main>
            <Footer />
        </>
    );
}
