import {createGlobalStyle} from "styled-components";

export default createGlobalStyle`
    *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    }

    html, body, #root {
        height: 100%;
    }

    :root{
    --primary: #DC2626;
    --secondary: #0F172A;
    --tertiary: #475569;
    --neutral: #f8fafc;
    --white: #FFF;

}
    body{
        background-color: var(--white);
        color: var(--secondary);
        font-size: 1rem;
        font-family: "Inter", sans-serif;
        font-weight: 400;
        
    }
    ul{list-style:none;}
    a{text-decoration:none;}
`

