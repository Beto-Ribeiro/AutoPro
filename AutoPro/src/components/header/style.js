import styled from "styled-components";

export const Container = styled.div`
  padding: 25px 30px;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  background-color: var(--white);
`;

export const Logo = styled.div`
  margin-left: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--primary);

  img {
    width: 150px;
  }

  b {
    margin-top: 5px;
    font-size: 25px;
  }
`;

export const Menu = styled.div`
  margin-left: auto;
  
  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 5px;
      color: var(--primary);
      font-size: 15px;
      display: flex;
      align-items: center;

      &:hover {
        cursor: pointer;
      }
    }

    li.cart-item {
      margin-right: 10px;
      flex-shrink: 0;
      color: var(--tertiary);
      
      &:hover{
        cursor: pointer;
        color: var(--primary);
      }
      
      svg {
        font-size: 20px;
      }
    }
  }
`;

export const Menu2 = styled.div`
  display: flex;
  align-items: center;
  margin-left: 40px;
  margin-top: 5px;

  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-right: 20px;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      color: var(--tertiary);
      padding: 10px;
      font-size: 15px;

      &:hover {
        cursor: pointer;
        color: var(--primary);
      }
    }
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f7; 
  border: 1px solid #b0b0b0; 
  padding: 8px 10px;
  width: 100%;
  max-width: 350px; 
  margin: 0 10px;
  cursor: text;

  &:hover {
    border-color: var(--primary);
    
    input {
      cursor: text;
    }
  }

  .search-icon {
    color: #666666;
    font-size: 20px;
    margin-right: 10px;
    flex-shrink: 0;
    pointer-events: none;
  }

  input {
    width: 100%;
    border: none;
    background: transparent;
    outline: none;
    font-size: 16px;
    color: #333333;
    cursor: text;
    
    &::placeholder {
      color: #888888;
    }
  }

  &:focus-within {
    border-color: var(--primary);
    background-color: #f0f0f2;
  }
`