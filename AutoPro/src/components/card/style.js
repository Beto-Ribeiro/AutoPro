import styled from "styled-components";

export const Container= styled.div`

width: 20%;
margin-bottom: 12px;
background-color: var(--white);
box-shadow: 2px 2px 2px 2px  rgba(0,0,0,0.1);
border-radius: 10px; 

  &:hover{
        cursor: pointer;
        background-color: var(--gray)
    }
  

`
export const Img= styled.div`
width:100%;

    img{
        width: 100%;
        height: auto;
        
        
        
        
    }

`
export const Description= styled.div`
padding: 12px;

a{
    display: flex;
    justify-content:space-between;
    align-items: center;
    color: var(--secondary);
}
h4{
    font-size:0.9 rem;
    font-weight: 600px;
    margin-top: 10px
}

`
export const Itens = styled.div`
display: flex;
justify-content: flex-start;
flex-direction: column;

span{
    margin-bottom: 10px;
}

`
