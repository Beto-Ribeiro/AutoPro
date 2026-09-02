import { createGlobalStyle} from "styled-components";

export default createGlobalStyle`

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

:root{
    --primary: #dc2626;
    --secondary: #0f172a;
    --tertiary: #475569;
    --neutral: #f8fafc;
    --white: #fff
}
body{
    background-color: var(--neutral);
    font-size: 1.2rem;
    font-weight: 400;
    font-family: "Inter", sans-serif;
}
ul{list-style-type : none;}
a{text-decoration: none;}

`