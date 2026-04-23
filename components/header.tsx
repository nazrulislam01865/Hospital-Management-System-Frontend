"use client"

import { useEffect } from "react";

export default function Header({props}:{props?: any}) {
    const page = props?.page ||"";
    useEffect(() => {
        document.title = page;
    }, []);
    return (
        <>
            <head>
                <title>Hospital Management System</title>
            </head>

            <header>
                <h1>Hospital Management {page}</h1>
                <nav>
                    <a href="/">Home</a>
                    <a href="/login">login</a>
                    <a href="/contact">Contact</a>
                </nav>
            </header>
        </>

    );
}