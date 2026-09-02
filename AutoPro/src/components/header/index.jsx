import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Logo, Menu , Menu2, SearchContainer,} from "./style";
import { FiSearch, FiShoppingCart} from "react-icons/fi";

const Header = () =>{
  const navigate = useNavigate();

  return (
        <Container>
            <Logo> 
                
                <b> AutoPro</b>
                
            </Logo>
            <Menu2> 
                <ul>
                <li> Blankes </li>
                <li> Engines </li>
                <li> Suspension </li>
                <li> Oil </li>
                </ul>
            </Menu2>
           
                
            <Menu>
                <ul>
                <SearchContainer>

                  <FiSearch className="search-icon" />
                <input type="text" placeholder="Buscar peças..." />
            </SearchContainer>
                    
                        <li className="cart-item">
                             <FiShoppingCart/>


                        </li>
                  
                </ul>
            </Menu>
        </Container>
    )
    
}
export default Header;